import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/navbar'
import { Hero } from '@/components/landing/hero'
import { FeaturedProducts } from '@/components/landing/featured-products'
import { WhyUs } from '@/components/landing/why-us'
import { CTASection } from '@/components/landing/cta-section'
import { Footer } from '@/components/layout/footer'
import { JsonLd } from '@/components/seo/json-ld'
import { CustomCursor } from '@/components/ui-premium/custom-cursor'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata({
    locale: locale as 'ar' | 'en',
    path: '',
  })
}

const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Last Unique Touch',
  description: 'Luxury furniture and event equipment rental in Kuwait',
  url: 'https://lastuniquetouch.com',
  logo: 'https://lastuniquetouch.com/icon-192.png',
  sameAs: ['https://instagram.com/lastuniquetouch'],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+965-1234-5678',
    email: 'info@lastuniquetouch.com',
    contactType: 'customer service',
  },
}

export default function HomePage() {
  return (
    <div className="grain-overlay">
      <JsonLd data={organizationLd} />
      <CustomCursor />
      <Navbar />
      <main id="main-content">
        {/* Hero now includes the 3 brand selector cards — visible immediately, no scroll */}
        <Hero />
        <FeaturedProducts />
        <WhyUs />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
