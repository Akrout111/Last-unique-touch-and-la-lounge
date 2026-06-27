import type { Metadata } from 'next'
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
  return buildMetadata({
    locale: locale as 'ar' | 'en',
    path: '/cart',
    title: 'Cart',
    noIndex: true,
  })
}

export default function CartPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background" id="main-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <CartView />
        </div>
      </main>
      <Footer />
    </>
  )
}
