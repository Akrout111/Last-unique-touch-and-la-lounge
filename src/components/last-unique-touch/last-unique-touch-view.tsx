'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from '@/i18n/routing'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Background3D } from '@/components/hero-3d/background-3d'

export default function LastUniqueTouchView() {
  const t = useTranslations()
  const locale = useLocale() as 'ar' | 'en'
  const router = useRouter()
  const ref = useRef<HTMLElement>(null)
  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight

  useEffect(() => {
  }, [])

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden bg-ink flex flex-col"
    >
      {/* Same 3D Furniture Tunnel Background as the home page */}
      <Background3D />

      {/* Subtle red brand glow */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 30% 20%, rgba(230, 33, 41, 0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 70% 80%, rgba(230, 33, 41, 0.08) 0%, transparent 50%)',
        }}
      />

      {/* Back button */}
      <div className="absolute top-20 start-4 sm:start-6 z-40">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-paper/70 hover:text-paper hover:border-white/30 transition-all text-xs"
        >
          <ArrowIcon className="w-4 h-4" />
          <span className="font-medium tracking-wide">
            {locale === 'ar' ? 'العودة' : 'Back'}
          </span>
        </button>
      </div>

      {/* Hero title block */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pt-20 pb-8">
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
          initial={{ opacity: 0, filter: 'blur(10px)', y: 10 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
          className="font-display text-3xl sm:text-5xl md:text-6xl text-paper mb-3"
        >
          {t('brandSelector.lut.name')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
          className="text-sm sm:text-base text-paper/60 max-w-md mb-2"
        >
          {t('brandSelector.lut.desc')}
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9, ease: 'easeOut' }}
          className="flex items-center justify-center gap-6 sm:gap-12 mt-8"
        >
          {[
            { value: '500+', label: locale === 'ar' ? 'منتج فاخر' : 'Luxury Items' },
            { value: '2000+', label: locale === 'ar' ? 'حدث ناجح' : 'Events' },
            { value: '5', label: locale === 'ar' ? 'سنوات خبرة' : 'Years' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-display text-lg sm:text-3xl text-gold tabular-nums">
                {stat.value}
              </div>
              <div className="eyebrow text-paper/50 mt-0.5 text-[8px] sm:text-[10px]">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA button */}
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2, ease: 'easeOut' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push('/products')}
          className="mt-10 px-10 py-3.5 bg-lut hover:bg-lut/90 text-white rounded-full font-sans tracking-wide text-sm font-medium shadow-[0_4px_20px_rgba(230,33,41,0.3)] hover:shadow-[0_6px_25px_rgba(230,33,41,0.4)] transition-all cursor-pointer border border-lut/30"
        >
          {locale === 'ar' ? 'استكشف المنتجات' : 'Explore Products'}
        </motion.button>
      </div>
    </section>
  )
}
