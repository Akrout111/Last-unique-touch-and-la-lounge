'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export function Hero() {
  const t = useTranslations()
  const locale = useLocale()

  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-dark">
      {/* Radial gradient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(212,165,116,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Decorative gold dot */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-gold" />
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4 leading-tight"
        >
          {t('hero.title')}{' '}
          <span className="text-lut">{t('hero.titleAccent')}</span>
        </motion.h1>

        {/* Gold underline */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-16 h-0.5 bg-gold mx-auto mb-6"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-lg sm:text-xl text-white/60 mb-10 max-w-2xl mx-auto"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            asChild
            size="lg"
            className="bg-lut hover:bg-lut/90 text-white px-8 py-3 text-base font-semibold rounded-lg"
          >
            <Link href="/products">
              {t('hero.ctaPrimary')}
              <ArrowIcon className="w-4 h-4 ms-2" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-gold/50 text-gold hover:bg-gold/10 px-8 py-3 text-base font-semibold rounded-lg"
          >
            <Link href="/about">
              {t('hero.ctaSecondary')}
            </Link>
          </Button>
        </motion.div>

        {/* Stat */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-12 text-sm text-gold/60 font-medium"
        >
          {t('hero.stat')}
        </motion.p>
      </div>
    </section>
  )
}
