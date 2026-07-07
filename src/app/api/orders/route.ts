import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limiter'

const itemSchema = z.object({
  productId: z.string().min(1),
  slug: z.string().min(1),
  nameAr: z.string(),
  nameEn: z.string(),
  image: z.string(),
  rentalPricePerDay: z.number().positive(),
  securityDeposit: z.number().nonnegative(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  quantity: z.number().int().positive(),
  days: z.number().int().positive(),
  total: z.number().positive(),
})

const customerSchema = z.object({
  customerName: z.string().min(3).max(100),
  customerPhone: z.string().regex(/^\+?[0-9\s-]{8,20}$/),
  customerEmail: z.string().email(),
  address: z.string().min(10).max(500),
  city: z.string().min(2).max(50),
  notes: z.string().max(1000).optional(),
})

const orderSchema = z.object({
  items: z.array(itemSchema).min(1),
  customer: customerSchema,
  idempotencyKey: z.string().min(10),
})

/**
 * Check product availability inside a transaction using the transaction client.
 * Returns true if no overlapping CONFIRMED or PENDING booking exists.
 *
 * Inlined here (instead of reusing checkProductAvailability from @/lib/products)
 * so it runs against the transaction's view of the data with the requested
 * isolation level (Serializable) — see C5.
 */
async function checkProductAvailabilityInTx(
  tx: Parameters<Parameters<typeof db.$transaction>[0]>[0],
  productId: string,
  startDate: Date,
  endDate: Date
): Promise<boolean> {
  const conflictingBookings = await tx.booking.count({
    where: {
      productId,
      status: { in: ['CONFIRMED', 'PENDING'] },
      // Overlap condition: existing booking (s, e) overlaps with (startDate, endDate)
      // if startDate < e AND endDate > s
      AND: [
        { startDate: { lt: endDate } },
        { endDate: { gt: startDate } },
      ],
    },
  })

  return conflictingBookings === 0
}

export async function POST(req: NextRequest) {
  // --- Rate limit (10/min/IP) — D5 ---
  const forwarded = req.headers.get('x-forwarded-for')
  const firstFwd = forwarded ? forwarded.split(',')[0] : null
  const ip = firstFwd ? firstFwd.trim() : (req.headers.get('x-real-ip') ?? 'unknown')
  const rl = rateLimit(`orders:${ip}`, 10, 60_000)
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'rate_limited', retryAfter: 60 },
      { status: 429, headers: { 'Retry-After': '60' } }
    )
  }

  try {
    // --- Parse body defensively (D2): invalid JSON -> 400, not 500 ---
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { error: 'invalid_json' },
        { status: 400 }
      )
    }

    const parsed = orderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'invalid_input', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const { items, customer, idempotencyKey } = parsed.data

    // 1. Idempotency check — prevent duplicate orders (cheap pre-check; the
    //    authoritative log is created inside the transaction below).
    const existing = await db.securityLog.findFirst({
      where: {
        event: 'order_idempotency',
        details: { contains: idempotencyKey },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'duplicate_request' },
        { status: 409 }
      )
    }

    // 2. Re-verify products and prices on server (cheap pre-check; the
    //    authoritative stock/availability checks happen inside the tx).
    const productIds = items.map((i) => i.productId)
    const dbProducts = await db.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    })

    if (dbProducts.length !== items.length) {
      return NextResponse.json(
        { error: 'invalid_products' },
        { status: 400 }
      )
    }

    // 3. Re-check availability + stock INSIDE a Serializable transaction (C5).
    //    This closes the TOCTOU race between the availability check and the
    //    booking.create: with Serializable isolation (and the
    //    `@@unique([productId, startDate, endDate])` constraint on Booking),
    //    two concurrent orders for the same product/date range cannot both
    //    succeed — the second will fail with a unique-constraint violation.
    const result = await db.$transaction(
      async (tx) => {
        // Re-fetch products inside the tx for an authoritative stock check.
        const txProducts = await tx.product.findMany({
          where: { id: { in: productIds }, isActive: true },
        })

        if (txProducts.length !== items.length) {
          throw new OrderError('invalid_products', 400)
        }

        // Verify price, stock, and availability for each item inside the tx.
        for (const item of items) {
          const product = txProducts.find((p) => p.id === item.productId)
          if (!product) {
            throw new OrderError('invalid_products', 400)
          }

          // Verify price matches DB
          if (Math.abs(product.rentalPricePerDay - item.rentalPricePerDay) > 0.01) {
            throw new OrderError('price_mismatch', 400)
          }

          // Verify securityDeposit matches DB (P0.2 — pricing integrity)
          if (Math.abs(product.securityDeposit - item.securityDeposit) > 0.01) {
            throw new OrderError('price_mismatch', 400)
          }

          // Verify stock
          if (product.stock < item.quantity) {
            throw new OrderError('insufficient_stock', 400)
          }

          // Compute days server-side from startDate + endDate (P0.2).
          // We use UTC midnight difference to avoid DST/timezone off-by-ones.
          const startDate = new Date(item.startDate)
          const endDate = new Date(item.endDate)
          if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
            throw new OrderError('invalid_dates', 400)
          }
          const msPerDay = 1000 * 60 * 60 * 24
          const calculatedDays = Math.ceil((endDate.getTime() - startDate.getTime()) / msPerDay)
          if (calculatedDays <= 0) {
            throw new OrderError('invalid_dates', 400)
          }
          if (item.days !== calculatedDays) {
            throw new OrderError('days_mismatch', 400)
          }

          // Recompute total server-side (P0.2): rental × days + security deposit.
          // For multi-quantity items the deposit is charged once per item
          // (matching the cart summary shown to the customer).
          const expectedTotal =
            product.rentalPricePerDay * calculatedDays * item.quantity +
            product.securityDeposit * item.quantity
          if (Math.abs(expectedTotal - item.total) > 0.01) {
            throw new OrderError('total_mismatch', 400)
          }

          // Verify availability inside the tx (authoritative given isolation level)
          const available = await checkProductAvailabilityInTx(
            tx,
            item.productId,
            startDate,
            endDate
          )

          if (!available) {
            throw new OrderError('not_available', 409)
          }
        }

        // Create bookings inside the same tx (C5).
        const bookings = []
        for (const item of items) {
          const product = txProducts.find((p) => p.id === item.productId)
          const startDate = new Date(item.startDate)
          const endDate = new Date(item.endDate)
          const msPerDay = 1000 * 60 * 60 * 24
          const calculatedDays = Math.ceil((endDate.getTime() - startDate.getTime()) / msPerDay)
          // Use the server-recomputed total (P0.2) — never trust client-supplied item.total.
          const expectedTotal =
            product!.rentalPricePerDay * calculatedDays * item.quantity +
            product!.securityDeposit * item.quantity

          const booking = await tx.booking.create({
            data: {
              productId: item.productId,
              brand: product!.brand,
              startDate,
              endDate,
              status: 'PENDING',
              customerName: customer.customerName,
              customerPhone: customer.customerPhone,
              customerEmail: customer.customerEmail,
              totalAmount: expectedTotal,
              currency: 'KWD',
              address: customer.address,
              city: customer.city,
              notes: customer.notes ?? null,
            },
          })

          bookings.push(booking)
        }

        // Log idempotency key inside the tx so it commits atomically.
        await tx.securityLog.create({
          data: {
            event: 'order_idempotency',
            details: JSON.stringify({
              idempotencyKey,
              bookingIds: bookings.map((b) => b.id),
            }),
          },
        })

        return bookings
      },
      { isolationLevel: 'Serializable' }
    )

    // 4. Return success with first booking ID as order reference
    const orderId = result[0]?.id

    return NextResponse.json(
      {
        success: true,
        orderId,
        bookingIds: result.map((b) => b.id),
        totalBookings: result.length,
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    // Surface our typed OrderErrors with the appropriate HTTP status.
    if (error instanceof OrderError) {
      return NextResponse.json(
        { error: error.code },
        { status: error.status }
      )
    }

    // Handle Prisma unique-constraint violations (e.g. concurrent double-booking).
    // P2002 = Unique constraint failed on the {fields}.
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: string }).code === 'P2002'
    ) {
      return NextResponse.json(
        { error: 'not_available' },
        { status: 409 }
      )
    }

    const message = error instanceof Error ? error.message : 'Internal error'
    console.error('Order creation error:', message, error)
    return NextResponse.json(
      { error: 'internal_error' },
      { status: 500 }
    )
  }
}

/**
 * Internal error type used to bail out of the transaction with a
 * specific HTTP status code and error code.
 */
class OrderError extends Error {
  code: string
  status: number
  constructor(code: string, status: number) {
    super(code)
    this.name = 'OrderError'
    this.code = code
    this.status = status
  }
}
