'use client'

import { useState, useEffect } from 'react'

import { ArrowLeft, ArrowRight, ArrowDown } from 'lucide-react'
import { useRouter } from '@/i18n/routing'
import { useLocale, useTranslations } from 'next-intl'
import { LaLoungeLoadingScreen } from './loading-screen'
import PurpleWaves3D from './purple-waves-3d'

export default function LaLoungeView() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations()
  const ArrowIcon = locale === 'ar' ? ArrowRight : ArrowLeft
  const [loading, setLoading] = useState(true)

  const services = locale === 'ar' ? [
    {
      title: 'التخطيط والتجهيز',
      desc: 'تخطيط كامل للفعاليات من الفكرة إلى التنفيذ — تصاميم مبتكرة، إدارة موقع، وتنسيق متكامل',
      icon: '📋',
    },
    {
      title: 'توفير الأثاث',
      desc: 'تشكيلة واسعة من الأثاث الفاخر للفعاليات — كراسي، طاولات، أرائك، خيام، وأنظمة إضاءة',
      icon: '🪑',
    },
    {
      title: 'صنع أثاث مخصص',
      desc: 'تصميم وتصنيع أثاث مخصص حسب طلبك لفعالية معينة — قطع فريدة تعكس هوية مناسبتك',
      icon: '✨',
    },
  ] : [
    {
      title: 'Planning & Setup',
      desc: 'Complete event planning from concept to execution — innovative designs, site management, and full coordination',
      icon: '📋',
    },
    {
      title: 'Furniture Supply',
      desc: 'Wide range of luxury event furniture — chairs, tables, sofas, tents, and lighting systems',
      icon: '🪑',
    },
    {
      title: 'Custom Furniture Making',
      desc: 'Design and manufacture custom furniture tailored to your event — unique pieces that reflect your occasion',
      icon: '✨',
    },
  ]

  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="relative w-full bg-white">
      {loading && <LaLoungeLoadingScreen onComplete={() => setLoading(false)} />}
      {/* === Hero section — title centered, purple 3D background === */}
      <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        <PurpleWaves3D />

        {/* Back button */}
        <div className="absolute top-6 sm:top-10 start-6 sm:start-10 z-20">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/50 backdrop-blur-md border border-primary/10 shadow-sm hover:shadow-md text-primary transition-all font-medium text-xs cursor-pointer"
          >
            <ArrowIcon className="w-4 h-4" />
            <span className="font-sans font-medium tracking-wide">
              {locale === 'ar' ? 'العودة' : 'Back'}
            </span>
          </button>
        </div>

        {/* Centered title */}
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <div
            className="flex items-center gap-2 mb-4"
          >
            <span className="text-primary text-xs tracking-[0.3em] uppercase">
              {locale === 'ar' ? 'تجهيز الفعاليات' : 'Event Solutions'}
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
            {locale === 'ar'
              ? 'حلول متكاملة للفعاليات — من التخطيط إلى التنفيذ، مع أثاث فاخر وتصاميم مخصصة'
              : 'Complete event solutions — from planning to execution, with luxury furniture and custom designs'}
          </p>

          {/* Services button — scrolls to services section */}
          <button
            onClick={scrollToServices}
            className="px-10 py-3.5 bg-primary hover:bg-primary/90 text-white rounded-full font-sans tracking-wide text-sm font-medium shadow-[0_4px_20px_rgba(126,34,206,0.3)] hover:shadow-[0_6px_25px_rgba(126,34,206,0.4)] transition-all cursor-pointer border border-primary/30"
          >
            {locale === 'ar' ? 'الميزات والخدمات' : 'Features & Services'}
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
            {locale === 'ar' ? 'ما نقدمه' : 'What We Offer'}
          </h2>
          <p className="text-center text-primary/60 mb-12 max-w-xl mx-auto text-sm">
            {locale === 'ar'
              ? 'ثلاث خدمات متكاملة لتجهيز فعاليتك من الألف إلى الياء'
              : 'Three integrated services to prepare your event from A to Z'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur-md border border-primary/10 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-5xl mb-5">{service.icon}</div>
                <h3 className="font-serif text-xl text-primary mb-3">{service.title}</h3>
                <p className="text-sm text-primary/60 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <button
              onClick={() => router.push('/contact')}
              className="px-10 py-3.5 bg-primary hover:bg-primary/90 text-white rounded-full font-sans tracking-wide text-sm font-medium shadow-[0_4px_20px_rgba(126,34,206,0.3)] transition-all cursor-pointer"
            >
              {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
