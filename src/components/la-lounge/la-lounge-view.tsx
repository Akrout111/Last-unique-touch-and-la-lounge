'use client'

import dynamic from 'next/dynamic'
import { ArrowLeft, ArrowRight, ArrowDown, ClipboardList, Armchair, Sparkles, type LucideIcon } from 'lucide-react'
import { useRouter } from '@/i18n/routing'
import { useLocale, useTranslations } from 'next-intl'
import { LaLoungeSunburst } from '@/components/brand/lalounge-sunburst'
import { LaLoungeLightSweep } from '@/components/brand/lalounge-light-sweep'

// Lazy-load the 3D purple waves scene so the page's initial JS bundle stays
// small (R3F + Three.js is ~150KB). ssr:false because WebGL only exists in
// the browser; the component itself guards on `shouldEnable3D()`.
const PurpleWaves3D = dynamic(() => import('./purple-waves-3d'), { ssr: false, loading: () => null })

export default function LaLoungeView() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations()
  const ArrowIcon = locale === 'ar' ? ArrowRight : ArrowLeft

  // V10 Fix #3: services array now uses i18n keys instead of inline ternaries.
  // The icon components are kept as code (they can't be i18n'd); only the
  // title/desc strings are translated.
  const services: Array<{ title: string; desc: string; icon: LucideIcon }> = [
    { title: t('laLounge.services.planning.title'), desc: t('laLounge.services.planning.desc'), icon: ClipboardList },
    { title: t('laLounge.services.furniture.title'), desc: t('laLounge.services.furniture.desc'), icon: Armchair },
    { title: t('laLounge.services.custom.title'), desc: t('laLounge.services.custom.desc'), icon: Sparkles },
  ]

  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="relative w-full bg-white">
      {/* === Hero section — title centered, purple 3D background === */}
      <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        <PurpleWaves3D />

        {/* La Lounge art-deco sunburst — static decorative halo behind the
            title. Phase 5 motion cleanup: dimmed from opacity-40 to opacity-20
            so it reads as a faint halo without competing with the LightSweep
            (which is the La Lounge signature motion). */}
        <LaLoungeSunburst className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 z-[2] w-[600px] h-[300px] opacity-20" />

        {/* La Lounge light sweep — subtle diagonal beam above hero content */}
        <LaLoungeLightSweep />

        {/* Back button */}
        <div className="absolute top-6 sm:top-10 start-6 sm:start-10 z-20">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/50 backdrop-blur-md border border-primary/10 shadow-sm hover:shadow-md text-primary transition-all font-medium text-xs cursor-pointer"
          >
            <ArrowIcon className="w-4 h-4" />
            <span className="font-sans font-medium tracking-wide">
              {t('laLounge.back')}
            </span>
          </button>
        </div>

        {/* Centered title */}
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <div
            className="flex items-center gap-2 mb-4"
          >
            <span className="text-primary text-xs tracking-[0.3em] uppercase">
              {t('laLounge.eyebrow')}
            </span>
          </div>

          <h1
            className="text-5xl sm:text-7xl md:text-8xl font-serif font-light text-primary tracking-widest drop-shadow-sm mb-4"
          >
            {t('brandSelector.lalounge.name')}
          </h1>

          <p
            className="text-sm sm:text-base text-primary/70 font-sans tracking-wide max-w-lg mb-8"
          >
            {t('laLounge.subtitle')}
          </p>

          {/* Services button — scrolls to services section */}
          <button
            onClick={scrollToServices}
            className="px-10 py-3.5 bg-primary hover:bg-primary/90 text-white rounded-full font-sans tracking-wide text-sm font-medium shadow-[0_4px_20px_rgba(255,20,147,0.3)] hover:shadow-[0_6px_25px_rgba(255,20,147,0.4)] transition-all cursor-pointer border border-primary/30"
          >
            {t('laLounge.featuresButton')}
          </button>
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-primary/60"
        >
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </div>
      </div>

      {/* === Services section — revealed on scroll === */}
      <div id="services" className="relative z-10 py-20 px-4 bg-primary/5">
        <div className="max-w-5xl mx-auto">
          <h2
            className="font-serif text-3xl sm:text-5xl text-primary text-center mb-4"
          >
            {t('laLounge.servicesTitle')}
          </h2>
          <p className="text-center text-primary/60 mb-12 max-w-xl mx-auto text-sm">
            {t('laLounge.servicesSubtitle')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, i) => {
              const Icon = service.icon
              return (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur-md border border-primary/10 rounded-lg p-8 text-center hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-center mb-5 text-primary">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="font-serif text-xl text-primary mb-3">{service.title}</h3>
                  <p className="text-sm text-primary/60 leading-relaxed">{service.desc}</p>
                </div>
              )
            })}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <button
              onClick={() => router.push('/contact')}
              className="px-10 py-3.5 bg-primary hover:bg-primary/90 text-white rounded-full font-sans tracking-wide text-sm font-medium shadow-[0_4px_20px_rgba(255,20,147,0.3)] transition-all cursor-pointer"
            >
              {t('laLounge.contactButton')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
