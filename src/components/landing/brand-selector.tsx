import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Badge } from '@/components/ui/badge'

const brands = [
  {
    key: 'lut' as const,
    href: '/products',
    bgClass: 'bg-lut',
    active: true,
  },
  {
    key: 'lalounge' as const,
    href: null,
    bgClass: 'bg-lalounge',
    active: false,
  },
  {
    key: 'birthday' as const,
    href: null,
    bgClass: 'bg-birthday',
    active: false,
  },
]

export function BrandSelector() {
  const t = useTranslations()

  return (
    <section className="py-20 sm:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-block w-2 h-2 rounded-full bg-gold mb-4" />
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            {t('brandSelector.title')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('brandSelector.subtitle')}
          </p>
        </div>

        {/* Brand cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {brands.map((brand) => {
            const card = (
              <div
                key={brand.key}
                className={`relative rounded-2xl h-64 sm:h-72 flex flex-col items-center justify-center p-8 text-white overflow-hidden transition-all duration-300 ${
                  brand.active
                    ? `${brand.bgClass} hover:scale-[1.02] hover:shadow-2xl cursor-pointer`
                    : `${brand.bgClass} opacity-70 cursor-not-allowed`
                }`}
              >
                {/* Coming soon badge for inactive brands */}
                {!brand.active && (
                  <Badge
                    variant="secondary"
                    className="absolute top-4 start-4 bg-white/20 text-white border-0 text-xs"
                  >
                    {t(`brandSelector.${brand.key}.comingSoon`)}
                  </Badge>
                )}

                {/* Overlay for inactive brands */}
                {!brand.active && (
                  <div className="absolute inset-0 bg-black/40" />
                )}

                {/* Content */}
                <div className="relative z-10 text-center">
                  <h3 className="text-2xl font-bold mb-3">
                    {t(`brandSelector.${brand.key}.name`)}
                  </h3>
                  <p className="text-white/80 text-sm max-w-[200px]">
                    {t(`brandSelector.${brand.key}.desc`)}
                  </p>
                </div>
              </div>
            )

            if (brand.active && brand.href) {
              return (
                <Link key={brand.key} href={brand.href} className="block">
                  {card}
                </Link>
              )
            }

            return <div key={brand.key}>{card}</div>
          })}
        </div>
      </div>
    </section>
  )
}
