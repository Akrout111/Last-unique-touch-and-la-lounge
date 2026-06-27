'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { TiltCard } from '@/components/ui-premium/tilt-card'
import { localizedName } from '@/lib/products'
import type { ProductWithImages } from '@/lib/products'

export function FeaturedProductsClient({ products }: { products: ProductWithImages[] }) {
  const t = useTranslations()
  const locale = useLocale()
  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight

  return (
    <section className="relative py-32 bg-ink overflow-hidden">
      {/* Subtle texture */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #F4EFE6 1px, transparent 1px), linear-gradient(to bottom, #F4EFE6 1px, transparent 1px)',
          backgroundSize: '100px 100px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-end justify-between mb-16"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-gold" />
              <span className="eyebrow text-gold">
                {locale === 'ar' ? 'مختارات' : 'Curated'}
              </span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-paper leading-tight">
              {t('featured.title')}
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-2 text-gold hover:gap-4 transition-all duration-300 group"
          >
            <span className="eyebrow">{t('featured.viewAll')}</span>
            <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, idx) => {
            const firstImage = product.images[0]
            const secondImage = product.images[1] ?? product.images[0]
            const productName = localizedName(product.nameAr, product.nameEn, locale)
            const categoryName = localizedName(
              product.category.nameAr,
              product.category.nameEn,
              locale
            )

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                  delay: idx * 0.1,
                }}
              >
                <Link href={`/products/${product.slug}`} className="group block">
                  <TiltCard maxTilt={5} className="cursor-pointer">
                    <div
                      className="relative overflow-hidden bg-paper-deep"
                      style={{ borderRadius: '2px', transformStyle: 'preserve-3d' }}
                    >
                      {/* Image container */}
                      <div className="relative aspect-[4/5] overflow-hidden">
                        {firstImage ? (
                          <>
                            <Image
                              src={firstImage}
                              alt={productName}
                              fill
                              className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                            {secondImage !== firstImage && (
                              <Image
                                src={secondImage}
                                alt={productName}
                                fill
                                className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 scale-105"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                              />
                            )}
                          </>
                        ) : (
                          <div className="w-full h-full bg-muted" />
                        )}

                        {/* 3D badge */}
                        {product.model3dUrl && (
                          <div
                            className="absolute top-3 end-3 px-2 py-1 bg-gold text-ink eyebrow"
                            style={{ transform: 'translateZ(30px)' }}
                          >
                            3D
                          </div>
                        )}

                        {/* Out of stock */}
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-ink/60 flex items-center justify-center">
                            <span className="eyebrow text-paper border border-paper/30 px-4 py-2">
                              {t('products.outOfStock')}
                            </span>
                          </div>
                        )}

                        {/* Price chip */}
                        <div
                          className="absolute bottom-3 end-3 glass-dark px-3 py-1.5"
                          style={{ transform: 'translateZ(30px)' }}
                        >
                          <span className="font-mono text-xs text-gold tabular-nums">
                            {product.rentalPricePerDay.toFixed(3)}
                          </span>
                          <span className="font-mono text-[10px] text-paper/50 ms-1">KWD/day</span>
                        </div>
                      </div>

                      {/* Info */}
                      <div
                        className="p-5 bg-paper"
                        style={{ transform: 'translateZ(20px)' }}
                      >
                        <p className="eyebrow text-taupe mb-2">{categoryName}</p>
                        <h3 className="font-display text-xl text-ink mb-1 line-clamp-1">
                          {productName}
                        </h3>
                        <div className="w-8 h-px bg-gold mt-3 group-hover:w-16 transition-all duration-500" />
                      </div>
                    </div>
                  </TiltCard>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Mobile view all */}
        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-gold"
          >
            <span className="eyebrow">{t('featured.viewAll')}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
