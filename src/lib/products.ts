import { db } from './db'

/**
 * Parse images JSON string to array of URLs.
 * SQLite stores String[] as JSON string, so we need this helper.
 */
export function parseImages(imagesField: string | null | undefined): string[] {
  if (!imagesField) return []
  try {
    const parsed = JSON.parse(imagesField)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Convert array of image URLs to JSON string for SQLite storage.
 */
export function stringifyImages(images: string[]): string {
  return JSON.stringify(images)
}

/**
 * Get localized product name based on locale.
 */
export function localizedName(
  nameAr: string,
  nameEn: string,
  locale: string
): string {
  return locale === 'ar' ? nameAr : nameEn
}

/**
 * Product type with parsed images array.
 */
export interface ProductWithImages {
  id: string
  brand: string
  slug: string
  nameAr: string
  nameEn: string
  descriptionAr: string
  descriptionEn: string
  rentalPricePerDay: number
  securityDeposit: number
  images: string[]
  model3dUrl: string | null
  stock: number
  isActive: boolean
  categoryId: string
  category: {
    id: string
    nameAr: string
    nameEn: string
    slug: string
  }
  createdAt: Date
  updatedAt: Date
}

/**
 * Get featured products for landing page.
 */
export async function getFeaturedProducts(limit = 4): Promise<ProductWithImages[]> {
  const products = await db.product.findMany({
    where: {
      brand: 'LUT',
      isActive: true,
    },
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      category: {
        select: { id: true, nameAr: true, nameEn: true, slug: true },
      },
    },
  })

  return products.map((p) => ({
    ...p,
    images: parseImages(p.images),
  }))
}
