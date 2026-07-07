import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/navbar'
import { Hero } from '@/components/landing/hero'
import { Footer } from '@/components/layout/footer'
import { JsonLd } from '@/components/seo/json-ld'
import { buildMetadata } from '@/lib/seo'
import { getPhoneNumber, isRealNumber } from '@/lib/contact-info'

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

/**
 * Organization JSON-LD for SEO. The `telephone` field is included ONLY when a
 * real phone number is configured via `NEXT_PUBLIC_PHONE_NUMBER` — otherwise
 * omitted entirely so we never publish the `965XXXXXXXX` placeholder to
 * search engines.
 */
function buildOrganizationLd(): Record<string, unknown> {
  const base: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Last Unique Touch',
    description: 'Luxury furniture and event equipment rental in Kuwait',
    url: 'https://lastuniquetouch.com',
    logo: 'https://lastuniquetouch.com/icon-192.png',
    sameAs: ['https://instagram.com/last.unique.touch'],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@lastuniquetouch.com',
      contactType: 'customer service',
    },
  }

  const phone = getPhoneNumber()
  if (isRealNumber(phone)) {
    const contactPoint = base.contactPoint as { '@type': string; email: string; contactType: string }
    base.contactPoint = {
      ...contactPoint,
      telephone: phone,
    }
  }

  return base
}

const organizationLd = buildOrganizationLd()

export default function HomePage() {
  return (
    <div className="grain-overlay">
      <JsonLd data={organizationLd} />
      {/* Phase 5 motion cleanup: <CustomCursor /> removed from home — it was
          visually competing with the holo-chamber card entrance animation.
          The component file is kept for future use on non-home routes. */}
      <Navbar />
      <div>
        {/* Landing page — 3 brand selector cards over the 3D furniture tunnel.
            Each card navigates to its own dedicated page. */}
        <Hero />
      </div>
      <Footer />
    </div>
  )
}
