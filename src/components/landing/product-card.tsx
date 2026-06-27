import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Badge } from '@/components/ui/badge'
import { localizedName } from '@/lib/products'
import type { ProductWithImages } from '@/lib/products'

export function ProductCard({ product }: { product: ProductWithImages }) {
  const t = useTranslations()
  const locale = useLocale()

  const firstImage = product.images[0]
  const productName = localizedName(product.nameAr, product.nameEn, locale)
  const categoryName = localizedName(
    product.category.nameAr,
    product.category.nameEn,
    locale
  )
  const isOutOfStock = product.stock === 0

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block"
    >
      <div className="rounded-xl overflow-hidden bg-card border border-border transition-shadow hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          {firstImage ? (
            <Image
              src={firstImage}
              alt={productName}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
              {t('common.noImage')}
            </div>
          )}

          {/* Category badge (top-start) */}
          <Badge
            variant="outline"
            className="absolute top-2 start-2 bg-white/80 backdrop-blur-sm text-foreground border-white/60 text-xs"
          >
            {categoryName}
          </Badge>

          {/* 3D badge (top-end) */}
          {product.model3dUrl && (
            <Badge className="absolute top-2 end-2 bg-lut text-white text-xs border-0">
              3D
            </Badge>
          )}

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="px-3 py-1.5 rounded-full bg-white/95 text-foreground text-xs font-semibold">
                {t('products.outOfStock')}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground mb-1">
            {categoryName}
          </p>
          <h3 className="font-semibold text-foreground mb-2 line-clamp-1">
            {productName}
          </h3>
          <p className={`font-bold text-sm ${isOutOfStock ? 'text-muted-foreground' : 'text-lut'}`}>
            {product.rentalPricePerDay} {t('featured.perDay')}
          </p>
        </div>
      </div>
    </Link>
  )
}
