import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'

export default function HomePage() {
  const t = useTranslations()

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center p-8">
      <h1
        className="text-4xl md:text-5xl font-bold mb-4"
        style={{ color: 'var(--c-accent-lut)' }}
      >
        {t('brand.lut')}
      </h1>
      <p className="text-lg text-muted-foreground mb-2">
        {t('landing.title')}
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        {t('common.phaseLabel', { phase: '1' })}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/products"
          className="px-6 py-3 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors text-center"
        >
          {t('nav.products')} ({t('common.comingSoon')})
        </Link>
        <Link
          href="/admin"
          className="px-6 py-3 rounded-lg border border-border text-foreground hover:bg-secondary transition-colors text-center"
        >
          {t('admin.title')} ({t('common.comingSoon')})
        </Link>
      </div>
    </main>
  )
}
