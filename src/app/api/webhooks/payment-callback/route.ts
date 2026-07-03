import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createHmac, timingSafeEqual } from 'crypto'
import { db } from '@/lib/db'
import { triggerOrderConfirmedWebhook } from '@/lib/n8n'

const schema = z.object({
  orderId: z.string().min(1),
  status: z.enum(['success', 'failed', 'pending', 'refunded']),
  signature: z.string(),
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
 * Compute the expected HMAC signature for the given payload.
 *
 * Signature = HMAC-SHA256(secret, orderId + status)
 */
function computeSignature(secret: string, orderId: string, status: string): string {
  return createHmac('sha256', secret).update(orderId + status).digest('hex')
}

/**
 * POST /api/webhooks/payment-callback
 *
 * Receives payment confirmations from the external payment gateway company.
 * The request body MUST contain a valid HMAC signature computed over
 * `orderId + status` using the shared `PAYMENT_WEBHOOK_SECRET`.
 *
 * Expected payload:
 * {
 *   "orderId": "string",
 *   "status": "success" | "failed" | "pending" | "refunded",
 *   "signature": "hex-string"
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'invalid_payload' },
        { status: 400 }
      )
    }

    const { orderId, status, signature } = parsed.data

    // --- HMAC signature verification (C2) ---
    let secret: string
    try {
      secret = getWebhookSecret()
    } catch {
      // Fail-closed in production if the secret is not configured.
      return NextResponse.json(
        { error: 'server_misconfigured' },
        { status: 500 }
      )
    }

    const expectedSignature = computeSignature(secret, orderId, status)

    let signatureValid = false
    try {
      signatureValid = safeEqualHex(signature, expectedSignature)
    } catch {
      signatureValid = false
    }

    if (!signatureValid) {
      return NextResponse.json(
        { error: 'invalid_signature' },
        { status: 401 }
      )
    }

    const booking = await db.booking.findUnique({
      where: { id: orderId },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'order_not_found' },
        { status: 404 }
      )
    }

    if (status === 'success') {
      if (booking.status === 'PENDING') {
        await db.booking.update({
          where: { id: orderId },
          data: { status: 'CONFIRMED' },
        })

        // Trigger n8n webhook
        try {
          await triggerOrderConfirmedWebhook(orderId)
        } catch (e) {
          console.error('n8n webhook failed:', e)
        }
      }
      return NextResponse.json({ success: true })
    } else {
      // Payment failed — mark as PAYMENT_FAILED
      await db.booking.update({
        where: { id: orderId },
        data: { status: 'PAYMENT_FAILED' },
      })
      return NextResponse.json({ success: true, status: 'payment_failed' })
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error'
    console.error('Payment callback error:', message, error)
    return NextResponse.json(
      { error: 'internal_error' },
      { status: 500 }
    )
  }
}
