'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react'

interface Brand {
  key: 'lut' | 'lalounge' | 'birthday'
  image: string
  logo: string
  accent: string
  active: boolean
  tag: string
}

const brands: Brand[] = [
  {
    key: 'lut',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=85',
    logo: '/logo-lut.jpg',
    accent: '#C9A227',
    active: true,
    tag: 'HERITAGE',
  },
  {
    key: 'lalounge',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1600&q=85',
    logo: '/logo-lalounge.jpg',
    accent: '#9D174D',
    active: false,
    tag: 'MODERN',
  },
  {
    key: 'birthday',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1600&q=85',
    logo: '/logo-birthday.jpg',
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
      className="relative min-h-screen w-full overflow-hidden bg-ink flex flex-col"
    >
      {/* === Top: Brand logo + tagline === */}
      <motion.div
        style={{ opacity }}
        className="relative z-30 pt-20 sm:pt-24 pb-4 sm:pb-6 text-center px-4 shrink-0"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="flex items-center justify-center gap-2 sm:gap-3 mb-3"
        >
          <span className="w-6 sm:w-8 h-px bg-gold/50" />
          <span className="eyebrow text-gold/80 text-[10px] sm:text-xs">
            {locale === 'ar' ? 'منصة تأجير فاخرة · الكويت' : 'Luxury Rental Platform · Kuwait'}
          </span>
          <span className="w-6 sm:w-8 h-px bg-gold/50" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="font-display text-2xl sm:text-4xl md:text-5xl text-paper"
        >
          {t('brand.lut')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-xs sm:text-sm text-paper/40 mt-2"
        >
          {locale === 'ar' ? 'اختر تجربتك' : 'Choose Your Experience'}
        </motion.p>
      </motion.div>

      {/* === Middle: Brand cards (responsive) === */}
      <div className="relative z-20 flex-1 flex items-center px-4 sm:px-6 lg:px-8 py-4">
        <div className="w-full max-w-7xl mx-auto">
          {/* Desktop: 3-column triptych with background images */}
          <div className="hidden md:grid md:grid-cols-3 gap-4 lg:gap-6 h-[60vh] min-h-[400px]">
            {brands.map((brand, idx) => (
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
                className="group relative overflow-hidden cursor-pointer"
                style={{
                  borderRadius: '2px',
                  transition: 'flex 0.7s cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                {/* Background image */}
                <div className="absolute inset-0">
                  <motion.div
                    animate={{ scale: hoveredBrand === idx ? 1.1 : 1 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={brand.image}
                      alt={t(`brandSelector.${brand.key}.name`)}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>

                {/* Gradient overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    background: hoveredBrand === idx
                      ? 'linear-gradient(to top, rgba(14,13,11,0.95) 0%, rgba(14,13,11,0.3) 60%, rgba(14,13,11,0.1) 100%)'
                      : 'linear-gradient(to top, rgba(14,13,11,0.9) 0%, rgba(14,13,11,0.5) 50%, rgba(14,13,11,0.3) 100%)',
                  }}
                />

                {/* Inactive overlay */}
                {!brand.active && (
                  <div className="absolute inset-0 bg-ink/40" />
                )}

                {/* Accent top line */}
                <div
                  className="absolute top-0 inset-x-0 h-1 transition-opacity duration-500"
                  style={{
                    backgroundColor: brand.accent,
                    opacity: hoveredBrand === idx ? 1 : 0.3,
                  }}
                />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
                  {/* Tag */}
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="w-2 h-2 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: brand.accent,
                        transform: hoveredBrand === idx ? 'scale(1.5)' : 'scale(1)',
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
                    className="font-display text-2xl sm:text-3xl lg:text-4xl text-paper leading-tight mb-2 transition-all duration-300"
                    style={{
                      transform: hoveredBrand === idx ? 'translateY(-4px)' : 'translateY(0)',
                    }}
                  >
                    {t(`brandSelector.${brand.key}.name`)}
                  </h2>

                  {/* Description */}
                  <p
                    className="text-sm text-paper/50 leading-relaxed mb-4 transition-all duration-300 overflow-hidden max-w-xs"
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

                  {/* Gold underline */}
                  <div
                    className="h-px mt-4 transition-all duration-500"
                    style={{
                      backgroundColor: brand.accent,
                      width: hoveredBrand === idx ? '100%' : '40px',
                      opacity: hoveredBrand === idx ? 1 : 0.4,
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile: Stacked cards */}
          <div className="md:hidden space-y-4">
            {brands.map((brand, idx) => {
              const card = (
                <motion.div
                  key={brand.key}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.4 + idx * 0.1,
                  }}
                  className="group relative overflow-hidden cursor-pointer"
                  style={{ borderRadius: '2px', minHeight: '200px' }}
                >
                  {/* Background image */}
                  <div className="absolute inset-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={brand.image}
                      alt={t(`brandSelector.${brand.key}.name`)}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to top, rgba(14,13,11,0.95) 0%, rgba(14,13,11,0.5) 50%, rgba(14,13,11,0.2) 100%)',
                    }}
                  />

                  {/* Inactive overlay */}
                  {!brand.active && (
                    <div className="absolute inset-0 bg-ink/30" />
                  )}

                  {/* Accent top line */}
                  <div
                    className="absolute top-0 inset-x-0 h-1"
                    style={{ backgroundColor: brand.accent }}
                  />

                  {/* Content */}
                  <div className="relative p-5 pt-16 flex flex-col justify-end min-h-[200px]">
                    {/* Tag */}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: brand.accent }}
                      />
                      <span className="eyebrow text-[10px]" style={{ color: brand.accent }}>
                        {brand.tag}
                      </span>
                    </div>

                    {/* Brand name */}
                    <h2 className="font-display text-2xl text-paper leading-tight mb-1">
                      {t(`brandSelector.${brand.key}.name`)}
                    </h2>

                    {/* Description */}
                    <p className="text-xs text-paper/50 leading-relaxed mb-3">
                      {t(`brandSelector.${brand.key}.desc`)}
                    </p>

                    {/* CTA / Badge */}
                    <div className="flex items-center gap-2">
                      {brand.active ? (
                        <span
                          className="inline-flex items-center gap-2 text-sm font-medium"
                          style={{ color: brand.accent }}
                        >
                          <span className="eyebrow text-[10px]">
                            {locale === 'ar' ? 'استكشف' : 'Explore'}
                          </span>
                          <ArrowIcon className="w-3 h-3" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-paper/40">
                          <Plus className="w-3 h-3" />
                          <span className="eyebrow text-[10px]">
                            {t(`brandSelector.${brand.key}.comingSoon`)}
                          </span>
                        </span>
                      )}
                    </div>

                    {/* Gold underline */}
                    <div
                      className="h-px mt-3"
                      style={{
                        backgroundColor: brand.accent,
                        width: '40px',
                        opacity: 0.6,
                      }}
                    />
                  </div>
                </motion.div>
              )

              if (brand.active) {
                return (
                  <Link key={brand.key} href="/products">
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
        className="relative z-30 pb-6 sm:pb-8 px-4 shrink-0"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-6 sm:gap-16">
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
                <div className="font-display text-xl sm:text-3xl text-gold tabular-nums">
                  {stat.value}
                </div>
                <div className="eyebrow text-paper/40 mt-1 text-[9px] sm:text-[10px]">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
