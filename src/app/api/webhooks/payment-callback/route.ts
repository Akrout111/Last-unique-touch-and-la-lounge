import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { triggerOrderConfirmedWebhook } from '@/lib/n8n'

/**
 * POST /api/webhooks/payment-callback
 *
 * This endpoint is a STUB for receiving payment confirmations from the
 * external payment gateway company. They will call this endpoint when
 * a payment is processed (success or failure).
 *
 * TODO (external company): Implement signature verification when they
 * provide their signing secret and payload format.
 *
 * Expected payload from external gateway (will be defined by them):
 * {
 *   "orderId": "string",
 *   "transactionId": "string",
 *   "status": "success" | "failed",
 *   "amount": number,
 *   "currency": "KWD"
 * }
 */
export async function POST(req: NextRequest) {
  try {
    // TODO: Verify signature from external payment gateway
    // const signature = req.headers.get('x-payment-signature')
    // if (!signature || !verifySignature(await req.text(), signature)) {
    //   return NextResponse.json({ error: 'invalid_signature' }, { status: 401 })
    // }

    const body = await req.json()
    const { orderId, status } = body as { orderId?: string; status?: string }

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'invalid_payload' },
        { status: 400 }
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
      // Payment failed — mark as CANCELLED
      await db.booking.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
      })
      return NextResponse.json({ success: true, status: 'cancelled' })
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
