'use client'

import { useRef, useState, useEffect } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react'
import Image from 'next/image'
import { Hero3DSection } from '@/components/hero-3d/hero-3d-section'
import { Background3D } from '@/components/hero-3d/background-3d'
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

  useEffect(() => {
    const cleanup = initScrollTracking(ref.current)
    return cleanup
  }, [])

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden bg-ink flex flex-col"
    >
      {/* === 3D Furniture Tunnel Background (dark, cinematic) === */}
      <Background3D />

      {/* Subtle red brand glow on top of the dark tunnel */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 30% 20%, rgba(230, 33, 41, 0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 70% 80%, rgba(230, 33, 41, 0.08) 0%, transparent 50%)',
        }}
      />

      {/* === Top: Brand logo + tagline === */}
      <motion.div
        style={{ opacity }}
        className="relative z-40 pt-16 sm:pt-20 pb-2 sm:pb-4 text-center px-4 shrink-0"
      >
        <div
          className="animate-hero-down flex items-center justify-center gap-2 sm:gap-3 mb-2"
          style={{ animationDelay: '0.2s' }}
        >
          <span className="w-6 sm:w-8 h-px bg-gold/50" />
          <span className="eyebrow text-gold/80 text-[10px] sm:text-xs">
            {locale === 'ar' ? 'منصة تأجير فاخرة · الكويت' : 'Luxury Rental Platform · Kuwait'}
          </span>
          <span className="w-6 sm:w-8 h-px bg-gold/50" />
        </div>

        <h1
          className="animate-hero-down font-display text-xl sm:text-3xl md:text-4xl text-paper"
          style={{ animationDelay: '0.3s' }}
        >
          {t('brand.lut')}
        </h1>

        <p
          className="animate-hero-in text-xs sm:text-sm text-paper/60 mt-1"
          style={{ animationDelay: '0.5s' }}
        >
          {locale === 'ar' ? 'اختر تجربتك' : 'Choose Your Experience'}
        </p>
      </motion.div>

      {/* === UNIFIED Hero: 3D enabled on ALL devices === */}
      <div className="relative flex-1 flex items-center px-3 sm:px-6 lg:px-8 py-2">
        <Hero3DSection cardRefs={cardRefs}>
          <div className="w-full max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 lg:gap-6 md:h-[55vh] md:min-h-[380px]">
              {brands.map((brand, idx) => {
                const card = (
                  <div
                    key={brand.key}
                    ref={(el) => {
                      cardRefs[idx].current = el
                    }}
                    onMouseEnter={() => setHoveredBrand(idx)}
                    onMouseLeave={() => setHoveredBrand(null)}
                    className={`glass-card glass-card-shape animate-card-deal group relative ${brand.active ? 'cursor-pointer' : 'cursor-default'}`}
                    style={{
                      minHeight: '120px',
                      maxHeight: '150px',
                      animationDelay: `${0.6 + idx * 0.15}s`,
                    }}
                  >
                    {/* Inner glass surface (conforms to the arched shape) */}
                    <div className="glass-card-inner glass-card-shape absolute inset-0">
                      {/* Subtle brand color glow at top */}
                      <div
                        className="absolute top-0 inset-x-0 h-2/3 pointer-events-none transition-opacity duration-500"
                        style={{
                          background: `linear-gradient(to bottom, ${brand.accent}15, transparent)`,
                          opacity: hoveredBrand === idx ? 0.6 : 0.3,
                        }}
                      />

                      {/* Gold accent line at top — grows on hover via CSS */}
                      <div
                        className="glass-card-accent absolute top-0 left-0 h-0.5 bg-gold"
                        style={{ width: '40px', opacity: 0.5 }}
                      />

                      {/* Content */}
                      <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-5 lg:p-6">
                        {/* Tag row */}
                        <div className="flex items-center gap-2 mb-1.5 sm:mb-3">
                          <span
                            className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                            style={{
                              backgroundColor: brand.accent,
                              boxShadow: hoveredBrand === idx ? `0 0 8px ${brand.accent}` : 'none',
                              transform: hoveredBrand === idx ? 'scale(1.3)' : 'scale(1)',
                            }}
                          />
                          <span
                            className="eyebrow transition-colors duration-300 text-[8px] sm:text-[10px] md:text-xs"
                            style={{
                              color: hoveredBrand === idx ? '#d4af37' : 'rgba(255,255,255,0.4)',
                            }}
                          >
                            {brand.tag}
                          </span>
                        </div>

                        {/* Brand logo */}
                        <div className="mb-1.5 sm:mb-4 transition-all duration-500">
                          <Image
                            src={brand.logo}
                            alt=""
                            width={100}
                            height={36}
                            className="h-6 sm:h-10 md:h-12 w-auto object-contain rounded-sm transition-all duration-500"
                            style={{
                              opacity: hoveredBrand === idx ? 1 : 0.7,
                              filter:
                                hoveredBrand === idx
                                  ? 'drop-shadow(0 0 12px rgba(212, 175, 55, 0.3))'
                                  : 'none',
                            }}
                          />
                        </div>

                        {/* Brand name */}
                        <h2
                          className="font-display text-base sm:text-xl md:text-2xl lg:text-3xl text-paper leading-tight mb-1 transition-all duration-500"
                          style={{
                            transform: hoveredBrand === idx ? 'translateY(-4px)' : 'translateY(0)',
                            textShadow: hoveredBrand === idx
                              ? '0 2px 20px rgba(0,0,0,0.5)'
                              : '0 1px 8px rgba(0,0,0,0.4)',
                          }}
                        >
                          {t(`brandSelector.${brand.key}.name`)}
                        </h2>

                        {/* Description */}
                        <p
                          className="glass-card-desc text-[9px] sm:text-xs md:text-sm text-paper/60 leading-relaxed mb-1.5 sm:mb-3 overflow-hidden max-w-xs"
                          style={{
                            maxHeight: hoveredBrand === idx ? '40px' : '20px',
                            opacity: hoveredBrand === idx ? 1 : 0.6,
                          }}
                        >
                          {t(`brandSelector.${brand.key}.desc`)}
                        </p>

                        {/* CTA / Badge */}
                        <div className="flex items-center gap-2">
                          {brand.active ? (
                            <span
                              className="inline-flex items-center gap-2 text-[10px] sm:text-sm font-medium transition-all duration-500 group-hover:gap-3"
                              style={{ color: '#d4af37' }}
                            >
                              <span className="eyebrow text-[8px] sm:text-[10px] md:text-xs">
                                {locale === 'ar' ? 'استكشف' : 'Explore'}
                              </span>
                              <ArrowIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 text-paper/30">
                              <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                              <span className="eyebrow text-[8px] sm:text-[10px] md:text-xs">
                                {t(`brandSelector.${brand.key}.comingSoon`)}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
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
              <div
                key={i}
                className="animate-hero-up text-center"
                style={{ animationDelay: `${1.0 + i * 0.1}s` }}
              >
                <div className="font-display text-base sm:text-2xl text-gold tabular-nums">
                  {stat.value}
                </div>
                <div className="eyebrow text-paper/60 mt-0.5 text-[8px] sm:text-[10px]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
