import type { MetadataRoute } from 'next'
import { db } from '@/lib/db'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const now = new Date()

  const staticPages = [
    { path: '', priority: 1, changeFrequency: 'weekly' as const },
    { path: '/products', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/terms', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/refund', priority: 0.5, changeFrequency: 'monthly' as const },
  ]

  const locales = ['ar', 'en']

  // Fetch all active LUT products for dynamic product URLs.
  // V9 Fix #2: scope by brand='LUT' so the sitemap only advertises LUT
  // product pages. La Lounge / Your Birthday products are not reachable
  // from the LUT storefront (getProductBySlug now 404s cross-tenant
  // slugs), so listing them here would create broken / leaking URLs.
  let products: Array<{ slug: string; updatedAt: Date }> = []
  try {
    products = await db.product.findMany({
      where: { brand: 'LUT', isActive: true },
      select: { slug: true, updatedAt: true },
    })
  } catch (error) {
    console.error('[sitemap] DB query failed, serving static-only sitemap:', error)
  }

  const staticEntries = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${baseUrl}/${locale}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }))
  )

  const productEntries = locales.flatMap((locale) =>
    products.map((product) => ({
      url: `${baseUrl}/${locale}/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  )

  return [...staticEntries, ...productEntries]
}
