import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createHmac, timingSafeEqual } from 'crypto'
import { db } from '@/lib/db'
import { triggerOrderConfirmedWebhook } from '@/lib/n8n'

// ===== V9 Fix #3: Webhook replay protection =====
//
// The previous implementation had three vulnerabilities:
//   1. Signature = HMAC(secret, orderId + status) — no timestamp/nonce,
//      so a captured webhook could be replayed indefinitely.
//   2. The `else` branch unconditionally set CONFIRMED → PAYMENT_FAILED
//      (and any status → PAYMENT_FAILED) without a state guard, allowing
//      a malicious or buggy payment gateway to downgrade bookings.
//   3. No idempotency tracking — the same webhook sent twice would
//      execute the side effects twice (e.g. n8n fan-out).
//
// The fix:
//   - Signature now covers body + timestamp + nonce (headers
//     X-Webhook-Timestamp / X-Webhook-Nonce / X-Webhook-Signature).
//   - Timestamp must be within MAX_TIMESTAMP_SKEW of server time.
//   - Each (orderId, nonce) pair is logged in SecurityLog before the
//     booking update; a replay returns 200 already_processed without
//     re-running side effects.
//   - A `validTransitions` map enforces the booking status state
//     machine: PENDING → CONFIRMED | PAYMENT_FAILED | CANCELLED,
//     CONFIRMED → COMPLETED | CANCELLED (no downgrade), etc.

const MAX_TIMESTAMP_SKEW_MS = 5 * 60 * 1000 // 5 minutes

const bodySchema = z.object({
  orderId: z.string().min(1),
  status: z.enum(['success', 'failed', 'pending', 'refunded']),
})

/**
 * Resolve the payment webhook signing secret. Fail-closed in production.
 */
function getWebhookSecret(): string {
  const isProduction = process.env.NODE_ENV === 'production'
  const secret = process.env.PAYMENT_WEBHOOK_SECRET

  if (secret && secret.length >= 16) {
    return secret
  }

  if (isProduction) {
    throw new Error('PAYMENT_WEBHOOK_SECRET must be set in production.')
  }

  console.warn(
    '[payment-callback] WARNING: PAYMENT_WEBHOOK_SECRET is not set. ' +
      'Using dev-only insecure secret. Do NOT use in production.'
  )
  return 'dev-insecure-payment-webhook-secret'
}

/**
 * Constant-time hex string comparison.
 */
function safeEqualHex(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, 'utf8')
  const bBuf = Buffer.from(b, 'utf8')
  if (aBuf.length !== bBuf.length) {
    // Run a comparison to keep timing roughly constant.
    timingSafeEqual(aBuf, aBuf)
    return false
  }
  return timingSafeEqual(aBuf, bBuf)
}

/**
 * Verify the webhook signature.
 *
 * Signature = HMAC-SHA256(secret, rawBody + timestamp + nonce)
 *
 * The raw body, timestamp, and nonce are all part of the signed payload so
 * that:
 *   - Replaying the same body with a different nonce fails signature check.
 *   - Replaying the same (body, nonce) with an old timestamp fails the
 *     skew check (even if the signature were somehow valid).
 *
 * @param rawBody  The raw request body as a string (for stable hashing).
 * @param timestamp The X-Webhook-Timestamp header value (ms since epoch).
 * @param nonce     The X-Webhook-Nonce header value (unique per webhook).
 * @param signature The X-Webhook-Signature header value (hex HMAC).
 * @param secret    The shared signing secret.
 */
function verifyWebhookSignature(
  rawBody: string,
  timestamp: string,
  nonce: string,
  signature: string,
  secret: string
): boolean {
  // 1. Timestamp skew check — reject webhooks older than MAX_TIMESTAMP_SKEW.
  //    This bounds the replay window to 5 minutes.
  const ts = parseInt(timestamp, 10)
  if (isNaN(ts) || Math.abs(Date.now() - ts) > MAX_TIMESTAMP_SKEW_MS) {
    return false
  }

  // 2. Required header presence.
  if (!nonce || !signature) return false

  // 3. Signature = HMAC(secret, rawBody + timestamp + nonce)
  const payload = `${rawBody}${timestamp}${nonce}`
  const expectedSig = createHmac('sha256', secret).update(payload).digest('hex')

  try {
    return safeEqualHex(signature, expectedSig)
  } catch {
    return false
  }
}

