'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { MagneticButton } from '@/components/ui-premium/magnetic-button'

export function Hero() {
  const t = useTranslations()
  const locale = useLocale()
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight

  return (
    <section
      ref={ref}
      className="relative min-h-[100vh] flex items-center overflow-hidden bg-ink"
      style={{ perspective: '1200px' }}
    >
      {/* Background gradient mesh */}
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 20% 40%, rgba(201, 162, 39, 0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 60%, rgba(185, 28, 28, 0.06) 0%, transparent 50%)',
          }}
        />
      </motion.div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #F4EFE6 1px, transparent 1px), linear-gradient(to bottom, #F4EFE6 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <motion.div
        style={{ opacity }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-24 pb-16"
      >
        {/* Left: Editorial headline */}
        <div className="lg:col-span-7 text-center lg:text-start">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center lg:justify-start gap-3 mb-8"
          >
            <span className="w-8 h-px bg-gold" />
            <span className="eyebrow text-gold">
              {locale === 'ar' ? 'كويت · تأجير فاخر' : 'Kuwait · Luxury Rental'}
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-paper leading-[0.95] mb-8">
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="block"
            >
              {t('hero.title')}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
              className="block italic text-gold-gradient"
            >
              {t('hero.titleAccent')}
            </motion.span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="text-lg sm:text-xl text-paper/50 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
          >
            <MagneticButton href={`/${locale}/products`}>
              <span className="group inline-flex items-center gap-3 px-8 py-4 bg-lut text-paper rounded-none hover:bg-lut/90 transition-colors duration-300 relative overflow-hidden">
                <span className="relative z-10 text-sm font-medium tracking-wide">
                  {t('hero.ctaPrimary')}
                </span>
                <ArrowIcon className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </span>
            </MagneticButton>

            <MagneticButton href={`/${locale}/about`}>
              <span className="group inline-flex items-center gap-3 px-8 py-4 border border-gold/40 text-gold hover:bg-gold/10 transition-colors duration-300">
                <span className="text-sm font-medium tracking-wide">
                  {t('hero.ctaSecondary')}
                </span>
              </span>
            </MagneticButton>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
            className="mt-16 flex items-center gap-8 justify-center lg:justify-start"
          >
            {[
              { value: '500+', label: locale === 'ar' ? 'منتج' : 'Products' },
              { value: '2000+', label: locale === 'ar' ? 'حدث' : 'Events' },
              { value: '5', label: locale === 'ar' ? 'سنوات' : 'Years' },
            ].map((stat, i) => (
              <div key={i} className="text-center lg:text-start">
                <div className="font-display text-3xl text-gold tabular-nums">{stat.value}</div>
                <div className="eyebrow text-paper/40 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: Floating 3D-ish visual */}
        <div className="lg:col-span-5 hidden lg:block">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="relative aspect-[3/4]"
          >
            {/* Main image card */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <div
                className="relative w-full h-full overflow-hidden"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%)',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800&q=80"
                  alt="Luxury furniture"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              </div>
            </motion.div>

            {/* Floating accent card */}
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -bottom-8 -start-8 w-40 h-52 overflow-hidden shadow-luxury"
              style={{ borderRadius: '2px' }}
            >
              <img
                src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&q=80"
                alt="Accent"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Gold ring decoration */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-12 -end-12 w-32 h-32 rounded-full border border-gold/20"
            >
              <div className="absolute top-0 left-1/2 w-2 h-2 bg-gold rounded-full -translate-x-1/2 -translate-y-1/2" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="eyebrow text-paper/30">
            {locale === 'ar' ? 'اسحب للأسفل' : 'Scroll'}
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-gold/50 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  )
}
