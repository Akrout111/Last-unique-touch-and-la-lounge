import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { SuccessView } from '@/components/checkout/success-view'

interface PageProps {
  searchParams: Promise<{ order?: string }>
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const { order } = await searchParams
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <SuccessView orderId={order} />
      </div>
      <Footer />
    </>
  )
}