/**
 * Booking status state machine.
 *
 * Maps a current status to the set of statuses that may follow it.
 * Any transition not in this map is rejected with 409 invalid_state_transition.
 */
const VALID_BOOKING_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'PAYMENT_FAILED', 'CANCELLED'],
  // CONFIRMED bookings cannot be downgraded to PAYMENT_FAILED by a
  // webhook — the payment already succeeded. Only COMPLETED / CANCELLED
  // are valid follow-ups (and only via admin action, not the webhook,
  // but the map is shared for defense-in-depth).
  CONFIRMED: ['COMPLETED', 'CANCELLED'],
  // PAYMENT_FAILED can be retried (back to PENDING) or cancelled.
  PAYMENT_FAILED: ['PENDING', 'CANCELLED'],
  CANCELLED: [],
  COMPLETED: [],
}

/**
 * Map the payment gateway's status string to the BookingStatus enum.
 */
function gatewayStatusToBookingStatus(
  status: 'success' | 'failed' | 'pending' | 'refunded'
): 'CONFIRMED' | 'PAYMENT_FAILED' | 'PENDING' | 'CANCELLED' | null {
  switch (status) {
    case 'success':
      return 'CONFIRMED'
    case 'failed':
      return 'PAYMENT_FAILED'
    case 'pending':
      return 'PENDING'
    case 'refunded':
      // A refund cancels the booking.
      return 'CANCELLED'
    default:
      return null
  }
}

/**
 * POST /api/webhooks/payment-callback
 *
 * Receives payment confirmations from the external payment gateway.
 *
 * Required headers (V9 Fix #3):
 *   - X-Webhook-Timestamp: ms since epoch (must be within 5 min of server time)
 *   - X-Webhook-Nonce:     unique per webhook (UUID recommended)
 *   - X-Webhook-Signature: hex HMAC-SHA256(secret, rawBody + timestamp + nonce)
 *
 * Expected body:
 *   { "orderId": "string", "status": "success" | "failed" | "pending" | "refunded" }
 *
 * Responses:
 *   200 { success: true }                       — booking updated
 *   200 { success: true, message: "already_processed" } — replay (idempotent)
 *   400 { error: "invalid_json" | "invalid_input" }
 *   401 { error: "invalid_signature" }
 *   404 { error: "order_not_found" }
 *   409 { error: "invalid_state_transition", current, attempted }
 *   503 { error: "server_misconfigured" }
 */
