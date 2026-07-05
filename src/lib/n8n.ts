import { db } from './db'
import { createHmac } from 'crypto'

/**
 * Trigger the n8n webhook for a confirmed order.
 * Sends order details to n8n, which then:
 * 1. Sends Telegram message to business owner
 * 2. Creates Google Calendar event
 * 3. Sends HTML invoice email to customer
 *
 * Uses HMAC signature for security (prevents forged requests).
 * If N8N_WEBHOOK_URL is not set, logs and skips (useful in development).
 */
export async function triggerOrderConfirmedWebhook(bookingId: string): Promise<void> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET

  // If n8n is not configured, log and skip (useful in development)
  if (!webhookUrl) {
    console.warn('[n8n] Webhook URL not configured, skipping for booking:', bookingId)
    return
  }

  // 1. Fetch full booking details
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: {
      product: {
        include: { category: true },
      },
    },
  })

  if (!booking) {
    throw new Error(`Booking not found: ${bookingId}`)
  }

  if (!booking.product) {
    throw new Error(`Booking ${bookingId} has no associated product`)
  }

  // 2. Build payload
  const payload = {
    event: 'order.confirmed',
    timestamp: new Date().toISOString(),
    booking: {
      id: booking.id,
      status: booking.status,
      startDate: booking.startDate.toISOString(),
      endDate: booking.endDate.toISOString(),
      totalAmount: booking.totalAmount,
      currency: booking.currency,
      createdAt: booking.createdAt.toISOString(),
    },
    customer: {
      name: booking.customerName,
      phone: booking.customerPhone,
      email: booking.customerEmail,
    },
    product: {
      id: booking.product.id,
      slug: booking.product.slug,
      nameAr: booking.product.nameAr,
      nameEn: booking.product.nameEn,
      rentalPricePerDay: booking.product.rentalPricePerDay,
      securityDeposit: booking.product.securityDeposit,
      categoryAr: booking.product.category.nameAr,
      categoryEn: booking.product.category.nameEn,
    },
  }

  // 3. Compute HMAC signature (security rule #3 — sign the body before sending)
  // n8n will verify this signature on its end
  const body = JSON.stringify(payload)
  const signature = webhookSecret
    ? createHmac('sha256', webhookSecret).update(body).digest('hex')
    : null

  // 4. Send webhook with timeout (security rule #21 — timeout for external requests)
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000) // 10s timeout

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Order-Id': bookingId,
      'X-Event': 'order.confirmed',
    }

    if (signature) {
      headers['X-Signature-256'] = `sha256=${signature}`
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body,
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`n8n webhook failed: ${response.status} ${response.statusText}`)
    }

    console.warn('[n8n] Webhook sent successfully for booking:', bookingId)

    // Log success (do NOT log the webhook URL — it's a secret)
    await db.securityLog.create({
      data: {
        event: 'n8n_webhook_sent',
        details: JSON.stringify({
          bookingId,
          responseStatus: response.status,
        }),
      },
    })
  } finally {
    clearTimeout(timeout)
  }
}
