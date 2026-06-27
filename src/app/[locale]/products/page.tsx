import { useTranslations } from 'next-intl'

export default function ProductsPage() {
  const t = useTranslations()

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4">{t('products.title')}</h1>
      <p className="text-muted-foreground">{t('products.comingPhase')}</p>
    </main>
  )
}
