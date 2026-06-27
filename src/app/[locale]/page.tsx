import { Navbar } from '@/components/layout/navbar'
import { Hero } from '@/components/landing/hero'
import { BrandSelector } from '@/components/landing/brand-selector'
import { FeaturedProducts } from '@/components/landing/featured-products'
import { WhyUs } from '@/components/landing/why-us'
import { CTASection } from '@/components/landing/cta-section'
import { Footer } from '@/components/layout/footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <BrandSelector />
        <FeaturedProducts />
        <WhyUs />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
