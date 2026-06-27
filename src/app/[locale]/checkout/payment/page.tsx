import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { PaymentView } from '@/components/checkout/payment-view'

interface PageProps {
  searchParams: Promise<{ order?: string }>
}

export default async function PaymentPage({ searchParams }: PageProps) {
  const { order } = await searchParams
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <PaymentView orderId={order} />
      </main>
      <Footer />
    </>
  )
}
