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

  // Fetch all active products for dynamic product URLs.
  // If the DB is unavailable, fall back to static-only entries so sitemap
  // generation doesn't fail (and tank the build / ISR).
  let products: Array<{ slug: string; updatedAt: Date }> = []
  try {
    products = await db.product.findMany({
      where: { isActive: true },
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