export async function POST(req: NextRequest) {
  try {
    // --- Read the raw body FIRST (V9 Fix #3) ---
    // We need the raw bytes for signature verification — `req.json()` would
    // re-serialize and break the signature. Use `req.text()` then parse.
    let rawBody: string
    try {
      rawBody = await req.text()
    } catch {
      return NextResponse.json(
        { error: 'invalid_json' },
        { status: 400 }
      )
    }

    // --- Parse body defensively (D2): invalid JSON -> 400, not 500 ---
    let body: unknown
    try {
      body = JSON.parse(rawBody)
    } catch {
      return NextResponse.json(
        { error: 'invalid_json' },
        { status: 400 }
      )
    }

    const parsed = bodySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'invalid_input', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const { orderId, status } = parsed.data

    // --- Resolve the signing secret (fail-closed in production) ---
    let secret: string
    try {
      secret = getWebhookSecret()
    } catch {
      // 503 (not 500) so monitoring can distinguish a misconfiguration
      // from a real server error — D3.
      return NextResponse.json(
        { error: 'server_misconfigured' },
        { status: 503 }
      )
    }

    // --- Signature + timestamp + nonce verification (V9 Fix #3) ---
    const timestamp = req.headers.get('x-webhook-timestamp') ?? ''
    const nonce = req.headers.get('x-webhook-nonce') ?? ''
    const signature = req.headers.get('x-webhook-signature') ?? ''

    const signatureValid = verifyWebhookSignature(
      rawBody,
      timestamp,
      nonce,
      signature,
      secret
    )

    if (!signatureValid) {
      return NextResponse.json(
        { error: 'invalid_signature' },
        { status: 401 }
      )
    }

    // --- V10 Fix #9: Idempotency check + state guard + update ALL inside
    //     the Serializable transaction. Previously the idempotency check
    //     was a `findFirst` OUTSIDE the transaction — two concurrent
    //     identical webhooks could both pass the check before either
    //     created the log entry (TOCTOU race). Now the check, the booking
    //     update, and the idempotency log are all inside a single
    //     Serializable transaction so concurrent duplicates are serialized.
    const webhookId = `${orderId}:${nonce}`

    const result = await db.$transaction(
      async (tx) => {
        // 1. Idempotency check INSIDE the transaction.
        const alreadyProcessed = await tx.securityLog.findFirst({
          where: {
            event: 'webhook_processed',
            details: { contains: webhookId },
          },
        })

        if (alreadyProcessed) {
          return { type: 'already_processed' as const }
        }

        // 2. Load the booking inside the transaction.
        const booking = await tx.booking.findUnique({
          where: { id: orderId },
        })

        if (!booking) {
          return { type: 'not_found' as const }
        }

        // 3. State guard — map gateway status to BookingStatus.
        const newStatus = gatewayStatusToBookingStatus(status)
        if (!newStatus) {
          return { type: 'invalid_input' as const, message: `Unknown gateway status: ${status}` }
        }

        // 4. No-op if already in target status.
        if (booking.status === newStatus) {
          await tx.securityLog.create({
            data: {
              event: 'webhook_processed',
              details: JSON.stringify({ webhookId, orderId, status, noop: true }),
            },
          })
          return { type: 'already_in_target' as const }
        }

        // 5. Validate the transition against the state machine.
        if (!VALID_BOOKING_TRANSITIONS[booking.status]?.includes(newStatus)) {
          return {
            type: 'invalid_transition' as const,
            current: booking.status,
            attempted: newStatus,
          }
        }

        // 6. Apply the update + log idempotency atomically.
        await tx.booking.update({
          where: { id: orderId },
          data: { status: newStatus },
        })

        await tx.securityLog.create({
          data: {
            event: 'webhook_processed',
            details: JSON.stringify({
              webhookId,
              orderId,
              gatewayStatus: status,
              fromStatus: booking.status,
              toStatus: newStatus,
            }),
          },
        })

        return { type: 'updated' as const, booking, newStatus }
      },
      { isolationLevel: 'Serializable' }
    )

    // Handle the transaction result outside (HTTP responses can't be
    // returned from inside the transaction callback).
    if (result.type === 'already_processed') {
      return NextResponse.json(
        { success: true, message: 'already_processed' },
        { status: 200 }
      )
    }
    if (result.type === 'not_found') {
      return NextResponse.json(
        { error: 'order_not_found' },
        { status: 404 }
      )
    }
    if (result.type === 'invalid_input') {
      return NextResponse.json(
        { error: 'invalid_input', message: result.message },
        { status: 400 }
      )
    }
    if (result.type === 'already_in_target') {
      return NextResponse.json({ success: true, message: 'already_in_target_status' })
    }
    if (result.type === 'invalid_transition') {
      return NextResponse.json(
        {
          error: 'invalid_state_transition',
          current: result.current,
          attempted: result.attempted,
        },
        { status: 409 }
      )
    }

    // result.type === 'updated' — fire n8n webhook on success → CONFIRMED.
    if (status === 'success' && result.newStatus === 'CONFIRMED') {
      try {
        await triggerOrderConfirmedWebhook(orderId)
      } catch (e) {
        // Don't fail the webhook response — the booking is already
        // confirmed; n8n failure is a separate concern.
        console.error('[payment-callback] n8n webhook failed:', e)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error'
    console.error('Payment callback error:', message, error)
    return NextResponse.json(
      { error: 'internal_error' },
      { status: 500 }
    )
  }
}
