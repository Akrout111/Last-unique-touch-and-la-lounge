'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react'

interface Brand {
  key: 'lut' | 'lalounge' | 'birthday'
  image: string
  accent: string
  active: boolean
  tag: string
}

const brands: Brand[] = [
  {
    key: 'lut',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=85',
    accent: '#C9A227',
    active: true,
    tag: 'HERITAGE',
  },
  {
    key: 'lalounge',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1600&q=85',
    accent: '#9D174D',
    active: false,
    tag: 'MODERN',
  },
  {
    key: 'birthday',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1600&q=85',
    accent: '#D4A574',
    active: false,
    tag: 'ATELIER',
  },
]

export function Hero() {
  const t = useTranslations()
  const locale = useLocale()
  const ref = useRef<HTMLElement>(null)
  const [hoveredBrand, setHoveredBrand] = useState<number | null>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight

  return (
    <section
      ref={ref}
      className="relative h-screen min-h-[700px] w-full overflow-hidden bg-ink"
    >
      {/* === Background: 3 brand images in triptych === */}
      <div className="absolute inset-0 flex">
        {brands.map((brand, idx) => (
          <div
            key={brand.key}
            className="relative flex-1 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              flex: hoveredBrand === idx ? 1.5 : hoveredBrand === null ? 1 : 0.7,
            }}
          >
            {/* Brand background image */}
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: hoveredBrand === idx ? 1.1 : 1,
              }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src={brand.image}
                alt={t(`brandSelector.${brand.key}.name`)}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Gradient overlay */}
            <div
              className="absolute inset-0 transition-opacity duration-500"
              style={{
                background:
                  hoveredBrand === idx
                    ? 'linear-gradient(to top, rgba(14,13,11,0.95) 0%, rgba(14,13,11,0.4) 50%, rgba(14,13,11,0.2) 100%)'
                    : 'linear-gradient(to top, rgba(14,13,11,0.85) 0%, rgba(14,13,11,0.5) 50%, rgba(14,13,11,0.3) 100%)',
              }}
            />

            {/* Inactive dark overlay */}
            {!brand.active && (
              <div className="absolute inset-0 bg-ink/40" />
            )}

            {/* Divider line */}
            {idx < brands.length - 1 && (
              <div className="absolute top-0 end-0 bottom-0 w-px bg-paper/10 z-10" />
            )}

            {/* Accent top line */}
            <div
              className="absolute top-0 inset-x-0 h-1 transition-opacity duration-500"
              style={{
                backgroundColor: brand.accent,
                opacity: hoveredBrand === idx ? 1 : 0.3,
              }}
            />
          </div>
        ))}
      </div>

      {/* === Top: Brand logo + nav spacer === */}
      <motion.div
        style={{ opacity }}
        className="absolute top-0 inset-x-0 z-30 pt-24 pb-8 text-center pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="flex items-center justify-center gap-3 mb-3"
        >
          <span className="w-8 h-px bg-gold/50" />
          <span className="eyebrow text-gold/80">
            {locale === 'ar' ? 'منصة تأجير فاخرة · الكويت' : 'Luxury Rental Platform · Kuwait'}
          </span>
          <span className="w-8 h-px bg-gold/50" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl text-paper"
        >
          {t('brand.lut')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-sm text-paper/40 mt-2"
        >
          {locale === 'ar' ? 'اختر تجربتك' : 'Choose Your Experience'}
        </motion.p>
      </motion.div>

      {/* === Center: Interactive brand cards === */}
      <div className="absolute inset-0 z-20 flex items-end md:items-center">
        <div className="w-full px-4 sm:px-6 lg:px-8 pb-32 md:pb-0">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {brands.map((brand, idx) => {
              const card = (
                <motion.div
                  key={brand.key}
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.9,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.6 + idx * 0.12,
                  }}
                  onMouseEnter={() => setHoveredBrand(idx)}
                  onMouseLeave={() => setHoveredBrand(null)}
                  className="group relative cursor-pointer"
                >
                  {/* Tag */}
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="w-2 h-2 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: brand.accent,
                        scale: hoveredBrand === idx ? 1.5 : 1,
                      }}
                    />
                    <span
                      className="eyebrow transition-colors duration-300"
                      style={{ color: hoveredBrand === idx ? brand.accent : 'rgba(244, 239, 230, 0.4)' }}
                    >
                      {brand.tag}
                    </span>
                  </div>

                  {/* Brand name */}
                  <h2
                    className="font-display text-3xl sm:text-4xl md:text-5xl text-paper leading-tight mb-3 transition-all duration-300"
                    style={{
                      transform: hoveredBrand === idx ? 'translateY(-4px)' : 'translateY(0)',
                    }}
                  >
                    {t(`brandSelector.${brand.key}.name`)}
                  </h2>

                  {/* Description */}
                  <p
                    className="text-sm text-paper/50 leading-relaxed mb-6 max-w-xs transition-all duration-300 overflow-hidden"
                    style={{
                      maxHeight: hoveredBrand === idx ? '60px' : '40px',
                      opacity: hoveredBrand === idx ? 1 : 0.6,
                    }}
                  >
                    {t(`brandSelector.${brand.key}.desc`)}
                  </p>

                  {/* CTA / Badge */}
                  <div className="flex items-center gap-2">
                    {brand.active ? (
                      <span
                        className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-300 group-hover:gap-3"
                        style={{ color: brand.accent }}
                      >
                        <span className="eyebrow">
                          {locale === 'ar' ? 'استكشف' : 'Explore'}
                        </span>
                        <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-paper/40">
                        <Plus className="w-4 h-4" />
                        <span className="eyebrow">
                          {t(`brandSelector.${brand.key}.comingSoon`)}
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Gold underline that grows on hover */}
                  <div
                    className="h-px mt-6 transition-all duration-500"
                    style={{
                      backgroundColor: brand.accent,
                      width: hoveredBrand === idx ? '100%' : '40px',
                      opacity: hoveredBrand === idx ? 1 : 0.4,
                    }}
                  />
                </motion.div>
              )

              if (brand.active) {
                return (
                  <Link key={brand.key} href="/products" className="block">
                    {card}
                  </Link>
                )
              }
              return <div key={brand.key}>{card}</div>
            })}
          </div>
        </div>
      </div>

      {/* === Bottom: Stats bar === */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-0 inset-x-0 z-30 pb-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-8 sm:gap-16">
            {[
              { value: '500+', label: locale === 'ar' ? 'منتج فاخر' : 'Luxury Items' },
              { value: '2000+', label: locale === 'ar' ? 'حدث ناجح' : 'Events' },
              { value: '5', label: locale === 'ar' ? 'سنوات خبرة' : 'Years' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 + i * 0.1 }}
                className="text-center"
              >
                <div className="font-display text-2xl sm:text-3xl text-gold tabular-nums">
                  {stat.value}
                </div>
                <div className="eyebrow text-paper/40 mt-1 text-[10px]">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 hidden md:block"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-px h-8 bg-gradient-to-b from-gold/40 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  )
}
