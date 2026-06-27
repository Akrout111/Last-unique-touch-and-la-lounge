import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { triggerOrderConfirmedWebhook } from '@/lib/n8n'

const schema = z.object({
  orderId: z.string().min(1),
})

/**
 * POST /api/webhooks/payment-success
 *
 * Internal mock endpoint to simulate payment confirmation.
 * In production, this will be replaced by /api/webhooks/payment-callback
 * which receives real confirmations from the external payment gateway company.
 */
export async function POST(req: NextRequest) {
  try {
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
