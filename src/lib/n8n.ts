import { db } from './db'
import { createHmac } from 'crypto'

/**
 * Resolve the n8n webhook signing secret.
 *
 * Fix #4: fail-closed in production — if N8N_WEBHOOK_SECRET is unset or
 * shorter than 16 chars in production, throw so the caller (which already
 * wraps the call in try/catch) refuses to send the webhook. In dev we
 * keep the original fallback: use whatever secret is provided (any length),
 * or return null if unset (in which case the X-Signature-256 header is
 * skipped).
 */
function getWebhookSecret(): string | null {
  const isProduction = process.env.NODE_ENV === 'production'
  const secret = process.env.N8N_WEBHOOK_SECRET

  if (isProduction) {
    if (!secret || secret.length < 16) {
      throw new Error(
        'N8N_WEBHOOK_SECRET must be set and at least 16 chars in production.'
      )
    }
    return secret
  }

  // Dev fallback — caller skips the X-Signature-256 header if null.
  return secret ?? null
}

/**
 * Trigger the n8n webhook for a confirmed order.
 * Sends order details to n8n, which then:
 * 1. Sends Telegram message to business owner
 * 2. Creates Google Calendar event
 * 3. Sends HTML invoice email to customer
 *
 * Uses HMAC signature for security (prevents forged requests).
 * If N8N_WEBHOOK_URL is not set, logs and skips (useful in development).
 *
 * Fix #4: throws in production when N8N_WEBHOOK_SECRET is unset/short
 * (fail-closed). Fix #6: throws when the webhook URL is not https in
 * production.
 */
export async function triggerOrderConfirmedWebhook(bookingId: string): Promise<void> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL
  const isProduction = process.env.NODE_ENV === 'production'

  // If n8n is not configured, log and skip (useful in development)
  if (!webhookUrl) {
    console.warn('[n8n] Webhook URL not configured, skipping for booking:', bookingId)
    return
  }

  // Fix #6: in production the webhook URL MUST be https — otherwise the
  // signed payload (and effectively the secret-derived signature) would
  // travel over plaintext. Fail-closed rather than silently leaking.
  if (isProduction && !webhookUrl.startsWith('https://')) {
    throw new Error(
      '[n8n] refusing to send webhook over non-https URL in production: ' +
        webhookUrl.replace(/\/\/[^@]+@/, '//***@')
    )
  }

  // Fix #4: resolve the signing secret. In production getWebhookSecret
  // throws if the secret is unset/short (fail-closed) — we let the error
  // propagate so the caller refuses to send the webhook. In dev it returns
  // null when unset, in which case we skip the X-Signature-256 header.
  const webhookSecret = getWebhookSecret()

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

  // Birthday / non-product bookings legitimately have `product: null`.
  // Do NOT throw — build a payload with fallback values so n8n can route
  // the event based on `bookingType` (#4).

  // 2. Build payload
  const payload = {
    event: 'order.confirmed',
    timestamp: new Date().toISOString(),
    bookingType: booking.product ? 'product_rental' : 'birthday_event',
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
      id: booking.product?.id ?? null,
      slug: booking.product?.slug ?? null,
      nameAr: booking.product?.nameAr ?? 'باقة عيد الميلاد',
      nameEn: booking.product?.nameEn ?? 'Birthday Package',
      rentalPricePerDay: booking.product?.rentalPricePerDay ?? null,
      securityDeposit: booking.product?.securityDeposit ?? null,
      categoryAr: booking.product?.category?.nameAr ?? null,
      categoryEn: booking.product?.category?.nameEn ?? null,
    },
  }

  // 3. Compute HMAC signature (security rule #3 — sign the body before sending)
  // n8n will verify this signature on its end.
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
