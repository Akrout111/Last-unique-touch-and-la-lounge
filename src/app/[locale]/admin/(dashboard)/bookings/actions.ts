'use server'

import { db } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { triggerOrderConfirmedWebhook } from '@/lib/n8n'

const validTransitions: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['COMPLETED', 'CANCELLED'],
  CANCELLED: [],
  COMPLETED: [],
}

export async function updateBookingStatusAction(
  bookingId: string,
  newStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
): Promise<{ success: boolean; error?: string }> {
  await requireAuth()

  try {
    const booking = await db.booking.findUnique({ where: { id: bookingId } })
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
