import { useTranslations } from 'next-intl'

export default function NotFound() {
  const t = useTranslations()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h2 className="text-5xl font-bold mb-4" style={{ color: 'var(--c-lut)' }}>404</h2>
      <p className="text-muted-foreground">{t('common.notFound')}</p>
    </div>
  )
}
