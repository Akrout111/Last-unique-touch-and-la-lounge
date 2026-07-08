import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { timingSafeEqual } from 'crypto'
import { db } from '@/lib/db'
import { triggerOrderConfirmedWebhook } from '@/lib/n8n'

const schema = z.object({
  orderId: z.string().min(1),
})

/**
 * Resolve the shared internal API secret used to authenticate internal calls.
 * Fail-closed in production: throw if INTERNAL_API_SECRET is not set.
 */
function getInternalSecret(): string {
  const isProduction = process.env.NODE_ENV === 'production'
  const secret = process.env.INTERNAL_API_SECRET

  if (secret && secret.length >= 16) {
    return secret
  }

  if (isProduction) {
    throw new Error('INTERNAL_API_SECRET must be set in production.')
  }

  console.warn(
    '[payment-success] WARNING: INTERNAL_API_SECRET is not set. ' +
      'Using dev-only insecure secret. Do NOT use in production.'
  )
  return 'dev-insecure-internal-api-secret'
}

/**
 * Constant-time string comparison for header secrets.
 */
function safeEqualStrings(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, 'utf8')
  const bBuf = Buffer.from(b, 'utf8')
  if (aBuf.length !== bBuf.length) {
    timingSafeEqual(aBuf, aBuf)
    return false
  }
  return timingSafeEqual(aBuf, bBuf)
}

/**
 * POST /api/webhooks/payment-success
 *
 * Internal mock endpoint to simulate payment confirmation.
 * In production, this will be replaced by /api/webhooks/payment-callback
 * which receives real confirmations from the external payment gateway company.
 *
 * Authenticated by the `x-internal-secret` header against INTERNAL_API_SECRET (C3).
 */
export async function POST(req: NextRequest) {
  try {
    // --- Internal secret authentication (C3) ---
    const providedSecret = req.headers.get('x-internal-secret') ?? ''

    let expectedSecret: string
    try {
      expectedSecret = getInternalSecret()
    } catch {
      // Fail-closed: production without INTERNAL_API_SECRET configured.
      return NextResponse.json(
        { error: 'server_misconfigured' },
        { status: 500 }
      )
    }

    if (!providedSecret || !safeEqualStrings(providedSecret, expectedSecret)) {
      return NextResponse.json(
        { error: 'unauthorized' },
        { status: 401 }
      )
    }

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
    }
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'invalid_input' },
        { status: 400 }
      )
    }

    const { orderId } = parsed.data

    // Fix #2: race-condition hardening. Previously the flow was
    //   findUnique → status check → update → triggerOrderConfirmedWebhook
    // with each step on a separate connection. Two concurrent
    // payment-success webhooks for the same orderId could both observe
    // PENDING, both pass the guard, and both update + fire n8n.
    //
    // Now the findUnique → status guard → update → idempotency-log run
    // inside a single Serializable transaction (mirroring the pattern in
    // /api/webhooks/payment-callback/route.ts). The n8n webhook trigger
    // is moved OUTSIDE the transaction so a slow n8n doesn't hold locks.
    const txResult = await db.$transaction(
      async (tx) => {
        // 1. Idempotency: have we already processed this orderId via
        //    payment-success? Look for the SecurityLog entry we write
        //    below on every successful transition.
        const alreadyProcessed = await tx.securityLog.findFirst({
          where: {
            event: 'payment_success_processed',
            details: { contains: orderId },
          },
        })

        if (alreadyProcessed) {
          return { type: 'already_confirmed' as const }
        }

        // 2. Find the booking inside the transaction.
        const booking = await tx.booking.findUnique({
          where: { id: orderId },
          include: { product: true },
        })

        if (!booking) {
          return { type: 'not_found' as const }
        }

        // Idempotency: already confirmed — no-op.
        if (booking.status === 'CONFIRMED') {
          return { type: 'already_confirmed' as const }
        }

        if (booking.status !== 'PENDING') {
          return { type: 'invalid_status' as const, current: booking.status }
        }

        // 3. Update booking to CONFIRMED inside the same tx.
        await tx.booking.update({
          where: { id: orderId },
          data: { status: 'CONFIRMED' },
        })

        // 4. Write the idempotency log INSIDE the tx so a concurrent
        //    duplicate payment-success webhook (or a retry) sees it on
        //    the next transaction's findFirst.
        await tx.securityLog.create({
          data: {
            event: 'payment_success_processed',
            details: JSON.stringify({
              orderId,
              fromStatus: booking.status,
              toStatus: 'CONFIRMED',
            }),
          },
        })

        return { type: 'updated' as const, orderId }
      },
      { isolationLevel: 'Serializable' }
    )

    if (txResult.type === 'already_confirmed') {
      return NextResponse.json({
        success: true,
        alreadyConfirmed: true,
        orderId,
      })
    }
    if (txResult.type === 'not_found') {
      return NextResponse.json(
        { error: 'order_not_found' },
        { status: 404 }
      )
    }
    if (txResult.type === 'invalid_status') {
      return NextResponse.json(
        { error: 'invalid_status', current: txResult.current },
        { status: 400 }
      )
    }

    // txResult.type === 'updated' — fire n8n webhook OUTSIDE the
    // transaction so a slow n8n doesn't hold the Serializable lock.
    try {
      await triggerOrderConfirmedWebhook(txResult.orderId)
    } catch (webhookError) {
      // Log failure but don't fail the request — the booking is already
      // confirmed; n8n failure is a separate concern.
      console.error('n8n webhook failed:', webhookError)
      await db.securityLog.create({
        data: {
          event: 'n8n_webhook_failed',
          details: JSON.stringify({
            orderId: txResult.orderId,
            error: webhookError instanceof Error ? webhookError.message : 'unknown',
          }),
        },
      })
    }

    return NextResponse.json({
      success: true,
      orderId,
      status: 'CONFIRMED',
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error'
    console.error('Payment success error:', message, error)
    return NextResponse.json(
      { error: 'internal_error' },
      { status: 500 }
    )
  }
}
