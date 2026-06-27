import { useTranslations } from 'next-intl'
import { Armchair, CalendarDays, Truck, Box } from 'lucide-react'

const features = [
  {
    key: 'luxury' as const,
    icon: Armchair,
  },
  {
    key: 'flexible' as const,
    icon: CalendarDays,
  },
  {
    key: 'delivery' as const,
    icon: Truck,
  },
  {
    key: '3d' as const,
    icon: Box,
  },
]

export function WhyUs() {
  const t = useTranslations()

  return (
    <section className="py-20 sm:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-block w-2 h-2 rounded-full bg-gold mb-4" />
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            {t('whyUs.title')}
          </h2>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.key}
                className="text-center p-6 rounded-xl bg-card border border-border"
              >
                {/* Icon in circle */}
                <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-6 h-6 text-gold" />
                </div>

                <h3 className="font-bold text-foreground mb-2">
                  {t(`whyUs.items.${feature.key}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`whyUs.items.${feature.key}.desc`)}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
