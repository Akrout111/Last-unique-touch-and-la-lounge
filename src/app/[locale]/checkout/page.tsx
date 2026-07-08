import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CheckoutView } from '@/components/checkout/checkout-view'

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <div className="bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <CheckoutView />
        </div>
      </div>
      <Footer />
    </>
  )
}
