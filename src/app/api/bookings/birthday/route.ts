import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limiter'

/**
 * Birthday booking request schema.
 *
 * `eventDate` is the date the customer wants the party; we store it as
 * both `startDate` and `endDate` (single-day event) since the Booking
 * model requires a range. `notes` lets the customer add free-text context
 * (location, package, head count, etc.).
 */
const birthdaySchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^\+?[0-9\s-]{8,20}$/),
  email: z.string().email().optional().or(z.literal('')),
  eventDate: z.string().min(1),
  notes: z.string().max(2000).optional().or(z.literal('')),
})

/**
 * Resolve the caller's IP for rate-limit keying. Falls back to a
 * sentinel so all unidentified callers share a single bucket (rather
 * than each being unlimited).
 */
function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]
    return first ? first.trim() : 'unknown'
  }
  return req.headers.get('x-real-ip') ?? 'unknown'
}

/**
 * POST /api/bookings/birthday
 *
 * Creates a Booking row with `brand: 'YOUR_BIRTHDAY'` and no productId
 * (birthday packages are not catalogue Products). Rate limited to 5
 * requests per minute per IP.
 */
export async function POST(req: NextRequest) {
  // --- Rate limit (5/min/IP) ---
  const ip = getClientIp(req)
  const rl = rateLimit(`birthday:${ip}`, 5, 60_000)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'rate_limited', retryAfter: 60 },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  // --- Parse body defensively (D2) ---
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: 'invalid_json' },
      { status: 400 }
    )
  }

  const parsed = birthdaySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid_input', details: parsed.error.issues },
      { status: 400 }
    )
  }

  const { name, phone, email, eventDate, notes } = parsed.data

  // Normalise the event date: the user supplies a calendar date (e.g.
  // "2026-08-14"); we store it as a Date, using the start of that day
  // for both startDate and endDate (single-day booking).
  const start = new Date(`${eventDate}T00:00:00.000Z`)
  if (Number.isNaN(start.getTime())) {
    return NextResponse.json(
      { error: 'invalid_event_date' },
      { status: 400 }
    )
  }
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1)

  try {
    const booking = await db.booking.create({
      data: {
        brand: 'YOUR_BIRTHDAY',
        productId: null,
        startDate: start,
        endDate: end,
        status: 'PENDING',
        customerName: name,
        customerPhone: phone,
        customerEmail: email || '',
        totalAmount: 0,
        currency: 'KWD',
        notes: notes ? `Date: ${eventDate}${notes ? ` | Notes: ${notes}` : ''}` : `Date: ${eventDate}`,
      },
    })

    return NextResponse.json(
      { success: true, bookingId: booking.id },
      { status: 201 }
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error'
    console.error('Birthday booking creation error:', message, error)
    return NextResponse.json(
      { error: 'internal_error' },
      { status: 500 }
    )
  }
}
