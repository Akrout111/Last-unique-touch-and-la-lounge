'use client'

import { motion } from 'framer-motion'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/routing'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { BirthdayVisualizer } from '@/components/your-birthday/birthday-visualizer'

/**
 * Decorative icon + color pairs for the six service tiles.
 * The strings themselves (title + desc) live in
 * messages/{ar,en}.json under `yourBirthday.features.services.*` —
 * icons and colors are decorative, not translated, so they stay here.
 */
const SERVICE_DECOR: Array<{ icon: string; color: string }> = [
  { icon: '🎂', color: '#8B5CF6' },
  { icon: '🎭', color: '#EC4899' },
  { icon: '🎈', color: '#00F3FF' },
  { icon: '🎵', color: '#F97316' },
  { icon: '💡', color: '#10B981' },
  { icon: '📸', color: '#EF4444' },
]

export default function BirthdayFeaturesView() {
  const locale = useLocale() as 'ar' | 'en'
  const router = useRouter()
  const t = useTranslations('yourBirthday.features')
  const ArrowIcon = locale === 'ar' ? ArrowRight : ArrowLeft

  // Pull the raw services array (each entry: { title, desc }) and merge in
  // the decorative icon/color from the constant above.
  const rawServices = (t.raw('services') as Array<{ title: string; desc: string }>) ?? []
  const services = rawServices.map((s, i) => ({
    ...s,
    icon: SERVICE_DECOR[i]?.icon ?? '✨',
    color: SERVICE_DECOR[i]?.color ?? '#8B5CF6',
  }))

  return (
    <div className="relative w-full min-h-screen bg-[#020204] overflow-hidden">
      {/* 3D Background */}
      <BirthdayVisualizer />

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-1 bg-gradient-to-t from-[#020204] via-[#020204]/80 to-[#020204]/50 pointer-events-none" />

      {/* Back button */}
      <div className="absolute top-6 sm:top-10 start-6 sm:start-10 z-20">
        <button
          onClick={() => router.push('/your-birthday')}
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:border-white/30 transition-all font-medium text-xs cursor-pointer"
        >
          <ArrowIcon className="w-4 h-4" />
          <span>{t('back')}</span>
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl md:text-5xl font-black uppercase tracking-wider mb-4"
              style={{
                fontFamily: locale === 'ar' ? 'var(--font-birthday-arabic), Cairo, sans-serif' : 'var(--font-birthday-headline), Orbitron, sans-serif',
                background: 'linear-gradient(135deg, #8B5CF6, #EC4899, #00F3FF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('title')}
            </h2>
            <p className="text-sm text-white/50 max-w-xl mx-auto">
              {t('subtitle')}
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#00F3FF] mx-auto rounded-full mt-6" />
          </motion.div>

          {/* Services grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative p-8 rounded-lg bg-[#09090f]/80 border border-white/5 hover:border-white/15 transition-all duration-500 backdrop-blur-md overflow-hidden"
              >
                <div
                  className="absolute -top-12 -end-12 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{ background: service.color }}
                />
                <div className="relative z-10">
                  {/* Birthday circular frame — signature ornament around each service icon */}
                  <div
                    className="relative size-20 rounded-full border-4 border-deep-purple bg-gold/10 flex items-center justify-center mx-auto mb-5 shadow-luxury transition-transform duration-500 group-hover:scale-110"
                    style={{ boxShadow: `0 0 0 1px ${service.color}22, 0 4px 16px rgba(75, 24, 88, 0.25)` }}
                  >
                    {/* Inner gold ring — matches BirthdayCircularFrame aesthetic */}
                    <span
                      className="pointer-events-none absolute inset-1 rounded-full border"
                      style={{ borderColor: 'rgba(245, 185, 20, 0.4)' }}
                    />
                    <span className="text-4xl leading-none" aria-hidden="true">{service.icon}</span>
                  </div>
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{
                      color: service.color,
                      fontFamily: locale === 'ar' ? 'var(--font-birthday-arabic), Cairo' : 'var(--font-birthday-sub), Rajdhani',
                    }}
                  >
                    {service.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">{service.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mt-16"
          >
            <button
              onClick={() => router.push('/contact')}
              className="px-10 py-4 rounded-full font-bold text-white transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_25px_rgba(139,92,246,0.4)]"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                fontFamily: locale === 'ar' ? 'var(--font-birthday-arabic)' : 'var(--font-birthday-sub)',
              }}
            >
              {t('bookNow')}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
