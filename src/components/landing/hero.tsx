'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react'
import Image from 'next/image'
import { Hero3DSection } from '@/components/hero-3d/hero-3d-section'
import { initScrollTracking } from '@/stores/scroll-store'

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
    accent: '#E62129',
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
    accent: '#FFD700',
    active: false,
    tag: 'ATELIER',
  },
]

export function Hero() {
  const t = useTranslations()
  const locale = useLocale()
  const ref = useRef<HTMLElement>(null)
  // One ref per brand card — passed to the 3D models for DOM-tracked positioning
  const cardRefs = [
    useRef<HTMLElement | null>(null),
    useRef<HTMLElement | null>(null),
    useRef<HTMLElement | null>(null),
  ]
  const [hoveredBrand, setHoveredBrand] = useState<number | null>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight

  // Initialize RAF scroll tracking for the 3D models (scroll-driven fade/scale)
  useEffect(() => {
    const cleanup = initScrollTracking(ref.current)
    return cleanup
  }, [])

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden bg-paper flex flex-col"
    >
      {/* Red gradient mesh — subtle brand glow on white */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 30% 20%, rgba(230, 33, 41, 0.10) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 70% 80%, rgba(230, 33, 41, 0.07) 0%, transparent 50%), linear-gradient(to bottom, transparent 0%, rgba(245, 245, 245, 0.4) 80%, rgba(232, 232, 232, 0.6) 100%)',
        }}
      />

      {/* === Top: Brand logo + tagline === */}
      <motion.div
        style={{ opacity }}
        className="relative z-40 pt-16 sm:pt-20 pb-2 sm:pb-4 text-center px-4 shrink-0"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="flex items-center justify-center gap-2 sm:gap-3 mb-2"
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
          className="font-display text-xl sm:text-3xl md:text-4xl text-ink"
        >
          {t('brand.lut')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-xs sm:text-sm text-ink/50 mt-1"
        >
          {locale === 'ar' ? 'اختر تجربتك' : 'Choose Your Experience'}
        </motion.p>
      </motion.div>

      {/* === UNIFIED Hero: 3D enabled on ALL devices === */}
      <div className="relative flex-1 flex items-center px-3 sm:px-6 lg:px-8 py-2">
        <Hero3DSection cardRefs={cardRefs}>
          <div className="w-full max-w-7xl mx-auto">
            {/* Mobile: vertical stack with small gap. Desktop: 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 lg:gap-6 md:h-[55vh] md:min-h-[380px]">
              {brands.map((brand, idx) => {
                const card = (
                  <motion.div
                    key={brand.key}
                    ref={(el) => {
                      cardRefs[idx].current = el
                    }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.9,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.6 + idx * 0.12,
                    }}
                    onMouseEnter={() => setHoveredBrand(idx)}
                    onMouseLeave={() => setHoveredBrand(null)}
                    className={`group relative overflow-hidden ${brand.active ? 'cursor-pointer' : 'cursor-default'}`}
                    style={{
                      borderRadius: '2px',
                      minHeight: '120px', // أصغر للموبايل
                      maxHeight: '150px', // أصغر للموبايل
                    }}
                  >
                    {/* Background image */}
                    <div className="absolute inset-0">
                      <motion.div
                        animate={{ scale: hoveredBrand === idx ? 1.08 : 1 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full h-full"
                      >
                        <Image
                          src={brand.image}
                          alt={t(`brandSelector.${brand.key}.name`)}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    </div>

                    {/* White gradient overlay — reduced opacity (more transparent) */}
                    <div
                      className="absolute inset-0 transition-opacity duration-500"
                      style={{
                        background:
                          hoveredBrand === idx
                            ? 'linear-gradient(to top, rgba(245,245,245,0.85) 0%, rgba(245,245,245,0.55) 50%, rgba(245,245,245,0.35) 100%)'
                            : 'linear-gradient(to top, rgba(245,245,245,0.80) 0%, rgba(245,245,245,0.50) 50%, rgba(245,245,245,0.30) 100%)',
                      }}
                    />

                    {/* Inactive overlay — more solid */}
                    {!brand.active && <div className="absolute inset-0 bg-paper/60" />}

                    {/* Accent top line */}
                    <div
                      className="absolute top-0 inset-x-0 h-1 transition-opacity duration-500"
                      style={{
                        backgroundColor: brand.accent,
                        opacity: hoveredBrand === idx ? 1 : 0.3,
                      }}
                    />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-5 lg:p-6">
                      {/* Tag */}
                      <div className="flex items-center gap-2 mb-1.5 sm:mb-3">
                        <span
                          className="w-2 h-2 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: brand.accent,
                            transform: hoveredBrand === idx ? 'scale(1.5)' : 'scale(1)',
                          }}
                        />
                        <span
                          className="eyebrow transition-colors duration-300 text-[8px] sm:text-[10px] md:text-xs"
                          style={{
                            color: hoveredBrand === idx ? brand.accent : 'rgba(10, 10, 10, 0.4)',
                          }}
                        >
                          {brand.tag}
                        </span>
                      </div>

                      {/* Brand logo */}
                      <div className="mb-1.5 sm:mb-4 transition-all duration-300">
                        <Image
                          src={brand.logo}
                          alt=""
                          width={100}
                          height={36}
                          className="h-6 sm:h-10 md:h-12 w-auto object-contain rounded-sm"
                          style={{
                            opacity: hoveredBrand === idx ? 1 : 0.85,
                            filter:
                              hoveredBrand === idx
                                ? `drop-shadow(0 0 8px ${brand.accent}40)`
                                : 'none',
                          }}
                        />
                      </div>

                      {/* Brand name */}
                      <h2
                        className="font-display text-base sm:text-xl md:text-2xl lg:text-3xl text-ink leading-tight mb-1 transition-all duration-300"
                        style={{
                          transform: hoveredBrand === idx ? 'translateY(-3px)' : 'translateY(0)',
                        }}
                      >
                        {t(`brandSelector.${brand.key}.name`)}
                      </h2>

                      {/* Description */}
                      <p
                        className="text-[9px] sm:text-xs md:text-sm text-ink/60 leading-relaxed mb-1.5 sm:mb-3 transition-all duration-300 overflow-hidden max-w-xs"
                        style={{
                          maxHeight: hoveredBrand === idx ? '40px' : '20px',
                          opacity: hoveredBrand === idx ? 1 : 0.7,
                        }}
                      >
                        {t(`brandSelector.${brand.key}.desc`)}
                      </p>

                      {/* CTA / Badge */}
                      <div className="flex items-center gap-2">
                        {brand.active ? (
                          <span
                            className="inline-flex items-center gap-2 text-[10px] sm:text-sm font-medium transition-all duration-300 group-hover:gap-3"
                            style={{ color: brand.accent }}
                          >
                            <span className="eyebrow text-[8px] sm:text-[10px] md:text-xs">
                              {locale === 'ar' ? 'استكشف' : 'Explore'}
                            </span>
                            <ArrowIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-ink/40">
                            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                            <span className="eyebrow text-[8px] sm:text-[10px] md:text-xs">
                              {t(`brandSelector.${brand.key}.comingSoon`)}
                            </span>
                          </span>
                        )}
                      </div>

                      {/* Underline */}
                      <div
                        className="h-px mt-1.5 sm:mt-4 transition-all duration-500"
                        style={{
                          backgroundColor: brand.accent,
                          width: hoveredBrand === idx ? '100%' : '40px',
                          opacity: hoveredBrand === idx ? 1 : 0.4,
                        }}
                      />
                    </div>
                  </motion.div>
                )

                if (brand.active) {
                  return (
                    <Link key={brand.key} href="/products" className="block h-full">
                      {card}
                    </Link>
                  )
                }
                return (
                  <div key={brand.key} className="block h-full">
                    {card}
                  </div>
                )
              })}
            </div>
          </div>
        </Hero3DSection>
      </div>

      {/* === Bottom: Stats bar === */}
      <motion.div
        style={{ opacity }}
        className="relative z-40 pb-4 sm:pb-6 px-4 shrink-0"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-4 sm:gap-12">
            {[
              { value: '500+', label: locale === 'ar' ? 'منتج فاخر' : 'Luxury Items' },
              { value: '2000+', label: locale === 'ar' ? 'حدث ناجح' : 'Events' },
              { value: '5', label: locale === 'ar' ? 'سنوات خبرة' : 'Years' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 + i * 0.1 }}
                className="text-center"
              >
                <div className="font-display text-base sm:text-2xl text-gold tabular-nums">
                  {stat.value}
                </div>
                <div className="eyebrow text-ink/50 mt-0.5 text-[8px] sm:text-[10px]">
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
