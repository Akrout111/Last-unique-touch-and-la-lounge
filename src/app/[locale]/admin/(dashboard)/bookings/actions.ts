'use server'

import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { getAdminBrand } from '@/lib/admin-brand'
import { revalidatePath } from 'next/cache'
import { triggerOrderConfirmedWebhook } from '@/lib/n8n'

// V9 Fix #6: state machine now includes PAYMENT_FAILED transitions.
//   - PENDING → CONFIRMED | PAYMENT_FAILED | CANCELLED
//   - PAYMENT_FAILED → PENDING (retry) | CANCELLED
//   - CONFIRMED → COMPLETED | CANCELLED
//   - CANCELLED / COMPLETED → (terminal, no transitions)
// A CONFIRMED booking CANNOT be downgraded to PAYMENT_FAILED by admin
// (the payment already succeeded) — only the payment webhook can set
// PAYMENT_FAILED, and only from PENDING.
const validTransitions: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'PAYMENT_FAILED', 'CANCELLED'],
  PAYMENT_FAILED: ['PENDING', 'CANCELLED'],
  CONFIRMED: ['COMPLETED', 'CANCELLED'],
  CANCELLED: [],
  COMPLETED: [],
}

export async function updateBookingStatusAction(
  bookingId: string,
  newStatus: 'PENDING' | 'CONFIRMED' | 'PAYMENT_FAILED' | 'CANCELLED' | 'COMPLETED'
): Promise<{ success: boolean; error?: string }> {
  await requireAuth()
  const brand = await getAdminBrand()

  try {
    // Scope by brand to prevent cross-tenant mutation
    const booking = await db.booking.findFirst({ where: { id: bookingId, brand } })
    if (!booking) return { success: false, error: 'not_found' }

    if (!validTransitions[booking.status]?.includes(newStatus)) {
      return { success: false, error: 'invalid_transition' }
    }

    await db.booking.update({
      where: { id: bookingId },
      data: { status: newStatus },
    })

    await db.securityLog.create({
      data: {
        event: 'booking_status_changed',
        details: JSON.stringify({
          bookingId,
          from: booking.status,
          to: newStatus,
        }),
      },
    })

    // Trigger n8n webhook when booking is confirmed (Telegram + Google Calendar + invoice email).
    // Wrapped in try/catch so a webhook failure never breaks the booking flow.
    // V9 Fix #6: also fire when an admin manually confirms a booking that was
    // previously PAYMENT_FAILED → PENDING → CONFIRMED (the retry path).
    if (newStatus === 'CONFIRMED') {
      try {
        await triggerOrderConfirmedWebhook(bookingId)
      } catch (error) {
        console.error('[n8n] Failed to trigger order-confirmed webhook:', error)
      }
    }

    revalidatePath('/admin/bookings')
    revalidatePath(`/admin/bookings/${bookingId}`)
    return { success: true }
  } catch (error: unknown) {
    console.error('Update booking status error:', error)
    return { success: false, error: 'internal_error' }
  }
}
