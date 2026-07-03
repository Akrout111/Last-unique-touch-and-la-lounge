'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from '@/i18n/routing'
import { ArrowLeft, ArrowRight, Check, ArrowDown } from 'lucide-react'
import { Background3D } from '@/components/hero-3d/background-3d'

export default function LastUniqueTouchView() {
  const t = useTranslations()
  const locale = useLocale() as 'ar' | 'en'
  const router = useRouter()
  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight

  const services = locale === 'ar' ? [
    { title: 'تأجير الأثاث الفاخر', desc: 'مجموعة واسعة من الأثاث الراقي للإيجار — كراسي، طاولات، أرائك، مكملات' },
    { title: 'توصيل وتركيب', desc: 'خدمة توصيل وتركيب احترافية لجميع أنحاء الكويت' },
    { title: 'فترات إيجار مرنة', desc: 'إيجار يومي، أسبوعي، أو شهري حسب احتياجاتك' },
  ] : [
    { title: 'Luxury Furniture Rental', desc: 'Wide range of premium furniture for rent — chairs, tables, sofas, accessories' },
    { title: 'Delivery & Setup', desc: 'Professional delivery and installation across Kuwait' },
    { title: 'Flexible Rental Periods', desc: 'Daily, weekly, or monthly rentals to suit your needs' },
  ]

  return (
    <section className="relative w-full bg-ink">
      {/* === Hero section — title centered, 3D furniture background === */}
      <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        <Background3D />

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
            <span className="font-medium tracking-wide">{locale === 'ar' ? 'العودة' : 'Back'}</span>
          </button>
        </div>

        {/* Centered title */}
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center gap-2 sm:gap-3 mb-3"
          >
            <span className="w-6 sm:w-8 h-px bg-gold/50" />
            <span className="eyebrow text-gold/80 text-[10px] sm:text-xs">
              {locale === 'ar' ? 'تأجير الأثاث الفاخر' : 'Luxury Furniture Rental'}
            </span>
            <span className="w-6 sm:w-8 h-px bg-gold/50" />
          </motion.div>

          <h1
            className="animate-hero-down font-display text-4xl sm:text-6xl md:text-7xl text-paper mb-4 relative z-30"
            style={{ animationDelay: '0.3s', textShadow: '0 2px 30px rgba(0,0,0,0.8)' }}
          >
            {t('brandSelector.lut.name')}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-sm sm:text-base text-paper/60 max-w-md mb-8"
          >
            {locale === 'ar'
              ? 'منصة تأجير الأثاث الفاخر في الكويت — اختر من مجموعتنا الواسعة من الأثاث الراقي'
              : 'Luxury furniture rental platform in Kuwait — choose from our wide collection of premium furniture'}
          </motion.p>

          {/* Products button */}
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/products')}
            className="px-10 py-3.5 bg-lut hover:bg-lut/90 text-white rounded-full font-sans tracking-wide text-sm font-medium shadow-[0_4px_20px_rgba(230,33,41,0.3)] transition-all cursor-pointer"
          >
            {locale === 'ar' ? 'المنتجات' : 'Products'}
          </motion.button>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-paper/40"
        >
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </motion.div>
      </div>

      {/* === Services section — revealed on scroll === */}
      <div className="relative z-10 py-20 px-4 bg-ink">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display text-2xl sm:text-4xl text-paper text-center mb-12"
          >
            {locale === 'ar' ? 'ما نقدمه' : 'What We Offer'}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center hover:border-gold/30 transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-5">
                  <Check className="w-7 h-7 text-gold" />
                </div>
                <h3 className="font-display text-xl text-paper mb-3">{service.title}</h3>
                <p className="text-sm text-paper/50 leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 sm:gap-16 mt-16">
            {[
              { value: '500+', label: locale === 'ar' ? 'منتج فاخر' : 'Luxury Items' },
              { value: '2000+', label: locale === 'ar' ? 'حدث ناجح' : 'Events' },
              { value: '5', label: locale === 'ar' ? 'سنوات خبرة' : 'Years' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-2xl sm:text-4xl text-gold tabular-nums">{stat.value}</div>
                <div className="eyebrow text-paper/50 mt-1 text-[9px] sm:text-[11px]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
