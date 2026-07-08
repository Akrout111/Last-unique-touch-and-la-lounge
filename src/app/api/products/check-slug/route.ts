import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const schema = z.object({
  slug: z.string().min(1).max(200),
  brand: z.enum(['LUT', 'LA_LOUNGE', 'YOUR_BIRTHDAY']).default('LUT'),
})

/**
 * GET /api/products/check-slug?slug=xxx&brand=LUT
 *
 * Lightweight existence check used by the middleware (V10 Fix #1) to
 * determine whether a product slug exists before the request reaches the
 * page component. The middleware calls this endpoint via `fetch` and
 * returns a 404 response directly if the product doesn't exist — this
 * closes the soft-404 gap where `notFound()` inside the page rendered
 * the 404 body but the standalone server sent a 200 status.
 *
 * Returns:
 *   200 { exists: true }  — product exists and is active
 *   200 { exists: false } — product does not exist (or is inactive)
 *   400 { error: 'invalid_input' }
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const parsed = schema.safeParse({
    slug: url.searchParams.get('slug'),
    brand: url.searchParams.get('brand') ?? 'LUT',
  })

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid_input', details: parsed.error.issues },
      { status: 400 }
    )
  }

  const { slug, brand } = parsed.data

  try {
    const product = await db.product.findFirst({
      where: { slug, brand, isActive: true },
      select: { id: true },
    })

    return NextResponse.json({ exists: !!product })
  } catch (error: unknown) {
    // If the DB is unavailable, fail open (let the page handle it).
    // Returning `exists: true` means the middleware won't 404 the request,
    // and the page's own `getProductBySlug` + `notFound()` will handle it.
    console.error('[check-slug] DB query failed:', error)
    return NextResponse.json({ exists: true, error: 'db_unavailable' })
  }
}
