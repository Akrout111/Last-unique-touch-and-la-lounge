import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { checkProductAvailability } from '@/lib/products'

const schema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const url = new URL(req.url)
    const startDateStr = url.searchParams.get('startDate')
    const endDateStr = url.searchParams.get('endDate')

    const parsed = schema.safeParse({
      startDate: startDateStr,
      endDate: endDateStr,
    })

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'invalid_dates', details: parsed.error.issues },
        { status: 400 }
      )
    }

    // V9 Fix #2: scope by brand='LUT' so a client cannot probe availability
    // for a La Lounge / Your Birthday product through the LUT storefront API.
    const product = await db.product.findFirst({
      where: { id, brand: 'LUT', isActive: true },
    })
    if (!product) {
      return NextResponse.json({ error: 'product_not_found' }, { status: 404 })
    }

    const startDate = new Date(parsed.data.startDate)
    const endDate = new Date(parsed.data.endDate)

    if (endDate <= startDate) {
      return NextResponse.json(
        { error: 'invalid_range', message: 'End date must be after start date' },
        { status: 400 }
      )
    }

    // V9 Fix #4: stock-aware availability. The result now includes
    // `availableStock` so the PDP can show "5 of 10 available" instead
    // of a binary available/unavailable.
    const result = await checkProductAvailability(id, startDate, endDate)

    return NextResponse.json({
      available: result.available,
      conflictingBookings: result.conflictingBookings,
      availableStock: result.availableStock,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error'
    console.error('Availability check error:', message, error)
    return NextResponse.json(
      { error: 'internal_error' },
      { status: 500 }
    )
  }
}
