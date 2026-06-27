import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const now = new Date()

  const pages = [
    { path: '', priority: 1, changeFrequency: 'weekly' as const },
    { path: '/products', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/terms', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/refund', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/cart', priority: 0.4, changeFrequency: 'weekly' as const },
    { path: '/checkout', priority: 0.4, changeFrequency: 'weekly' as const },
  ]

  const locales = ['ar', 'en']

  return locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${baseUrl}/${locale}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }))
  )
}
