import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useLocale } from 'next-intl'

export function CTASection() {
  const t = useTranslations()
  const locale = useLocale()
  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight

  return (
    <section className="relative py-20 sm:py-28 bg-bg-dark overflow-hidden">
      {/* Top gold line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gold/30" />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(230,33,41,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-5">
          {t('cta.title')}
        </h2>
        <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto">
          {t('cta.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-lut hover:bg-lut/90 text-white px-8 py-3 text-base font-semibold rounded-lg"
          >
            <Link href="/products">
              {t('cta.primary')}
              <ArrowIcon className="w-4 h-4 ms-2" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-gold/50 text-gold hover:bg-gold/10 px-8 py-3 text-base font-semibold rounded-lg"
          >
            <Link href="/contact">
              {t('cta.secondary')}
            </Link>
          </Button>
        </div>
      </div>

      {/* Bottom gold line */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gold/30" />
    </section>
  )
}
