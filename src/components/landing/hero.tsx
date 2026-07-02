'use client'

import { useRef, useEffect } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from '@/i18n/routing'
import { Background3D } from '@/components/hero-3d/background-3d'
import { ExperienceCard } from './experience-card'
import { initScrollTracking } from '@/stores/scroll-store'

export function Hero() {
  const t = useTranslations()
  const locale = useLocale() as 'ar' | 'en'
  const ref = useRef<HTMLElement>(null)
  const router = useRouter()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  useEffect(() => {
    const cleanup = initScrollTracking(ref.current)
    return cleanup
  }, [])

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden bg-ink flex flex-col"
    >
      {/* 3D Furniture Tunnel Background */}
      <Background3D />

      {/* Subtle red brand glow */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 30% 20%, rgba(230, 33, 41, 0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 70% 80%, rgba(230, 33, 41, 0.08) 0%, transparent 50%)',
        }}
      />

      {/* Top: Brand logo + tagline */}
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
            {t('hero.eyebrow')}
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
          {t('hero.chooseExperience')}
        </p>
      </motion.div>

      {/* === Holo-Chamber Cards === */}
      <div className="relative z-20 flex-1 flex items-center px-3 sm:px-6 lg:px-8 py-2">
        <div className="w-full max-w-5xl mx-auto flex flex-col gap-3 md:gap-6 lg:gap-8">
          <ExperienceCard
            category="Heritage"
            title={t('brandSelector.lut.name')}
            actionText={t('hero.explore')}
            productImageUrl="/products/lalounge_modern.webp"
            logoUrl="/logo-lut.jpg"
            isComingSoon={false}
            delay={0.01}
            index="01"
            accentColor="heritage"
            locale={locale}
            onClick={() => router.push('/products')}
          />
          <ExperienceCard
            category="Modern"
            title={t('brandSelector.lalounge.name')}
            actionText={t('hero.explore')}
            productImageUrl="/products/lut_heritage.webp"
            logoUrl="/logo-lalounge.jpg"
            isComingSoon={false}
            delay={0.02}
            index="02"
            accentColor="modern"
            locale={locale}
            onClick={() => router.push('/la-lounge')}
          />
          <ExperienceCard
            category="Atelier"
            title={t('brandSelector.birthday.name')}
            actionText={t('hero.explore')}
            productImageUrl="/products/birthday_atelier.webp"
            logoUrl="/logo-birthday.jpg"
            isComingSoon={false}
            delay={0.03}
            index="03"
            accentColor="atelier"
            locale={locale}
            onClick={() => router.push('/your-birthday')}
          />
        </div>
      </div>

      {/* Bottom: Stats bar */}
      <motion.div
        style={{ opacity }}
        className="relative z-40 pb-4 sm:pb-6 px-4 shrink-0"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-4 sm:gap-12">
            {[
              { value: '500+', label: t('hero.statLabels.luxuryItems') },
              { value: '2000+', label: t('hero.statLabels.events') },
              { value: '5', label: t('hero.statLabels.years') },
            ].map((stat, i) => (
              <div
                key={i}
                className="animate-hero-up text-center"
                style={{ animationDelay: `${1.0 + i * 0.1}s` }}
              >
                <div className="font-display text-base sm:text-2xl text-gold tabular-nums">{stat.value}</div>
                <div className="eyebrow text-paper/60 mt-0.5 text-[8px] sm:text-[10px]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
