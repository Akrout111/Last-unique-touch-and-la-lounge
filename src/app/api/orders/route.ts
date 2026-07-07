import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
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

type TxClient = Parameters<Parameters<typeof db.$transaction>[0]>[0]

/**
 * Stock-aware availability check (V9 Fix #4).
 *
 * Previously this function returned `true` only when ZERO overlapping
 * CONFIRMED/PENDING bookings existed — which made products with stock>1
 * effectively unusable (the @@unique constraint also blocked this at the
 * DB level, but that constraint has been removed in the V9 migration).
 *
 * Now we sum the `quantity` of all overlapping active bookings and
 * compare against `product.stock`. The check runs inside the Serializable
 * transaction so concurrent orders cannot both pass the check.
 *
 * Returns `{ available, availableStock }` so the caller can include the
 * remaining stock in the error response for better UX.
 */
async function checkStockAvailabilityInTx(
  tx: TxClient,
  productId: string,
  startDate: Date,
  endDate: Date,
  requestedQuantity: number,
  productStock: number
): Promise<{ available: boolean; availableStock: number }> {
  // Fetch all overlapping CONFIRMED/PENDING bookings and sum their quantities.
  // We use findMany (not aggregate) because Prisma's SQLite aggregate sum
  // returns null on an empty set, which is awkward to handle.
  const overlappingBookings = await tx.booking.findMany({
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
    select: { quantity: true },
  })

  const totalBookedQuantity = overlappingBookings.reduce(
    (sum, b) => sum + (b.quantity ?? 1),
    0
  )
  const availableStock = Math.max(0, productStock - totalBookedQuantity)

  return {
    available: availableStock >= requestedQuantity,
    availableStock,
  }
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

    // 1. Cheap pre-check: do all products exist + belong to LUT?
    //    (V9 Fix #2: brand='LUT' filter). The authoritative idempotency +
    //    stock checks happen INSIDE the transaction below (V9 Fix #5).
    const productIds = items.map((i) => i.productId)
    const dbProducts = await db.product.findMany({
      where: { id: { in: productIds }, brand: 'LUT', isActive: true },
    })

    if (dbProducts.length !== items.length) {
      return NextResponse.json(
        { error: 'invalid_products' },
        { status: 400 }
      )
    }

    // 2. Re-check idempotency + stock + price INSIDE a Serializable
    //    transaction (V9 Fix #4 + #5).
    //
    //    V9 Fix #5: the idempotency check is now a `create` on the
    //    IdempotencyKey table with a UNIQUE constraint on `key`. If two
    //    concurrent requests send the same key, the second one's create
    //    throws P2002 — which we catch and return 409 duplicate_request.
    //    This closes the TOCTOU race that existed when the check was a
    //    `findFirst` outside the transaction.
    //
    //    V9 Fix #4: the availability check is now stock-aware — it sums
    //    the `quantity` of overlapping bookings and compares against
    //    `product.stock`, so products with stock>1 can be booked multiple
    //    times for overlapping dates.
    let result: Array<{ id: string }>
    try {
      result = await db.$transaction(
        async (tx) => {
          // --- Idempotency: create the key FIRST (V9 Fix #5) ---
          // If this throws P2002, the key already exists — a concurrent
          // duplicate request won the race. We catch that outside the tx.
          const idempotencyRecord = await tx.idempotencyKey.create({
            data: {
              key: idempotencyKey,
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
            },
          })

          // Re-fetch products inside the tx for an authoritative stock check.
          // V9 Fix #2: brand='LUT' filter prevents cross-tenant booking.
          const txProducts = await tx.product.findMany({
            where: { id: { in: productIds }, brand: 'LUT', isActive: true },
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

            // Compute days server-side from startDate + endDate (P0.2).
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

            // Recompute total server-side (P0.2): rental × days × qty + deposit × qty.
            const expectedTotal =
              product.rentalPricePerDay * calculatedDays * item.quantity +
              product.securityDeposit * item.quantity
            if (Math.abs(expectedTotal - item.total) > 0.01) {
              throw new OrderError('total_mismatch', 400)
            }

            // --- Stock-aware availability check (V9 Fix #4) ---
            // Sum the quantity of all overlapping CONFIRMED/PENDING bookings
            // and compare against product.stock. This replaces the old
            // "any overlap = unavailable" check that blocked stock>1 rentals.
            const { available, availableStock } = await checkStockAvailabilityInTx(
              tx,
              item.productId,
              startDate,
              endDate,
              item.quantity,
              product.stock
            )

            if (!available) {
              throw new OrderError(
                'out_of_stock',
                409,
                `Requested ${item.quantity} but only ${availableStock} available`
              )
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
                // V9 Fix #4: store the requested quantity on the booking so
                // the stock-aware availability check above can sum it for
                // future overlapping bookings.
                quantity: item.quantity,
                totalAmount: expectedTotal,
                currency: 'KWD',
                address: customer.address,
                city: customer.city,
                notes: customer.notes ?? null,
              },
            })

            bookings.push(booking)
          }

          // --- Link the idempotency key to the resulting bookings (V9 Fix #5) ---
          // So a replay of the same key can return the original booking IDs
          // instead of a bare 409 (better UX for the client).
          await tx.idempotencyKey.update({
            where: { id: idempotencyRecord.id },
            data: { orderId: bookings[0]?.id ?? null },
          })

          // Also log to SecurityLog for audit (kept for backwards compat
          // with any tooling that reads the old log format).
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
    } catch (error: unknown) {
      // V9 Fix #5: P2002 on IdempotencyKey.key = concurrent duplicate.
      // Return 409 with the original booking IDs if we can recover them.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        // The target of the unique violation. Prisma includes it in
        // `meta.target` for known errors.
        const target = (error.meta?.target as string[] | undefined)?.join(',') ?? ''
        if (target.includes('key')) {
          // IdempotencyKey.key collision — this is a duplicate request.
          const existing = await db.idempotencyKey.findUnique({
            where: { key: idempotencyKey },
            select: { orderId: true },
          })
          if (existing?.orderId) {
            return NextResponse.json(
              {
                success: true,
                orderId: existing.orderId,
                bookingIds: [existing.orderId],
                totalBookings: 1,
                message: 'duplicate_request',
              },
              { status: 200 }
            )
          }
          return NextResponse.json(
            { error: 'duplicate_request' },
            { status: 409 }
          )
        }
        // Any other P2002 (e.g. on Booking) — surface as a generic conflict.
        return NextResponse.json(
          { error: 'not_available' },
          { status: 409 }
        )
      }
      throw error
    }

    // 3. Return success with first booking ID as order reference
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
        { error: error.code, message: error.detail },
        { status: error.status }
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
  detail?: string
  constructor(code: string, status: number, detail?: string) {
    super(code)
    this.name = 'OrderError'
    this.code = code
    this.status = status
    this.detail = detail
  }
}
