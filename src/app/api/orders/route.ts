import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { checkProductAvailability } from '@/lib/products'

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = orderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'invalid_input', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const { items, customer, idempotencyKey } = parsed.data

    // 1. Idempotency check — prevent duplicate orders
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

    // 2. Re-verify products and prices on server (security rule #2)
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

    // 3. Re-check availability for each item (security critical)
    for (const item of items) {
      const product = dbProducts.find((p) => p.id === item.productId)
      if (!product) continue

      // Verify price matches DB
      if (Math.abs(product.rentalPricePerDay - item.rentalPricePerDay) > 0.01) {
        return NextResponse.json(
          { error: 'price_mismatch' },
          { status: 400 }
        )
      }

      // Verify stock
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: 'insufficient_stock' },
          { status: 400 }
        )
      }

      // Verify availability
      const startDate = new Date(item.startDate)
      const endDate = new Date(item.endDate)
      const availability = await checkProductAvailability(item.productId, startDate, endDate)

      if (!availability.available) {
        return NextResponse.json(
          { error: 'not_available' },
          { status: 409 }
        )
      }
    }

    // 4. Create bookings in a transaction (security rule #12)
    const result = await db.$transaction(async (tx) => {
      const bookings = []

      for (const item of items) {
        const startDate = new Date(item.startDate)
        const endDate = new Date(item.endDate)

        const booking = await tx.booking.create({
          data: {
            productId: item.productId,
            startDate,
            endDate,
            status: 'PENDING',
            customerName: customer.customerName,
            customerPhone: customer.customerPhone,
            customerEmail: customer.customerEmail,
            totalAmount: item.total,
            currency: 'KWD',
          },
        })

        bookings.push(booking)
      }

      // Log idempotency key
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
    })

    // 5. Return success with first booking ID as order reference
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
    const message = error instanceof Error ? error.message : 'Internal error'
    console.error('Order creation error:', message, error)
    return NextResponse.json(
      { error: 'internal_error' },
      { status: 500 }
    )
  }
}
