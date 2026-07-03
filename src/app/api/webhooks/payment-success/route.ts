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

    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'invalid_input' },
        { status: 400 }
      )
    }

    const { orderId } = parsed.data

    // 1. Find the booking by orderId
    const booking = await db.booking.findUnique({
      where: { id: orderId },
      include: { product: true },
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'order_not_found' },
        { status: 404 }
      )
    }

    // Idempotency: already confirmed
    if (booking.status === 'CONFIRMED') {
      return NextResponse.json({
        success: true,
        alreadyConfirmed: true,
        orderId,
      })
    }

    if (booking.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'invalid_status' },
        { status: 400 }
      )
    }

    // 2. Update booking to CONFIRMED
    await db.booking.update({
      where: { id: orderId },
      data: { status: 'CONFIRMED' },
    })

    // 3. Trigger n8n webhook (fire-and-forget, but log failures)
    try {
      await triggerOrderConfirmedWebhook(booking.id)
    } catch (webhookError) {
      // Log failure but don't fail the request
      console.error('n8n webhook failed:', webhookError)
      await db.securityLog.create({
        data: {
          event: 'n8n_webhook_failed',
          details: JSON.stringify({
            orderId,
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
