'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Armchair, CalendarDays, Truck, Box } from 'lucide-react'

const features = [
  { key: 'luxury' as const, icon: Armchair },
  { key: 'flexible' as const, icon: CalendarDays },
  { key: 'delivery' as const, icon: Truck },
  { key: '3d' as const, icon: Box },
]

export function WhyUs() {
  const t = useTranslations()

  return (
    <section className="relative py-32 bg-paper overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-8 h-px bg-gold" />
            <span className="eyebrow text-gold">
              {t('whyUs.title')}
            </span>
            <span className="w-8 h-px bg-gold" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-ink max-w-3xl mx-auto leading-tight">
            {t('whyUs.title')}
          </h2>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                  delay: idx * 0.1,
                }}
                className="group relative bg-paper p-10 hover:bg-paper-warm transition-colors duration-500 cursor-default"
              >
                {/* Number */}
                <span className="absolute top-6 end-6 font-mono text-xs text-taupe/50 tabular-nums">
                  0{idx + 1}
                </span>

                {/* Icon */}
                <div className="w-14 h-14 mb-8 flex items-center justify-center border border-gold/30 rounded-none group-hover:border-gold transition-colors duration-500">
                  <Icon className="w-6 h-6 text-gold" strokeWidth={1.2} />
                </div>

                {/* Content */}
                <h3 className="font-display text-2xl text-ink mb-3">
                  {t(`whyUs.items.${feature.key}.title`)}
                </h3>
                <p className="text-stone text-sm leading-relaxed">
                  {t(`whyUs.items.${feature.key}.desc`)}
                </p>

                {/* Gold underline that grows on hover */}
                <div className="w-8 h-px bg-gold mt-6 group-hover:w-full transition-all duration-700" />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
