import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CartView } from '@/components/cart/cart-view'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as 'ar' | 'en' })
  return buildMetadata({
    locale: locale as 'ar' | 'en',
    path: '/cart',
    title: t('cart.title'),
    noIndex: true,
  })
}

export default function CartPage() {
  return (
    <>
      <Navbar />
      <div className="bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <CartView />
        </div>
      </div>
      <Footer />
    </>
  )
}
