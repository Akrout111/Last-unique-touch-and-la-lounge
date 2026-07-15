# Last Unique Touch — Frontend & UI/UX Code Collection
# Generated for AI analysis
# This file contains ALL frontend design files from the project

=== Adding globals.css ===

---


========================================
FILE: src/app/globals.css
========================================
```
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

/* ========================================
   LAST UNIQUE TOUCH — RED / BLACK / WHITE
   Brand palette matching LUT logo identity
   ======================================== */

:root {
  /* === Core Palette === */
  --c-ink: #0A0A0A;            /* Pure black — primary dark */
  --c-paper: #FFFFFF;          /* Pure white — primary light */
  --c-paper-warm: #F5F5F5;     /* Light gray */
  --c-paper-deep: #E8E8E8;     /* Slightly darker gray for cards */

  /* === Brand Accent (LUT Red) === */
  --c-gold: #E62129;           /* LUT brand red — replaces gold */
  --c-gold-soft: #FF3B3B;      /* Lighter red for hover states */
  --c-copper: #990000;         /* Deep dark red */

  /* === Expressive Accents === */
  --c-wine: #4A0000;           /* Very deep red */
  --c-lut: #E62129;            /* LUT brand red */
  --c-lalounge: #9D174D;       /* La Lounge — magenta */
  --c-birthday: #FFD700;       /* Your Birthday — gold */

  /* === Neutrals === */
  --c-taupe: #999999;          /* Neutral gray */
  --c-taupe-dark: #666666;     /* Darker gray */
  --c-stone: #444444;          /* Dark gray */
  --c-line: #E0E0E0;           /* Light gray hairline border */

  /* === shadcn tokens === */
  --radius: 0.375rem;
  --background: #FFFFFF;
  --foreground: #0A0A0A;
  --card: #FFFFFF;
  --card-foreground: #0A0A0A;
  --popover: #FFFFFF;
  --popover-foreground: #0A0A0A;
  --primary: #E62129;
  --primary-foreground: #FFFFFF;
  --secondary: #F5F5F5;
  --secondary-foreground: #0A0A0A;
  --muted: #F0F0F0;
  --muted-foreground: #666666;
  --accent: #E62129;
  --accent-foreground: #FFFFFF;
  --destructive: #DC2626;
  --border: #E0E0E0;
  --input: #E0E0E0;
  --ring: #E62129;
  --chart-1: #E62129;
  --chart-2: #0A0A0A;
  --chart-3: #9D174D;
  --chart-4: #FFD700;
  --chart-5: #999999;
  --sidebar: #F5F5F5;
  --sidebar-foreground: #0A0A0A;
  --sidebar-primary: #E62129;
  --sidebar-primary-foreground: #FFFFFF;
  --sidebar-accent: #E62129;
  --sidebar-accent-foreground: #FFFFFF;
  --sidebar-border: #E0E0E0;
  --sidebar-ring: #E62129;
}

.dark {
  --background: #0A0A0A;
  --foreground: #FFFFFF;
  --card: #1A1A1A;
  --card-foreground: #FFFFFF;
  --popover: #1A1A1A;
  --popover-foreground: #FFFFFF;
  --primary: #E62129;
  --primary-foreground: #FFFFFF;
  --secondary: #1A1A1A;
  --secondary-foreground: #FFFFFF;
  --muted: #1A1A1A;
  --muted-foreground: #999999;
  --accent: #E62129;
  --accent-foreground: #FFFFFF;
  --destructive: #DC2626;
  --border: #222222;
  --input: #222222;
  --ring: #E62129;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  /* LUT custom colors */
  --color-ink: #0A0A0A;
  --color-paper: #FFFFFF;
  --color-gold: #E62129;
  --color-copper: #990000;
  --color-wine: #4A0000;
  --color-lut: #E62129;
  --color-lalounge: #9D174D;
  --color-birthday: #FFD700;
  --color-taupe: #999999;

  --radius-sm: calc(var(--radius) - 2px);
  --radius-md: var(--radius);
  --radius-lg: calc(var(--radius) + 2px);
  --radius-xl: calc(var(--radius) + 6px);
}

@layer base {
  * {
    @apply border-border;
    box-sizing: border-box;
  }

  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
  }

  body {
    @apply bg-background text-foreground;
    margin: 0;
    padding: 0;
    font-family: var(--font-inter), system-ui, sans-serif;
    overflow-x: hidden;
  }

  html[dir="rtl"] body {
    font-family: var(--font-tajawal), system-ui, sans-serif;
  }

  html[dir="ltr"] body {
    font-family: var(--font-inter), var(--font-tajawal), system-ui, sans-serif;
  }

  /* Editorial serif for display headings */
  .font-display {
    font-family: var(--font-display), 'Tajawal', Georgia, serif;
    font-weight: 500;
    letter-spacing: -0.02em;
  }

  /* Tabular numerals for prices */
  .tabular-nums {
    font-variant-numeric: tabular-nums;
  }

  /* Eyebrow / label text */
  .eyebrow {
    font-family: var(--font-mono), 'Inter', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-weight: 500;
  }
}

/* ========================================
   ACCESSIBILITY
   ======================================== */

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

*:focus-visible {
  outline: 2px solid var(--c-lut);
  outline-offset: 3px;
  border-radius: 2px;
}

*:focus:not(:focus-visible) {
  outline: none;
}

/* ========================================
   FILM GRAIN OVERLAY (subtle texture)
   ======================================== */

.grain-overlay::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  mix-blend-mode: multiply;
}

/* ========================================
   PREMIUM UTILITY CLASSES
   ======================================== */

/* Glass morphism — only for overlay surfaces */
.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(230, 33, 41, 0.1);
}

.glass-dark {
  background: rgba(10, 10, 10, 0.6);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* Hairline borders */
.hairline {
  border: 1px solid var(--c-line);
}

.hairline-t {
  border-top: 1px solid var(--c-line);
}

.hairline-b {
  border-bottom: 1px solid var(--c-line);
}

/* Red gradient text (replaces gold gradient) */
.text-gold-gradient {
  background: linear-gradient(135deg, #E62129 0%, #FF3B3B 50%, #E62129 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Premium shadow */
.shadow-luxury {
  box-shadow: 0 30px 60px -20px rgba(10, 10, 10, 0.3),
              0 18px 36px -18px rgba(10, 10, 10, 0.15);
}

.shadow-gold {
  box-shadow: 0 20px 50px -15px rgba(230, 33, 41, 0.35);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--c-paper-warm);
}

::-webkit-scrollbar-thumb {
  background: var(--c-taupe);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--c-lut);
}

/* Selection */
::selection {
  background: var(--c-lut);
  color: var(--c-paper);
}

/* Hide scrollbar for horizontal scroll containers */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* ========================================
   ANIMATION KEYFRAMES
   ======================================== */

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(2deg); }
}

@keyframes pulse-gold {
  0%, 100% { box-shadow: 0 0 0 0 rgba(230, 33, 41, 0.3); }
  50% { box-shadow: 0 0 0 8px rgba(230, 33, 41, 0); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-pulse-gold {
  animation: pulse-gold 2s ease-in-out infinite;
}

/* Marquee */
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  animation: marquee 30s linear infinite;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

```


========================================
FILE: src/app/fonts.ts
========================================
```
import { Inter, Tajawal, Cormorant_Garamond, DM_Mono } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const tajawal = Tajawal({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-tajawal',
  weight: ['300', '400', '500', '700', '900'],
})

export const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

export const dmMono = DM_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500'],
})

```


========================================
FILE: src/app/[locale]/layout.tsx
========================================
```
import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { CartProvider } from '@/components/providers/cart-provider'
import { ToastProvider } from '@/components/providers/toast-provider'
import { inter, tajawal, cormorant, dmMono } from '@/app/fonts'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  return {
    title: {
      default: 'Last Unique Touch',
      template: `%s | Last Unique Touch`,
    },
    description: t('brand.lut'),
    manifest: '/manifest.json',
    icons: {
      icon: '/icon-192.png',
      apple: '/icon-192.png',
    },
  }
}

export const viewport: Viewport = {
  themeColor: '#E62129',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return (
    <html
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      className={`${inter.variable} ${tajawal.variable} ${cormorant.variable} ${dmMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#E62129" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <NextIntlClientProvider>
          <CartProvider>
            <ToastProvider>{children}</ToastProvider>
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

```


========================================
FILE: src/app/[locale]/page.tsx
========================================
```
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

```


========================================
FILE: src/components/landing/hero.tsx
========================================
```
'use client'

import { useRef, useState, Suspense } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react'
import { WaveBackground } from './wave-background'

interface Brand {
  key: 'lut' | 'lalounge' | 'birthday'
  image: string
  logo: string
  accent: string
  active: boolean
  tag: string
}

const brands: Brand[] = [
  {
    key: 'lut',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=85',
    logo: '/logo-lut.jpg',
    accent: '#E62129',
    active: true,
    tag: 'HERITAGE',
  },
  {
    key: 'lalounge',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1600&q=85',
    logo: '/logo-lalounge.jpg',
    accent: '#9D174D',
    active: false,
    tag: 'MODERN',
  },
  {
    key: 'birthday',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1600&q=85',
    logo: '/logo-birthday.jpg',
    accent: '#FFD700',
    active: false,
    tag: 'ATELIER',
  },
]

export function Hero() {
  const t = useTranslations()
  const locale = useLocale()
  const ref = useRef<HTMLElement>(null)
  const [hoveredBrand, setHoveredBrand] = useState<number | null>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full overflow-hidden bg-paper flex flex-col"
    >
      {/* === 3D Wave Background (red & black lines on white) === */}
      <Suspense fallback={null}>
        <WaveBackground />
      </Suspense>

      {/* Red gradient glow overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 30% 20%, rgba(230, 33, 41, 0.06) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 70% 80%, rgba(230, 33, 41, 0.04) 0%, transparent 50%), linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.3) 80%, rgba(255, 255, 255, 0.6) 100%)',
        }}
      />

      {/* === Top: Brand logo + tagline === */}
      <motion.div
        style={{ opacity }}
        className="relative z-30 pt-20 sm:pt-24 pb-4 sm:pb-6 text-center px-4 shrink-0"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="flex items-center justify-center gap-2 sm:gap-3 mb-3"
        >
          <span className="w-6 sm:w-8 h-px bg-lut/50" />
          <span className="eyebrow text-lut text-[10px] sm:text-xs">
            {locale === 'ar' ? 'منصة تأجير فاخرة · الكويت' : 'Luxury Rental Platform · Kuwait'}
          </span>
          <span className="w-6 sm:w-8 h-px bg-lut/50" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="font-display text-2xl sm:text-4xl md:text-5xl text-ink"
        >
          {t('brand.lut')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-xs sm:text-sm text-taupe mt-2"
        >
          {locale === 'ar' ? 'اختر تجربتك' : 'Choose Your Experience'}
        </motion.p>
      </motion.div>

      {/* === Middle: Brand cards (responsive) === */}
      <div className="relative z-20 flex-1 flex items-center px-4 sm:px-6 lg:px-8 py-4">
        <div className="w-full max-w-7xl mx-auto">
          {/* Desktop: 3-column triptych */}
          <div className="hidden md:grid md:grid-cols-3 gap-4 lg:gap-6 h-[55vh] min-h-[380px]">
            {brands.map((brand, idx) => (
              <motion.div
                key={brand.key}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.6 + idx * 0.12,
                }}
                onMouseEnter={() => setHoveredBrand(idx)}
                onMouseLeave={() => setHoveredBrand(null)}
                className="group relative overflow-hidden cursor-pointer"
                style={{ borderRadius: '2px' }}
              >
                {/* Background image */}
                <div className="absolute inset-0">
                  <motion.div
                    animate={{ scale: hoveredBrand === idx ? 1.1 : 1 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={brand.image}
                      alt={t(`brandSelector.${brand.key}.name`)}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>

                {/* Gradient overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{
                    background: hoveredBrand === idx
                      ? 'linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.3) 60%, rgba(255,255,255,0.1) 100%)'
                      : 'linear-gradient(to top, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.2) 100%)',
                  }}
                />

                {/* Inactive overlay */}
                {!brand.active && (
                  <div className="absolute inset-0 bg-paper/40" />
                )}

                {/* Accent top line */}
                <div
                  className="absolute top-0 inset-x-0 h-1 transition-opacity duration-500"
                  style={{
                    backgroundColor: brand.accent,
                    opacity: hoveredBrand === idx ? 1 : 0.3,
                  }}
                />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
                  {/* Brand logo */}
                  <div className="mb-4 transition-all duration-300">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={brand.logo}
                      alt={t(`brandSelector.${brand.key}.name`)}
                      className="h-14 w-auto object-contain rounded-sm"
                      style={{
                        opacity: hoveredBrand === idx ? 1 : 0.7,
                        filter: hoveredBrand === idx ? `drop-shadow(0 0 8px ${brand.accent}40)` : 'none',
                      }}
                    />
                  </div>

                  {/* Tag */}
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="w-2 h-2 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: brand.accent,
                        transform: hoveredBrand === idx ? 'scale(1.5)' : 'scale(1)',
                      }}
                    />
                    <span
                      className="eyebrow transition-colors duration-300"
                      style={{ color: hoveredBrand === idx ? brand.accent : 'rgba(10, 10, 10, 0.4)' }}
                    >
                      {brand.tag}
                    </span>
                  </div>

                  {/* Brand name */}
                  <h2
                    className="font-display text-2xl sm:text-3xl lg:text-4xl text-ink leading-tight mb-2 transition-all duration-300"
                    style={{
                      transform: hoveredBrand === idx ? 'translateY(-4px)' : 'translateY(0)',
                    }}
                  >
                    {t(`brandSelector.${brand.key}.name`)}
                  </h2>

                  {/* Description */}
                  <p
                    className="text-sm text-taupe leading-relaxed mb-4 transition-all duration-300 overflow-hidden max-w-xs"
                    style={{
                      maxHeight: hoveredBrand === idx ? '60px' : '40px',
                      opacity: hoveredBrand === idx ? 1 : 0.6,
                    }}
                  >
                    {t(`brandSelector.${brand.key}.desc`)}
                  </p>

                  {/* CTA / Badge */}
                  <div className="flex items-center gap-2">
                    {brand.active ? (
                      <span
                        className="inline-flex items-center gap-2 text-sm font-medium transition-all duration-300 group-hover:gap-3"
                        style={{ color: brand.accent }}
                      >
                        <span className="eyebrow">
                          {locale === 'ar' ? 'استكشف' : 'Explore'}
                        </span>
                        <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-taupe/60">
                        <Plus className="w-4 h-4" />
                        <span className="eyebrow">
                          {t(`brandSelector.${brand.key}.comingSoon`)}
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Underline */}
                  <div
                    className="h-px mt-4 transition-all duration-500"
                    style={{
                      backgroundColor: brand.accent,
                      width: hoveredBrand === idx ? '100%' : '40px',
                      opacity: hoveredBrand === idx ? 1 : 0.4,
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile: Stacked cards */}
          <div className="md:hidden space-y-4">
            {brands.map((brand, idx) => {
              const card = (
                <motion.div
                  key={brand.key}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.4 + idx * 0.1,
                  }}
                  className="group relative overflow-hidden cursor-pointer"
                  style={{ borderRadius: '2px', minHeight: '180px' }}
                >
                  {/* Background image */}
                  <div className="absolute inset-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={brand.image}
                      alt={t(`brandSelector.${brand.key}.name`)}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* White gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.2) 100%)',
                    }}
                  />

                  {/* Inactive overlay */}
                  {!brand.active && (
                    <div className="absolute inset-0 bg-paper/30" />
                  )}

                  {/* Accent top line */}
                  <div
                    className="absolute top-0 inset-x-0 h-1"
                    style={{ backgroundColor: brand.accent }}
                  />

                  {/* Content */}
                  <div className="relative p-5 pt-14 flex flex-col justify-end min-h-[180px]">
                    {/* Brand logo */}
                    <div className="mb-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={brand.logo}
                        alt={t(`brandSelector.${brand.key}.name`)}
                        className="h-10 w-auto object-contain rounded-sm"
                      />
                    </div>

                    {/* Tag */}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: brand.accent }}
                      />
                      <span className="eyebrow text-[10px]" style={{ color: brand.accent }}>
                        {brand.tag}
                      </span>
                    </div>

                    {/* Brand name */}
                    <h2 className="font-display text-2xl text-ink leading-tight mb-1">
                      {t(`brandSelector.${brand.key}.name`)}
                    </h2>

                    {/* Description */}
                    <p className="text-xs text-taupe leading-relaxed mb-3">
                      {t(`brandSelector.${brand.key}.desc`)}
                    </p>

                    {/* CTA / Badge */}
                    <div className="flex items-center gap-2">
                      {brand.active ? (
                        <span
                          className="inline-flex items-center gap-2 text-sm font-medium"
                          style={{ color: brand.accent }}
                        >
                          <span className="eyebrow text-[10px]">
                            {locale === 'ar' ? 'استكشف' : 'Explore'}
                          </span>
                          <ArrowIcon className="w-3 h-3" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-taupe/60">
                          <Plus className="w-3 h-3" />
                          <span className="eyebrow text-[10px]">
                            {t(`brandSelector.${brand.key}.comingSoon`)}
                          </span>
                        </span>
                      )}
                    </div>

                    {/* Underline */}
                    <div
                      className="h-px mt-3"
                      style={{
                        backgroundColor: brand.accent,
                        width: '40px',
                        opacity: 0.6,
                      }}
                    />
                  </div>
                </motion.div>
              )

              if (brand.active) {
                return (
                  <Link key={brand.key} href="/products">
                    {card}
                  </Link>
                )
              }
              return <div key={brand.key}>{card}</div>
            })}
          </div>
        </div>
      </div>

      {/* === Bottom: Stats bar === */}
      <motion.div
        style={{ opacity }}
        className="relative z-30 pb-6 sm:pb-8 px-4 shrink-0"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-6 sm:gap-16">
            {[
              { value: '500+', label: locale === 'ar' ? 'منتج فاخر' : 'Luxury Items' },
              { value: '2000+', label: locale === 'ar' ? 'حدث ناجح' : 'Events' },
              { value: '5', label: locale === 'ar' ? 'سنوات خبرة' : 'Years' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 + i * 0.1 }}
                className="text-center"
              >
                <div className="font-display text-xl sm:text-3xl text-lut tabular-nums">
                  {stat.value}
                </div>
                <div className="eyebrow text-taupe/50 mt-1 text-[9px] sm:text-[10px]">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

```


========================================
FILE: src/components/landing/wave-background.tsx
========================================
```
'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

/**
 * A flowing 3D ribbon/line wave background.
 * Red and black lines undulate in 3D space on a white background.
 */
function WaveLines() {
  const groupRef = useRef<THREE.Group>(null)

  const lines = useMemo(() => {
    const lineCount = 24
    const pointsPerLine = 80
    const spacing = 0.4

    const items: { positions: Float32Array; color: THREE.Color; offset: number; speed: number; amplitude: number }[] = []

    for (let i = 0; i < lineCount; i++) {
      const positions = new Float32Array(pointsPerLine * 3)
      const t = i / lineCount

      // Alternate red and black
      const isRed = i % 2 === 0
      const color = isRed
        ? new THREE.Color('#E62129').multiplyScalar(0.4 + Math.random() * 0.4)
        : new THREE.Color('#0A0A0A').multiplyScalar(0.1 + Math.random() * 0.15)

      items.push({
        positions,
        color,
        offset: i * 0.3 + Math.random() * 2,
        speed: 0.5 + Math.random() * 0.5,
        amplitude: 0.5 + Math.random() * 1.5,
      })
    }

    return items
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.getElapsedTime()

    groupRef.current.children.forEach((child, idx) => {
      const line = lines[idx]
      if (!line) return

      const geometry = child as THREE.Line
      const positions = geometry.geometry.attributes.position.array as Float32Array
      const pointsPerLine = positions.length / 3

      for (let j = 0; j < pointsPerLine; j++) {
        const x = (j / (pointsPerLine - 1) - 0.5) * 24
        const wave1 = Math.sin(x * 0.3 + time * line.speed + line.offset) * line.amplitude
        const wave2 = Math.sin(x * 0.15 + time * line.speed * 0.7 + line.offset * 1.5) * line.amplitude * 0.5
        const wave3 = Math.cos(x * 0.2 + time * line.speed * 0.5) * line.amplitude * 0.3

        positions[j * 3] = x
        positions[j * 3 + 1] = wave1 + wave2 + wave3
        positions[j * 3 + 2] = (idx - lines.length / 2) * 0.4
      }

      geometry.geometry.attributes.position.needsUpdate = true
    })
  })

  return (
    <group ref={groupRef} rotation={[Math.PI * 0.15, 0, 0]} position={[0, -1, 0]}>
      {lines.map((line, idx) => (
        <line key={idx}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={line.positions.length / 3}
              array={line.positions}
              itemSize={3}
              args={[line.positions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={line.color}
            transparent
            opacity={0.5}
            linewidth={1}
          />
        </line>
      ))}
    </group>
  )
}

function Particles() {
  const pointsRef = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const count = 60
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    return arr
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const time = state.clock.getElapsedTime()
    pointsRef.current.rotation.y = time * 0.05
    pointsRef.current.position.y = Math.sin(time * 0.3) * 0.5
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#E62129"
        size={0.06}
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  )
}

export function WaveBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[5, 5, 5]} intensity={0.4} color="#E62129" />
        <pointLight position={[-5, -3, 2]} intensity={0.2} color="#0A0A0A" />

        <WaveLines />
        <Particles />
      </Canvas>
    </div>
  )
}

```


========================================
FILE: src/components/landing/brand-selector.tsx
========================================
```
'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import { ArrowRight, ArrowLeft, Plus } from 'lucide-react'
import { TiltCard } from '@/components/ui-premium/tilt-card'

const brands = [
  {
    key: 'lut' as const,
    href: '/products',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80',
    accent: 'var(--c-lut)',
    active: true,
    tag: 'HERITAGE',
  },
  {
    key: 'lalounge' as const,
    href: null,
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1200&q=80',
    accent: 'var(--c-lalounge)',
    active: false,
    tag: 'MODERN',
  },
  {
    key: 'birthday' as const,
    href: null,
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=80',
    accent: 'var(--c-birthday)',
    active: false,
    tag: 'ATELIER',
  },
]

export function BrandSelector() {
  const t = useTranslations()
  const locale = useLocale()
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const headerY = useTransform(scrollYProgress, [0, 0.3], [40, 0])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])

  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight

  return (
    <section ref={ref} className="relative py-32 bg-paper overflow-hidden">
      {/* Section header */}
      <motion.div
        style={{ y: headerY, opacity: headerOpacity }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="w-8 h-px bg-gold" />
          <span className="eyebrow text-gold">
            {locale === 'ar' ? 'ثلاث علامات · رحلة واحدة' : 'Three Brands · One Journey'}
          </span>
          <span className="w-8 h-px bg-gold" />
        </div>
        <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-ink leading-tight max-w-3xl mx-auto">
          {t('brandSelector.title')}
        </h2>
        <p className="text-stone text-lg mt-4 max-w-xl mx-auto">
          {t('brandSelector.subtitle')}
        </p>
      </motion.div>

      {/* Brand cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {brands.map((brand, idx) => {
            const card = (
              <motion.div
                key={brand.key}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                  delay: idx * 0.12,
                }}
              >
                <TiltCard
                  maxTilt={brand.active ? 6 : 4}
                  glare={brand.active}
                  className="h-[70vh] min-h-[500px] cursor-pointer group"
                >
                  <div
                    className="relative h-full w-full overflow-hidden"
                    style={{
                      borderRadius: '2px',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* Background image */}
                    <div className="absolute inset-0 overflow-hidden">
                      <img
                        src={brand.image}
                        alt={t(`brandSelector.${brand.key}.name`)}
                        className={`w-full h-full object-cover transition-transform duration-700 ${
                          brand.active ? 'group-hover:scale-110' : ''
                        }`}
                      />
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-ink/20" />
                      {/* Inactive overlay */}
                      {!brand.active && (
                        <div className="absolute inset-0 bg-ink/50" />
                      )}
                    </div>

                    {/* Accent line at top */}
                    <div
                      className="absolute top-0 inset-x-0 h-1"
                      style={{ backgroundColor: brand.accent }}
                    />

                    {/* Tag */}
                    <div className="absolute top-6 start-6 z-10">
                      <span
                        className="eyebrow text-paper px-3 py-1.5"
                        style={{
                          backgroundColor: 'rgba(14, 13, 11, 0.6)',
                          backdropFilter: 'blur(10px)',
                          color: brand.accent,
                        }}
                      >
                        {brand.tag}
                      </span>
                    </div>

                    {/* Coming soon badge */}
                    {!brand.active && (
                      <div className="absolute top-6 end-6 z-10">
                        <span className="eyebrow text-paper/60 px-3 py-1.5 border border-paper/20 bg-ink/40 backdrop-blur-sm">
                          {t(`brandSelector.${brand.key}.comingSoon`)}
                        </span>
                      </div>
                    )}

                    {/* Content */}
                    <div
                      className="absolute bottom-0 inset-x-0 p-8 z-10"
                      style={{ transform: 'translateZ(40px)' }}
                    >
                      {/* Accent dot */}
                      <div
                        className="w-3 h-3 rounded-full mb-4"
                        style={{ backgroundColor: brand.accent }}
                      />

                      <h3 className="font-display text-3xl sm:text-4xl text-paper mb-3">
                        {t(`brandSelector.${brand.key}.name`)}
                      </h3>

                      <p className="text-paper/60 text-sm leading-relaxed mb-6 max-w-xs">
                        {t(`brandSelector.${brand.key}.desc`)}
                      </p>

                      {brand.active ? (
                        <div className="flex items-center gap-2 text-paper group-hover:gap-4 transition-all duration-300">
                          <span className="eyebrow" style={{ color: brand.accent }}>
                            {locale === 'ar' ? 'استكشف' : 'Explore'}
                          </span>
                          <ArrowIcon className="w-4 h-4" style={{ color: brand.accent }} />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-paper/40">
                          <Plus className="w-4 h-4" />
                          <span className="eyebrow">
                            {locale === 'ar' ? 'قريباً' : 'Coming Soon'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            )

            if (brand.active && brand.href) {
              return (
                <Link key={brand.key} href={brand.href} className="block">
                  {card}
                </Link>
              )
            }
            return <div key={brand.key}>{card}</div>
          })}
        </div>
      </div>
    </section>
  )
}

```


========================================
FILE: src/components/landing/featured-products.tsx
========================================
```
import { getFeaturedProducts } from '@/lib/products'
import { FeaturedProductsClient } from './featured-products-client'

export async function FeaturedProducts() {
  const products = await getFeaturedProducts(4)
  return <FeaturedProductsClient products={products} />
}

```


========================================
FILE: src/components/landing/featured-products-client.tsx
========================================
```
'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { TiltCard } from '@/components/ui-premium/tilt-card'
import { localizedName } from '@/lib/products'
import type { ProductWithImages } from '@/lib/products'

export function FeaturedProductsClient({ products }: { products: ProductWithImages[] }) {
  const t = useTranslations()
  const locale = useLocale()
  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight

  return (
    <section className="relative py-32 bg-paper overflow-hidden">
      {/* Subtle dark texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'url(/section-bg-light.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Red accent glow */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(135deg, #E62129 0%, transparent 50%, #0A0A0A 100%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-16"
        >
          <div className="md:col-span-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-gold" />
              <span className="eyebrow text-gold">
                {locale === 'ar' ? 'مختارات لهذا الموسم' : 'Curated For This Season'}
              </span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-ink leading-tight">
              {t('featured.title')}
            </h2>
            <p className="text-stone text-base mt-4 max-w-lg">
              {locale === 'ar'
                ? 'قطع مختارة بعناية لإضافة لمسة فاخرة إلى مناسباتك'
                : 'Carefully selected pieces to add a luxurious touch to your events'}
            </p>
          </div>
          <div className="md:col-span-4 text-start md:text-end">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-ink hover:text-gold transition-colors duration-300 group"
            >
              <span className="eyebrow">{t('featured.viewAll')}</span>
              <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, idx) => {
            const firstImage = product.images[0]
            const secondImage = product.images[1] ?? product.images[0]
            const productName = localizedName(product.nameAr, product.nameEn, locale)
            const categoryName = localizedName(
              product.category.nameAr,
              product.category.nameEn,
              locale
            )

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                  delay: idx * 0.1,
                }}
              >
                <Link href={`/products/${product.slug}`} className="group block">
                  <TiltCard maxTilt={5} className="cursor-pointer">
                    <div
                      className="relative overflow-hidden bg-paper-deep"
                      style={{ borderRadius: '2px', transformStyle: 'preserve-3d' }}
                    >
                      {/* Image container — portrait aspect for furniture */}
                      <div className="relative aspect-[4/5] overflow-hidden">
                        {firstImage ? (
                          <>
                            <Image
                              src={firstImage}
                              alt={productName}
                              fill
                              className="object-cover transition-opacity duration-700 group-hover:opacity-0"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                            {secondImage !== firstImage && (
                              <Image
                                src={secondImage}
                                alt={productName}
                                fill
                                className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100 scale-105"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                              />
                            )}
                          </>
                        ) : (
                          <div className="w-full h-full bg-muted" />
                        )}

                        {/* Gradient at bottom for text legibility */}
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/40 to-transparent pointer-events-none" />

                        {/* 3D badge */}
                        {product.model3dUrl && (
                          <div
                            className="absolute top-3 end-3 px-2 py-1 bg-gold text-ink eyebrow z-10"
                            style={{ transform: 'translateZ(30px)' }}
                          >
                            3D
                          </div>
                        )}

                        {/* Out of stock */}
                        {product.stock === 0 && (
                          <div className="absolute inset-0 bg-ink/60 flex items-center justify-center z-10">
                            <span className="eyebrow text-paper border border-paper/30 px-4 py-2">
                              {t('products.outOfStock')}
                            </span>
                          </div>
                        )}

                        {/* Price chip — furniture style with /day */}
                        <div
                          className="absolute bottom-3 end-3 glass px-3 py-2 z-10"
                          style={{ transform: 'translateZ(30px)' }}
                        >
                          <div className="flex items-baseline gap-1">
                            <span className="font-display text-lg text-ink tabular-nums">
                              {product.rentalPricePerDay.toFixed(3)}
                            </span>
                            <span className="font-mono text-[10px] text-stone">KWD/day</span>
                          </div>
                        </div>

                        {/* Category label top-start */}
                        <div
                          className="absolute top-3 start-3 z-10"
                          style={{ transform: 'translateZ(20px)' }}
                        >
                          <span className="eyebrow text-paper/80 bg-ink/40 backdrop-blur-sm px-2 py-1">
                            {categoryName}
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div
                        className="p-5 bg-paper group-hover:bg-paper-warm transition-colors duration-500"
                        style={{ transform: 'translateZ(20px)' }}
                      >
                        <h3 className="font-display text-xl text-ink mb-1 line-clamp-1">
                          {productName}
                        </h3>
                        <div className="flex items-center justify-between mt-3">
                          <div className="w-8 h-px bg-gold group-hover:w-16 transition-all duration-500" />
                          <span className="eyebrow text-taupe opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            {locale === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Mobile view all */}
        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-ink"
          >
            <span className="eyebrow">{t('featured.viewAll')}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

```


========================================
FILE: src/components/landing/why-us.tsx
========================================
```
'use client'

import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { Armchair, CalendarDays, Truck, Box } from 'lucide-react'

const features = [
  { key: 'luxury' as const, icon: Armchair },
  { key: 'flexible' as const, icon: CalendarDays },
  { key: 'delivery' as const, icon: Truck },
  { key: '3d' as const, icon: Box },
]

export function WhyUs() {
  const t = useTranslations()
  const locale = useLocale()

  return (
    <section className="relative py-32 bg-ink overflow-hidden">
      {/* Dark texture background */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: 'url(/section-bg-dark.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Red ambient glow */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(230, 33, 41, 0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-8 h-px bg-gold" />
            <span className="eyebrow text-gold">
              {locale === 'ar' ? 'لماذا نحن' : 'Why Us'}
            </span>
            <span className="w-8 h-px bg-gold" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-paper max-w-3xl mx-auto leading-tight">
            {t('whyUs.title')}
          </h2>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-paper/10">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                  delay: idx * 0.1,
                }}
                className="group relative bg-ink p-10 hover:bg-stone/10 transition-colors duration-500 cursor-default"
              >
                {/* Number */}
                <span className="absolute top-6 end-6 font-mono text-xs text-paper/20 tabular-nums">
                  0{idx + 1}
                </span>

                {/* Icon */}
                <div className="w-14 h-14 mb-8 flex items-center justify-center border border-gold/30 hover:border-gold transition-colors duration-500">
                  <Icon className="w-6 h-6 text-gold" strokeWidth={1.2} />
                </div>

                {/* Content */}
                <h3 className="font-display text-2xl text-paper mb-3">
                  {t(`whyUs.items.${feature.key}.title`)}
                </h3>
                <p className="text-paper/40 text-sm leading-relaxed">
                  {t(`whyUs.items.${feature.key}.desc`)}
                </p>

                {/* Gold underline that grows on hover */}
                <div className="w-8 h-px bg-gold mt-6 group-hover:w-full transition-all duration-700" />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

```


========================================
FILE: src/components/landing/cta-section.tsx
========================================
```
'use client'

import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { MagneticButton } from '@/components/ui-premium/magnetic-button'

export function CTASection() {
  const t = useTranslations()
  const locale = useLocale()
  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight

  return (
    <section className="relative py-40 bg-ink overflow-hidden">
      {/* Dark texture background */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: 'url(/section-bg-dark.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Radial red glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(230, 33, 41, 0.12) 0%, transparent 70%)',
        }}
      />

      {/* Top hairline */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="w-8 h-px bg-gold" />
            <span className="eyebrow text-gold">
              {locale === 'ar' ? 'ابدأ الآن' : 'Get Started'}
            </span>
            <span className="w-8 h-px bg-gold" />
          </div>

          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-paper leading-tight mb-8">
            {t('cta.title')}
          </h2>

          <p className="text-lg text-paper/50 max-w-xl mx-auto mb-12">
            {t('cta.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <MagneticButton href={`/${locale}/products`}>
              <span className="group inline-flex items-center gap-3 px-10 py-4 bg-lut text-paper rounded-none hover:bg-lut/90 transition-colors duration-300">
                <span className="text-sm font-medium tracking-wide">
                  {t('cta.primary')}
                </span>
                <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </span>
            </MagneticButton>

            <MagneticButton href={`/${locale}/contact`}>
              <span className="group inline-flex items-center gap-3 px-10 py-4 border border-gold/40 text-gold hover:bg-gold/10 transition-colors duration-300">
                <span className="text-sm font-medium tracking-wide">
                  {t('cta.secondary')}
                </span>
              </span>
            </MagneticButton>
          </div>
        </motion.div>
      </div>

      {/* Bottom hairline */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  )
}

```


========================================
FILE: src/components/landing/product-card.tsx
========================================
```
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Badge } from '@/components/ui/badge'
import { localizedName } from '@/lib/products'
import type { ProductWithImages } from '@/lib/products'

export function ProductCard({ product }: { product: ProductWithImages }) {
  const t = useTranslations()
  const locale = useLocale()

  const firstImage = product.images[0]
  const productName = localizedName(product.nameAr, product.nameEn, locale)
  const categoryName = localizedName(
    product.category.nameAr,
    product.category.nameEn,
    locale
  )
  const isOutOfStock = product.stock === 0

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block"
    >
      <div className="rounded-xl overflow-hidden bg-card border border-border transition-shadow hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          {firstImage ? (
            <Image
              src={firstImage}
              alt={productName}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
              {t('common.noImage')}
            </div>
          )}

          {/* Category badge (top-start) */}
          <Badge
            variant="outline"
            className="absolute top-2 start-2 bg-white/80 backdrop-blur-sm text-foreground border-white/60 text-xs"
          >
            {categoryName}
          </Badge>

          {/* 3D badge (top-end) */}
          {product.model3dUrl && (
            <Badge className="absolute top-2 end-2 bg-lut text-white text-xs border-0">
              3D
            </Badge>
          )}

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="px-3 py-1.5 rounded-full bg-white/95 text-foreground text-xs font-semibold">
                {t('products.outOfStock')}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-muted-foreground mb-1">
            {categoryName}
          </p>
          <h3 className="font-semibold text-foreground mb-2 line-clamp-1">
            {productName}
          </h3>
          <p className={`font-bold text-sm ${isOutOfStock ? 'text-muted-foreground' : 'text-lut'}`}>
            {product.rentalPricePerDay} {t('featured.perDay')}
          </p>
        </div>
      </div>
    </Link>
  )
}

```


========================================
FILE: src/components/layout/navbar.tsx
========================================
```
'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/routing'
import { Menu, X, Globe, ShoppingCart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/components/providers/cart-provider'
import { MagneticButton } from '@/components/ui-premium/magnetic-button'

export function Navbar() {
  const t = useTranslations()
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { count, hydrated } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const switchLocale = () => {
    const next = locale === 'ar' ? 'en' : 'ar'
    router.replace(pathname, { locale: next })
  }

  const navLinks = [
    { href: '/' as const, label: t('nav.home') },
    { href: '/products' as const, label: t('nav.products') },
    { href: '/about' as const, label: t('nav.about') },
    { href: '/contact' as const, label: t('nav.contact') },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass-dark py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <span className={`font-display text-2xl font-semibold transition-colors ${
                scrolled ? 'text-paper' : 'text-paper'
              }`}>
                {t('brand.lut')}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold group-hover:scale-150 transition-transform duration-300" />
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium tracking-wide transition-colors duration-300 group ${
                    pathname === link.href
                      ? 'text-gold'
                      : scrolled ? 'text-paper/70 hover:text-paper' : 'text-paper/70 hover:text-paper'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px bg-gold transition-all duration-300 ${
                      pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Cart */}
              <Link
                href="/cart"
                className={`relative p-2 transition-colors ${
                  scrolled ? 'text-paper/70 hover:text-gold' : 'text-paper/70 hover:text-gold'
                }`}
                aria-label="Cart"
              >
                <ShoppingCart className="w-5 h-5" strokeWidth={1.3} />
                {hydrated && count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -end-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded-full bg-lut text-paper text-[10px] font-bold tabular-nums"
                  >
                    {count}
                  </motion.span>
                )}
              </Link>

              {/* Language switcher */}
              <MagneticButton strength={0.2}>
                <button
                  onClick={switchLocale}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${
                    scrolled
                      ? 'text-paper/70 hover:text-gold'
                      : 'text-paper/70 hover:text-gold'
                  }`}
                >
                  <Globe className="w-4 h-4" strokeWidth={1.3} />
                  <span>{locale === 'ar' ? 'EN' : 'عربي'}</span>
                </button>
              </MagneticButton>

              {/* Mobile menu button */}
              <button
                className="md:hidden text-paper p-2"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-ink/80 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 end-0 bottom-0 z-50 w-80 max-w-[85vw] bg-ink md:hidden flex flex-col"
            >
              <div className="p-6 border-b border-paper/10 flex items-center justify-between">
                <span className="font-display text-xl text-paper">
                  {t('brand.lut')}
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-paper/60 hover:text-paper"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 p-6 space-y-2">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block py-3 text-lg font-display ${
                        pathname === link.href ? 'text-gold' : 'text-paper/70'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

```


========================================
FILE: src/components/layout/footer.tsx
========================================
```
'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Instagram, Phone } from 'lucide-react'

export function Footer() {
  const t = useTranslations()
  const locale = useLocale()

  return (
    <footer className="bg-ink text-paper/60 relative overflow-hidden">
      {/* Gold hairline at top */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 mb-6">
              <span className="font-display text-3xl text-paper">
                {t('brand.lut')}
              </span>
              <span className="w-2 h-2 rounded-full bg-gold" />
            </div>
            <p className="text-sm leading-relaxed mb-8 max-w-sm">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-paper/20 hover:border-gold hover:text-gold transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" strokeWidth={1.3} />
              </a>
              <a
                href="https://wa.me/96512345678"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-paper/20 hover:border-gold hover:text-gold transition-all duration-300"
                aria-label="WhatsApp"
              >
                <Phone className="w-4 h-4" strokeWidth={1.3} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="eyebrow text-gold mb-6">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/' as const, label: t('nav.home') },
                { href: '/products' as const, label: t('nav.products') },
                { href: '/about' as const, label: t('nav.about') },
                { href: '/contact' as const, label: t('nav.contact') },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-gold transition-colors duration-300 inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-gold group-hover:w-3 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-2">
            <h4 className="eyebrow text-gold mb-6">
              {locale === 'ar' ? 'قانوني' : 'Legal'}
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/terms' as const, label: t('footer.terms') },
                { href: '/privacy' as const, label: t('footer.privacy') },
                { href: '/refund' as const, label: t('footer.refund') },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-gold transition-colors duration-300 inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-gold group-hover:w-3 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-2">
            <h4 className="eyebrow text-gold mb-6">
              {t('footer.contact')}
            </h4>
            <ul className="space-y-3 text-sm">
              <li dir="ltr" className="text-start">{t('footer.phone')}</li>
              <li>{t('footer.email')}</li>
              <li>{t('footer.address')}</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-paper/10 mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-paper/40">
            {t('footer.rights')}
          </p>
          <p className="eyebrow text-paper/30">
            {locale === 'ar' ? 'صُنع بشغف في الكويت' : 'Crafted with passion in Kuwait'}
          </p>
        </div>
      </div>
    </footer>
  )
}

```


========================================
FILE: src/components/ui-premium/magnetic-button.tsx
========================================
```
'use client'

import { useRef, type ReactNode, type MouseEvent } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number
  onClick?: () => void
  href?: string
}

export function MagneticButton({
  children,
  className = '',
  strength = 0.3,
  onClick,
  href,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 200, damping: 20 })
  const springY = useSpring(y, { stiffness: 200, damping: 20 })

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distX = e.clientX - centerX
    const distY = e.clientY - centerY
    x.set(distX * strength)
    y.set(distY * strength)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  )

  if (href) {
    return (
      <a href={href} onClick={onClick} className="inline-block">
        {content}
      </a>
    )
  }

  return (
    <button onClick={onClick} className="inline-block bg-transparent border-0 p-0 cursor-pointer">
      {content}
    </button>
  )
}

```


========================================
FILE: src/components/ui-premium/tilt-card.tsx
========================================
```
'use client'

import { useRef, type ReactNode, type MouseEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion'

interface TiltCardProps {
  children: ReactNode
  className?: string
  maxTilt?: number
  glare?: boolean
}

export function TiltCard({
  children,
  className = '',
  maxTilt = 8,
  glare = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]), {
    stiffness: 300,
    damping: 30,
  })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]), {
    stiffness: 300,
    damping: 30,
  })

  // Always call useTransform (hooks must not be conditional)
  const glareX = useTransform(x, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(y, [-0.5, 0.5], ['0%', '100%'])
  const glareBg = useTransform(
    [glareX, glareY] as MotionValue<string>[],
    ([gx, gy]) =>
      `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.15) 0%, transparent 50%)`
  )

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={`relative ${className}`}
    >
      {children}
      {glare && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: glareBg }}
        />
      )}
    </motion.div>
  )
}

```


========================================
FILE: src/components/ui-premium/reveal-text.tsx
========================================
```
'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface RevealTextProps {
  children: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

export function RevealText({
  children,
  className = '',
  as: Tag = 'p',
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.4'],
  })

  const words = children.split(' ')

  return (
    <Tag
      ref={ref as React.RefObject<HTMLHeadingElement>}
      className={className}
    >
      {words.map((word, i) => {
        const start = i / words.length
        const end = start + 1 / words.length
        return <Word key={i} progress={scrollYProgress} range={[start, end]}>{word}</Word>
      })}
    </Tag>
  )
}

function Word({
  children,
  progress,
  range,
}: {
  children: string
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  range: [number, number]
}) {
  const opacity = useTransform(progress, range, [0, 1])
  const y = useTransform(progress, range, [20, 0])
  return (
    <span className="inline-block overflow-hidden" style={{ marginInlineEnd: '0.25em' }}>
      <motion.span
        style={{ opacity, y }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </span>
  )
}

```


========================================
FILE: src/components/ui-premium/parallax-image.tsx
========================================
```
'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface ParallaxImageProps {
  children: ReactNode
  className?: string
  offset?: number
}

export function ParallaxImage({
  children,
  className = '',
  offset = 100,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [-offset / 2, offset / 2])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y, scale }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  )
}

```


========================================
FILE: src/components/ui-premium/custom-cursor.tsx
========================================
```
'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false)
  const [isPointer, setIsPointer] = useState(false)

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = { damping: 25, stiffness: 400 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    // Only enable on devices with fine pointer (mouse)
    if (window.matchMedia('(pointer: coarse)').matches) return

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 8)
      cursorY.set(e.clientY - 8)
      setIsVisible(true)

      const target = e.target as HTMLElement
      const isInteractive =
        target.closest('a, button, [role="button"], input, textarea, select, .cursor-pointer') !== null
      setIsPointer(isInteractive)
    }

    const hideCursor = () => setIsVisible(false)

    window.addEventListener('mousemove', moveCursor)
    document.addEventListener('mouseleave', hideCursor)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      document.removeEventListener('mouseleave', hideCursor)
    }
  }, [cursorX, cursorY])

  if (!isVisible) return null

  return (
    <>
      {/* Main dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[10000] hidden md:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          className="rounded-full"
          animate={{
            width: isPointer ? 40 : 8,
            height: isPointer ? 40 : 8,
            backgroundColor: isPointer
              ? 'rgba(230, 33, 41, 0.2)'
              : 'rgba(230, 33, 41, 0.8)',
            border: isPointer ? '1px solid rgba(230, 33, 41, 0.6)' : 'none',
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          style={{
            marginLeft: isPointer ? -16 : 0,
            marginTop: isPointer ? -16 : 0,
          }}
        />
      </motion.div>
    </>
  )
}

```


========================================
FILE: src/components/product/product-gallery.tsx
========================================
```
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Box } from 'lucide-react'

interface ProductGalleryProps {
  images: string[]
  model3dUrl: string | null
  productName: string
  onEnable3D?: () => void
}

export function ProductGallery({
  images,
  model3dUrl,
  productName,
  onEnable3D,
}: ProductGalleryProps) {
  const t = useTranslations()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const hasImages = images.length > 0
  const currentImage = hasImages ? images[selectedImageIndex] : null

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-square rounded-xl overflow-hidden border border-border bg-card">
        {currentImage ? (
          <Image
            src={currentImage}
            alt={productName}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            {t('common.noImage')}
          </div>
        )}

        {/* 3D button overlay */}
        {model3dUrl && onEnable3D && (
          <button
            onClick={onEnable3D}
            className="absolute bottom-3 end-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-gold/90 hover:bg-gold text-white text-xs font-medium transition-colors"
          >
            <Box className="w-4 h-4" />
            {t('product.3d.enable')}
          </button>
        )}
      </div>

      {/* Thumbnails */}
      {hasImages && (
        <div className="grid grid-cols-5 gap-2 mt-3">
          {images.slice(0, 5).map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImageIndex(idx)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                selectedImageIndex === idx
                  ? 'border-lut'
                  : 'border-border hover:opacity-80'
              }`}
            >
              <Image
                src={img}
                alt={`${productName} ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

```


========================================
FILE: src/components/product/product-3d-viewer.tsx
========================================
```
'use client'

import { Suspense, useState } from 'react'
import dynamic from 'next/dynamic'
import { Loader2, Box, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

// Dynamically import the actual 3D canvas (heavy) — client only
const ModelCanvas = dynamic(
  () => import('./model-canvas').then((m) => m.ModelCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[400px] bg-muted rounded-xl">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    ),
  }
)

interface Product3DViewerProps {
  modelUrl: string
  productSlug: string
}

export function Product3DViewer({ modelUrl: _modelUrl, productSlug }: Product3DViewerProps) {
  const t = useTranslations()
  const [enabled, setEnabled] = useState(false)

  if (!enabled) {
    return (
      <button
        onClick={() => setEnabled(true)}
        className="mt-4 w-full flex items-center justify-center gap-2 py-3 px-4 border border-gold/50 rounded-lg text-gold hover:bg-gold/10 transition-colors"
      >
        <Box className="w-5 h-5" />
        {t('product.3d.enable')}
      </button>
    )
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Box className="w-4 h-4 text-gold" />
          {t('product.3d.title')}
        </h3>
        <button
          onClick={() => setEnabled(false)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3 h-3" />
          {t('product.3d.disable')}
        </button>
      </div>
      <div className="h-[400px] bg-gradient-to-br from-muted to-muted/50 rounded-xl overflow-hidden border border-border relative">
        {/* Ambient glow background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(201, 162, 39, 0.08) 0%, transparent 70%)',
          }}
        />
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          }
        >
          <ModelCanvas modelUrl="" productSlug={productSlug} />
        </Suspense>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        {t('product.3d.hint')}
      </p>
    </div>
  )
}

```


========================================
FILE: src/components/product/model-canvas.tsx
========================================
```
'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import * as THREE from 'three'

interface ModelCanvasProps {
  modelUrl: string
  productSlug: string
}

/**
 * Creates a procedural 3D furniture-like object based on the product slug.
 * Since we don't have actual GLB files, we generate simple geometric shapes
 * that represent furniture pieces.
 */
function FurnitureModel({ productSlug }: { productSlug: string }) {
  const groupRef = useRef<THREE.Group>(null)

  // Determine what type of furniture to render based on slug
  const isChair = productSlug.includes('chair')
  const isTable = productSlug.includes('table')
  const isChandelier = productSlug.includes('chandelier')
  const isLamp = productSlug.includes('lamp') || productSlug.includes('light') || productSlug.includes('uplighter')
  const isLantern = productSlug.includes('lantern')

  if (isChair) {
    return (
      <group ref={groupRef} position={[0, -0.5, 0]} scale={0.8}>
        {/* Seat */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[1, 0.1, 1]} />
          <meshStandardMaterial color="#D4A574" roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, 1, -0.45]} castShadow>
          <boxGeometry args={[1, 1, 0.1]} />
          <meshStandardMaterial color="#D4A574" roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Legs */}
        {[
          [-0.4, 0, -0.4],
          [0.4, 0, -0.4],
          [-0.4, 0, 0.4],
          [0.4, 0, 0.4],
        ].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
            <meshStandardMaterial color="#8B6F47" roughness={0.6} />
          </mesh>
        ))}
      </group>
    )
  }

  if (isTable) {
    return (
      <group ref={groupRef} position={[0, -0.5, 0]} scale={0.8}>
        {/* Tabletop */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[1, 1, 0.08, 32]} />
          <meshStandardMaterial color="#8B6F47" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Center pole */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 1, 16]} />
          <meshStandardMaterial color="#5C3D2E" roughness={0.5} />
        </mesh>
        {/* Base */}
        <mesh position={[0, -0.2, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.7, 0.1, 32]} />
          <meshStandardMaterial color="#5C3D2E" roughness={0.5} />
        </mesh>
      </group>
    )
  }

  if (isChandelier) {
    return (
      <group ref={groupRef} position={[0, 0.5, 0]} scale={0.7}>
        {/* Top ring */}
        <mesh castShadow>
          <torusGeometry args={[0.3, 0.03, 8, 32]} />
          <meshStandardMaterial color="#D4A574" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Middle ring */}
        <mesh position={[0, -0.3, 0]} castShadow>
          <torusGeometry args={[0.5, 0.03, 8, 32]} />
          <meshStandardMaterial color="#D4A574" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Bottom ring */}
        <mesh position={[0, -0.6, 0]} castShadow>
          <torusGeometry args={[0.7, 0.03, 8, 32]} />
          <meshStandardMaterial color="#D4A574" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Crystal drops */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.5, -0.45, Math.sin(angle) * 0.5]}
              castShadow
            >
              <octahedronGeometry args={[0.05, 0]} />
              <meshStandardMaterial
                color="#FFFFFF"
                metalness={0.1}
                roughness={0}
                transparent
                opacity={0.8}
              />
            </mesh>
          )
        })}
        {/* Center chain */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
          <meshStandardMaterial color="#8B6F47" metalness={0.6} roughness={0.4} />
        </mesh>
      </group>
    )
  }

  if (isLamp || isLantern) {
    return (
      <group ref={groupRef} position={[0, -0.3, 0]} scale={0.7}>
        {/* Base */}
        <mesh position={[0, -0.6, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.35, 0.1, 16]} />
          <meshStandardMaterial color="#5C3D2E" roughness={0.5} metalness={0.3} />
        </mesh>
        {/* Pole */}
        <mesh position={[0, -0.1, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 1, 8]} />
          <meshStandardMaterial color="#8B6F47" metalness={0.5} roughness={0.4} />
        </mesh>
        {/* Shade */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <coneGeometry args={[0.35, 0.4, 16, 1, true]} />
          <meshStandardMaterial
            color="#F4EFE6"
            roughness={0.8}
            metalness={0}
            side={THREE.DoubleSide}
            emissive="#FFE4B5"
            emissiveIntensity={0.3}
          />
        </mesh>
        {/* Bulb glow */}
        <mesh position={[0, 0.45, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
    )
  }

  // Default: abstract decorative object
  return (
    <group ref={groupRef} scale={0.8}>
      <mesh castShadow>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial color="#D4A574" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  )
}

export function ModelCanvas({ modelUrl: _modelUrl, productSlug }: ModelCanvasProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [3, 2, 4], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-3, 2, -3]} intensity={0.3} color="#D4A574" />

      <Suspense fallback={null}>
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
          <FurnitureModel productSlug={productSlug} />
        </Float>
        <ContactShadows
          position={[0, -1.2, 0]}
          opacity={0.4}
          scale={5}
          blur={2}
          far={3}
        />
        <Environment preset="apartment" />
      </Suspense>

      <OrbitControls
        enablePan={false}
        minDistance={2}
        maxDistance={8}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.8}
        autoRotate
        autoRotateSpeed={1}
      />
    </Canvas>
  )
}

```


========================================
FILE: src/components/product/product-info.tsx
========================================
```
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Minus, Plus, ShoppingCart, Check, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { localizedName, calculateRentalTotal } from '@/lib/products'
import type { ProductWithImages } from '@/lib/products'
import { useCart } from '@/components/providers/cart-provider'

interface ProductInfoProps {
  product: ProductWithImages
}

type AvailabilityState = 'idle' | 'checking' | 'available' | 'unavailable' | 'error'

export function ProductInfo({ product }: ProductInfoProps) {
  const t = useTranslations()
  const locale = useLocale()
  const { addItem } = useCart()

  const isOutOfStock = product.stock === 0
  const today = new Date().toISOString().split('T')[0]

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [availability, setAvailability] = useState<AvailabilityState>('idle')
  const [added, setAdded] = useState(false)

  const productName = localizedName(product.nameAr, product.nameEn, locale)
  const categoryName = localizedName(product.category.nameAr, product.category.nameEn, locale)
  const description = localizedName(product.descriptionAr, product.descriptionEn, locale)

  // Calculate pricing
  const priceCalc = (() => {
    if (!startDate || !endDate) return null
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) return null
    return calculateRentalTotal(
      product.rentalPricePerDay,
      product.securityDeposit,
      start,
      end,
      quantity
    )
  })()

  // Check availability when both dates are set
  const checkAvailability = useCallback(async () => {
    if (!startDate || !endDate) {
      setAvailability('idle')
      return
    }

    const start = new Date(startDate)
    const end = new Date(endDate)
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      setAvailability('idle')
      return
    }

    setAvailability('checking')

    try {
      const params = new URLSearchParams({
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      })
      const res = await fetch(`/api/products/${product.id}/availability?${params}`)
      if (!res.ok) {
        setAvailability('error')
        return
      }
      const data = await res.json() as { available: boolean }
      setAvailability(data.available ? 'available' : 'unavailable')
    } catch {
      setAvailability('error')
    }
  }, [startDate, endDate, product.id])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (startDate && endDate) {
        checkAvailability()
      } else {
        setAvailability('idle')
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [startDate, endDate, checkAvailability])

  const canAddToCart =
    !isOutOfStock &&
    priceCalc !== null &&
    (availability === 'available')

  const handleAddToCart = () => {
    if (!canAddToCart || !priceCalc) return

    const firstImage = product.images[0] ?? ''

    addItem({
      productId: product.id,
      slug: product.slug,
      nameAr: product.nameAr,
      nameEn: product.nameEn,
      image: firstImage,
      rentalPricePerDay: product.rentalPricePerDay,
      securityDeposit: product.securityDeposit,
      startDate,
      endDate,
      quantity,
      days: priceCalc.days,
      total: priceCalc.total,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const maxQty = Math.max(1, product.stock)

  return (
    <div className="space-y-5">
      {/* Category + Name */}
      <div>
        <Badge variant="outline" className="mb-3 border-gold/40 text-gold bg-gold/5">
          {categoryName}
        </Badge>
        <h1 className="text-3xl font-bold text-foreground mb-2">{productName}</h1>
        {isOutOfStock && (
          <Badge className="bg-muted text-muted-foreground border-0">
            {t('product.outOfStock')}
          </Badge>
        )}
      </div>

      {/* Price */}
      <div className="space-y-1">
        <p className="text-3xl font-bold text-lut">
          {product.rentalPricePerDay} {t('product.perDay')}
        </p>
        <p className="text-sm text-muted-foreground">
          {t('product.securityDeposit', { amount: product.securityDeposit })}
        </p>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-2">
          {t('product.description')}
        </h2>
        <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
          {description}
        </p>
      </div>

      {/* Rental Period Selector */}
      <div className="space-y-3 pt-4 border-t border-border">
        <h2 className="text-sm font-semibold text-foreground">
          {t('product.rental.title')}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              {t('product.rental.startDate')}
            </label>
            <input
              type="date"
              min={today}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={isOutOfStock}
              className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-lut disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">
              {t('product.rental.endDate')}
            </label>
            <input
              type="date"
              min={startDate || today}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={isOutOfStock || !startDate}
              className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-lut disabled:opacity-50"
            />
          </div>
        </div>

        {/* Availability status */}
        {availability === 'checking' && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            {t('product.rental.checking')}
          </div>
        )}
        {availability === 'available' && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="w-4 h-4" />
            {t('product.rental.available')}
          </div>
        )}
        {availability === 'unavailable' && (
          <div className="flex items-center gap-2 text-sm text-lut">
            <AlertCircle className="w-4 h-4" />
            {t('product.rental.unavailable')}
          </div>
        )}
        {availability === 'idle' && startDate && endDate && (
          <p className="text-xs text-muted-foreground">
            {t('product.rental.selectDates')}
          </p>
        )}
      </div>

      {/* Quantity Selector */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">
          {t('product.quantity.label')}
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={isOutOfStock || quantity <= 1}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label={t('product.quantity.decrease')}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-semibold text-foreground">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
            disabled={isOutOfStock || quantity >= maxQty}
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label={t('product.quantity.increase')}
          >
            <Plus className="w-4 h-4" />
          </button>
          <span className="text-xs text-muted-foreground ms-2">
            {t('product.quantity.label')}: {product.stock}
          </span>
        </div>
      </div>

      {/* Price Summary */}
      {priceCalc && (
        <div className="p-4 rounded-xl bg-bg-light border border-border space-y-2">
          <h3 className="text-sm font-semibold text-foreground mb-2">
            {t('product.priceSummary.title')}
          </h3>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{t('product.priceSummary.days', { count: priceCalc.days })}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              {t('product.priceSummary.rental', {
                rate: product.rentalPricePerDay,
                days: priceCalc.days,
                qty: quantity,
                amount: priceCalc.subtotal,
              })}
            </span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              {t('product.priceSummary.deposit', { amount: priceCalc.deposit })}
            </span>
          </div>
          <div className="flex justify-between text-base font-bold text-lut pt-2 border-t border-border">
            <span>{t('product.priceSummary.total', { amount: priceCalc.total })}</span>
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <div className="space-y-2">
        <Button
          onClick={handleAddToCart}
          disabled={!canAddToCart}
          className="w-full bg-lut hover:bg-lut/90 text-white py-3 text-base font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {added ? (
            <>
              <Check className="w-5 h-5 me-2" />
              {t('product.addedToCart')}
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5 me-2" />
              {t('product.addToCart')}
            </>
          )}
        </Button>
        {added && (
          <Link
            href="/cart"
            className="block text-center text-sm text-lut hover:underline"
          >
            {t('product.viewCart')}
          </Link>
        )}
      </div>
    </div>
  )
}

```


========================================
FILE: src/components/product/breadcrumbs.tsx
========================================
```
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface BreadcrumbsProps {
  categorySlug: string
  categoryNameAr: string
  categoryNameEn: string
  productName: string
}

export function Breadcrumbs({
  categorySlug,
  categoryNameAr,
  categoryNameEn,
  productName,
}: BreadcrumbsProps) {
  const t = useTranslations()
  const locale = useLocale()
  const Separator = locale === 'ar' ? ChevronLeft : ChevronRight
  const categoryName = locale === 'ar' ? categoryNameAr : categoryNameEn

  const items = [
    { label: t('product.breadcrumbs.home'), href: '/' as const },
    { label: t('product.breadcrumbs.products'), href: '/products' as const },
    {
      label: categoryName,
      href: `/products?category=${categorySlug}` as const,
    },
  ]

  return (
    <nav
      className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6 flex-wrap"
      aria-label="Breadcrumb"
    >
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-1.5">
          <Link
            href={item.href}
            className="hover:text-lut transition-colors"
          >
            {item.label}
          </Link>
          <Separator className="w-3 h-3 text-muted-foreground/60" />
        </span>
      ))}
      <span className="text-foreground font-medium truncate max-w-[200px]">
        {productName}
      </span>
    </nav>
  )
}

```


========================================
FILE: src/components/product/related-products.tsx
========================================
```
import { useTranslations } from 'next-intl'
import type { ProductWithImages } from '@/lib/products'
import { ProductCard } from '@/components/landing/product-card'

interface RelatedProductsProps {
  products: ProductWithImages[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  const t = useTranslations()

  if (products.length === 0) return null

  return (
    <section className="mt-16 pt-12 border-t border-border">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        {t('product.related')}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

```


========================================
FILE: src/components/product/trust-badges.tsx
========================================
```
import { useTranslations } from 'next-intl'
import { Truck, ShieldCheck, RefreshCw, Star } from 'lucide-react'

export function TrustBadges() {
  const t = useTranslations()

  const badges = [
    { icon: Truck, label: t('product.trustBadges.delivery') },
    { icon: ShieldCheck, label: t('product.trustBadges.insurance') },
    { icon: RefreshCw, label: t('product.trustBadges.refund') },
    { icon: Star, label: t('product.trustBadges.quality') },
  ]

  return (
    <section className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
      {badges.map((badge, idx) => {
        const Icon = badge.icon
        return (
          <div
            key={idx}
            className="flex items-center gap-3 p-4 rounded-xl bg-bg-light border border-border"
          >
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-gold" />
            </div>
            <span className="text-xs font-medium text-foreground leading-tight">
              {badge.label}
            </span>
          </div>
        )
      })}
    </section>
  )
}

```


========================================
FILE: src/components/cart/cart-view.tsx
========================================
```
'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Trash2, Minus, Plus, ShoppingCart, ArrowLeft, ArrowRight } from 'lucide-react'
import { useCart } from '@/components/providers/cart-provider'
import { localizedName } from '@/lib/products'

export function CartView() {
  const t = useTranslations()
  const locale = useLocale()
  const { items, hydrated, removeItem, updateQuantity, rentalTotal, depositTotal, total } = useCart()

  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight

  // Hydration guard
  if (!hydrated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">...</div>
      </div>
    )
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <ShoppingCart className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {t('cart.empty.title')}
        </h1>
        <p className="text-muted-foreground mb-8">
          {t('cart.empty.subtitle')}
        </p>
        <Button asChild className="bg-lut hover:bg-lut/90 text-white">
          <Link href="/products">
            {t('cart.empty.cta')}
            <ArrowIcon className="w-4 h-4 ms-2" />
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">
        {t('cart.title')}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => {
            const productName = localizedName(item.nameAr, item.nameEn, locale)
            const startDateFormatted = item.startDate.split('T')[0]
            const endDateFormatted = item.endDate.split('T')[0]

            return (
              <div
                key={`${item.productId}-${item.startDate}-${item.endDate}-${index}`}
                className="flex gap-4 p-4 rounded-xl bg-card border border-border"
              >
                {/* Image */}
                <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-muted">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={productName}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      {t('common.noImage')}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-semibold text-foreground hover:text-lut transition-colors line-clamp-1"
                    >
                      {productName}
                    </Link>
                    <button
                      onClick={() => removeItem(index)}
                      className="text-muted-foreground hover:text-lut transition-colors shrink-0"
                      aria-label={t('cart.item.remove')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1">
                    {t('cart.item.period', {
                      start: startDateFormatted,
                      end: endDateFormatted,
                      days: item.days,
                    })}
                  </p>

                  <p className="text-sm text-lut font-medium mt-1">
                    {item.rentalPricePerDay} {t('cart.item.perDay')}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        aria-label={t('product.quantity.decrease')}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-secondary transition-colors"
                        aria-label={t('product.quantity.increase')}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Item total */}
                    <p className="font-bold text-foreground">
                      {item.total.toFixed(3)} {t('featured.perDay').split(' ')[0]}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Continue shopping */}
          <div className="pt-4">
            <Button asChild variant="outline" className="border-border">
              <Link href="/products">
                <ArrowIcon className="w-4 h-4 me-2 rotate-180" />
                {t('cart.continueShopping')}
              </Link>
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 rounded-xl bg-bg-light border border-border">
            <h2 className="text-lg font-bold text-foreground mb-4">
              {t('cart.summary.title')}
            </h2>

            <div className="space-y-3 pb-4 border-b border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t('cart.summary.rental')}
                </span>
                <span className="font-medium text-foreground">
                  {rentalTotal.toFixed(3)} KWD
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t('cart.summary.deposit')}
                </span>
                <span className="font-medium text-foreground">
                  {depositTotal.toFixed(3)} KWD
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center py-4">
              <span className="font-bold text-foreground">
                {t('cart.summary.total')}
              </span>
              <span className="text-xl font-bold text-lut">
                {total.toFixed(3)} KWD
              </span>
            </div>

            <Button
              asChild
              className="w-full bg-lut hover:bg-lut/90 text-white py-3 text-base font-semibold rounded-lg"
            >
              <Link href="/checkout">
                {t('cart.checkout')}
                <ArrowIcon className="w-4 h-4 ms-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

```


========================================
FILE: src/components/checkout/checkout-view.tsx
========================================
```
'use client'

import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations, useLocale } from 'next-intl'
import { Link, useRouter } from '@/i18n/routing'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react'
import { useCart } from '@/components/providers/cart-provider'
import { localizedName } from '@/lib/products'

const checkoutSchema = z.object({
  customerName: z.string().min(3).max(100),
  customerPhone: z.string().regex(/^\+?[0-9\s-]{8,20}$/),
  customerEmail: z.string().email(),
  address: z.string().min(10).max(500),
  city: z.string().min(2).max(50),
  notes: z.string().max(1000).optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export function CheckoutView() {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const { items, hydrated, total, rentalTotal, depositTotal } = useCart()
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Generate idempotency key once on mount
  const idempotencyKey = useMemo(
    () => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    []
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  })

  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight

  // Hydration guard
  if (!hydrated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">...</div>
      </div>
    )
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          {t('checkout.empty')}
        </h1>
        <Button asChild className="bg-lut hover:bg-lut/90 text-white">
          <Link href="/products">
            {t('cart.empty.cta')}
            <ArrowIcon className="w-4 h-4 ms-2" />
          </Link>
        </Button>
      </div>
    )
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setSubmitting(true)
    setErrorMessage(null)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customer: data,
          idempotencyKey,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        const errorCode = result.error as string | undefined
        const errorKey = `checkout.errors.${errorCode ?? 'internal_error'}`
        try {
          setErrorMessage(t(errorKey))
        } catch {
          setErrorMessage(t('checkout.errors.internal_error'))
        }
        setSubmitting(false)
        return
      }

      // Success — redirect to payment page (cart cleared after payment)
      const orderId = result.orderId as string
      router.push(`/checkout/payment?order=${orderId}`)
    } catch {
      setErrorMessage(t('checkout.errors.internal_error'))
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground mb-8">
        {t('checkout.title')}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 p-6 rounded-xl bg-card border border-border"
          >
            <h2 className="text-lg font-bold text-foreground">
              {t('checkout.form.customerInfo')}
            </h2>

              {errorMessage && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-lut/10 border border-lut/30 text-lut text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="customerName">
                  {t('checkout.form.name')}
                </Label>
                <Input
                  id="customerName"
                  {...register('customerName')}
                  className="bg-background"
                />
                {errors.customerName && (
                  <p className="text-xs text-lut">{t('checkout.form.name')} *</p>
                )}
              </div>

              {/* Phone + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="customerPhone">
                    {t('checkout.form.phone')}
                  </Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    dir="ltr"
                    {...register('customerPhone')}
                    className="bg-background"
                  />
                  {errors.customerPhone && (
                    <p className="text-xs text-lut">{t('checkout.form.phone')} *</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="customerEmail">
                    {t('checkout.form.email')}
                  </Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    dir="ltr"
                    {...register('customerEmail')}
                    className="bg-background"
                  />
                  {errors.customerEmail && (
                    <p className="text-xs text-lut">{t('checkout.form.email')} *</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <Label htmlFor="address">
                  {t('checkout.form.address')}
                </Label>
                <Textarea
                  id="address"
                  rows={2}
                  {...register('address')}
                  className="bg-background"
                />
                {errors.address && (
                  <p className="text-xs text-lut">{t('checkout.form.address')} *</p>
                )}
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <Label htmlFor="city">
                  {t('checkout.form.city')}
                </Label>
                <Input
                  id="city"
                  {...register('city')}
                  className="bg-background"
                />
                {errors.city && (
                  <p className="text-xs text-lut">{t('checkout.form.city')} *</p>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <Label htmlFor="notes">
                  {t('checkout.form.notes')}
                </Label>
                <Textarea
                  id="notes"
                  rows={3}
                  {...register('notes')}
                  className="bg-background"
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-lut hover:bg-lut/90 text-white py-3 text-base font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 me-2 animate-spin" />
                    {t('checkout.form.submitting')}
                  </>
                ) : (
                  t('checkout.form.submit')
                )}
              </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 rounded-xl bg-bg-light border border-border">
            <h2 className="text-lg font-bold text-foreground mb-4">
              {t('checkout.summary.title')}
            </h2>

            {/* Items */}
            <div className="space-y-3 mb-4 pb-4 border-b border-border max-h-64 overflow-y-auto">
              {items.map((item, index) => {
                const productName = localizedName(item.nameAr, item.nameEn, locale)
                return (
                  <div key={index} className="flex gap-3">
                    <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-muted">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={productName}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : (
                        <div className="w-full h-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-1">
                        {productName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t('cart.item.period', {
                          start: item.startDate.split('T')[0],
                          end: item.endDate.split('T')[0],
                          days: item.days,
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        × {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-foreground shrink-0">
                      {item.total.toFixed(3)}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Totals */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t('cart.summary.rental')}
                </span>
                <span className="font-medium">
                  {rentalTotal.toFixed(3)} KWD
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {t('cart.summary.deposit')}
                </span>
                <span className="font-medium">
                  {depositTotal.toFixed(3)} KWD
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center py-3 border-t border-border">
              <span className="font-bold text-foreground">
                {t('checkout.summary.total')}
              </span>
              <span className="text-xl font-bold text-lut">
                {total.toFixed(3)} KWD
              </span>
            </div>

            <p className="text-xs text-muted-foreground mt-3 text-center">
              {t('checkout.summary.availabilityNote')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

```


========================================
FILE: src/components/checkout/payment-view.tsx
========================================
```
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations, useLocale } from 'next-intl'
import { Link, useRouter } from '@/i18n/routing'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2, AlertCircle, Lock, ShieldCheck, CreditCard, ArrowLeft, ArrowRight } from 'lucide-react'
import { useCart } from '@/components/providers/cart-provider'
import { localizedName } from '@/lib/products'

const paymentSchema = z.object({
  cardNumber: z
    .string()
    .regex(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/, 'invalid_card'),
  cardName: z.string().min(3).max(100),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'invalid_expiry'),
  cvv: z.string().regex(/^\d{3,4}$/, 'invalid_cvv'),
  saveCard: z.boolean().optional(),
})

type PaymentFormData = z.infer<typeof paymentSchema>

interface PaymentViewProps {
  orderId?: string
}

export function PaymentView({ orderId }: PaymentViewProps) {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const { items, hydrated, total, clear } = useCart()
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: '',
      cardName: '',
      expiry: '',
      cvv: '',
      saveCard: false,
    },
  })

  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight

  // Card number mask: auto-insert spaces every 4 digits
  const formatCardNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
  }

  // Expiry mask: MM/YY
  const formatExpiry = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`
    }
    return digits
  }

  // CVV: digits only, max 4
  const formatCvv = (value: string): string => {
    return value.replace(/\D/g, '').slice(0, 4)
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('cardNumber', formatCardNumber(e.target.value), { shouldValidate: false })
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('expiry', formatExpiry(e.target.value), { shouldValidate: false })
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('cvv', formatCvv(e.target.value), { shouldValidate: false })
  }

  // No order ID — can't proceed
  if (!orderId) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          {t('payment.errors.order_not_found')}
        </h1>
        <Button asChild className="bg-lut hover:bg-lut/90 text-white">
          <Link href="/products">
            {t('cart.empty.cta')}
            <ArrowIcon className="w-4 h-4 ms-2" />
          </Link>
        </Button>
      </div>
    )
  }

  const onSubmit = async (_data: PaymentFormData) => {
    setSubmitting(true)
    setErrorMessage(null)

    // Simulate payment processing (2 seconds) — NO real payment API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Call internal mock to confirm payment
    try {
      const response = await fetch('/api/webhooks/payment-success', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })

      const result = await response.json()

      if (!response.ok) {
        const errorCode = result.error as string | undefined
        const errorKey = `payment.errors.${errorCode ?? 'payment_failed'}`
        try {
          setErrorMessage(t(errorKey))
        } catch {
          setErrorMessage(t('payment.errors.payment_failed'))
        }
        setSubmitting(false)
        return
      }

      // Success — clear cart and redirect to success page
      clear()
      router.push(`/checkout/success?order=${orderId}`)
    } catch {
      setErrorMessage(t('payment.errors.payment_failed'))
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pt-24">
      <h1 className="text-3xl font-bold text-foreground mb-8">
        {t('payment.title')}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          {/* Order info card */}
          <div className="p-4 rounded-xl bg-bg-light border border-border mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">
                  {t('payment.orderId', { id: orderId.slice(-8) })}
                </p>
                <p className="text-xl font-bold text-lut mt-1">
                  {t('payment.total', { amount: total.toFixed(3) })}
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-gold" />
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {t('payment.displayNote')}
            </p>
          </div>

          {/* Card form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 p-6 rounded-xl bg-card border border-border"
          >
            {errorMessage && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-lut/10 border border-lut/30 text-lut text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Card Number */}
            <div className="space-y-1.5">
              <Label htmlFor="cardNumber">
                {t('payment.form.cardNumber')}
              </Label>
              <Input
                id="cardNumber"
                dir="ltr"
                placeholder="0000 0000 0000 0000"
                {...register('cardNumber')}
                onChange={handleCardNumberChange}
                className="bg-background"
              />
              {errors.cardNumber && (
                <p className="text-xs text-lut">{t('payment.errors.invalid_card')}</p>
              )}
            </div>

            {/* Card Name */}
            <div className="space-y-1.5">
              <Label htmlFor="cardName">
                {t('payment.form.cardName')}
              </Label>
              <Input
                id="cardName"
                {...register('cardName')}
                className="bg-background"
              />
              {errors.cardName && (
                <p className="text-xs text-lut">{t('payment.form.cardName')} *</p>
              )}
            </div>

            {/* Expiry + CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="expiry">
                  {t('payment.form.expiry')}
                </Label>
                <Input
                  id="expiry"
                  dir="ltr"
                  placeholder="MM/YY"
                  {...register('expiry')}
                  onChange={handleExpiryChange}
                  className="bg-background"
                />
                {errors.expiry && (
                  <p className="text-xs text-lut">{t('payment.errors.invalid_expiry')}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cvv">
                  {t('payment.form.cvv')}
                </Label>
                <Input
                  id="cvv"
                  type="password"
                  dir="ltr"
                  placeholder="•••"
                  {...register('cvv')}
                  onChange={handleCvvChange}
                  className="bg-background"
                />
                {errors.cvv && (
                  <p className="text-xs text-lut">{t('payment.errors.invalid_cvv')}</p>
                )}
              </div>
            </div>

            {/* Save card (UI only) */}
            <div className="flex items-center gap-2">
              <Checkbox id="saveCard" {...register('saveCard')} />
              <Label htmlFor="saveCard" className="text-sm text-muted-foreground cursor-pointer">
                {t('payment.form.saveCard')}
              </Label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-lut hover:bg-lut/90 text-white py-3 text-base font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 me-2 animate-spin" />
                  {t('payment.form.processing')}
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 me-2" />
                  {t('payment.form.submit', { amount: total.toFixed(3) })}
                </>
              )}
            </Button>
          </form>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border">
              <Lock className="w-4 h-4 text-gold shrink-0" />
              <span className="text-xs text-foreground">
                {t('payment.trust.ssl')}
              </span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border">
              <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
              <span className="text-xs text-foreground">
                {t('payment.trust.fraud')}
              </span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border">
              <CreditCard className="w-4 h-4 text-gold shrink-0" />
              <span className="text-xs text-foreground">
                {t('payment.trust.cards')}
              </span>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 rounded-xl bg-bg-light border border-border">
            <h2 className="text-lg font-bold text-foreground mb-4">
              {t('payment.orderSummary')}
            </h2>

            {/* Items */}
            {hydrated && items.length > 0 ? (
              <div className="space-y-3 mb-4 pb-4 border-b border-border max-h-64 overflow-y-auto">
                {items.map((item, index) => {
                  const productName = localizedName(item.nameAr, item.nameEn, locale)
                  return (
                    <div key={index} className="flex gap-3">
                      <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-muted">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={productName}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        ) : (
                          <div className="w-full h-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-1">
                          {productName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          × {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-foreground shrink-0">
                        {item.total.toFixed(3)}
                      </p>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground mb-4">
                {t('cart.item.quantity')}: 0
              </p>
            )}

            {/* Total */}
            <div className="flex justify-between items-center py-3 border-t border-border">
              <span className="font-bold text-foreground">
                {t('checkout.summary.total')}
              </span>
              <span className="text-xl font-bold text-lut">
                {total.toFixed(3)} KWD
              </span>
            </div>

            <Button asChild variant="outline" className="w-full mt-4 border-border">
              <Link href="/cart">
                <ArrowLeft className="w-4 h-4 me-2" />
                {t('payment.backToCart')}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

```


========================================
FILE: src/components/checkout/success-view.tsx
========================================
```
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ArrowLeft, Phone, Package, Truck, CheckCheck, Mail, CalendarPlus } from 'lucide-react'

interface SuccessViewProps {
  orderId?: string
}

export function SuccessView({ orderId }: SuccessViewProps) {
  const t = useTranslations()

  const steps = [
    { icon: Package, key: 'step1' as const },
    { icon: Phone, key: 'step2' as const },
    { icon: Truck, key: 'step3' as const },
    { icon: Mail, key: 'step4' as const },
    { icon: CalendarPlus, key: 'step5' as const },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
      {/* Success icon */}
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-12 h-12 text-green-600" />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-foreground mb-3">
        {t('checkout.success.title')}
      </h1>

      {/* Order ID */}
      {orderId && (
        <p className="text-sm font-medium text-muted-foreground mb-2">
          {t('checkout.success.orderId', { id: orderId })}
        </p>
      )}

      {/* Subtitle */}
      <p className="text-muted-foreground mb-10 max-w-md mx-auto">
        {t('checkout.success.subtitle')}
      </p>

      {/* Next steps card */}
      <div className="p-6 rounded-xl bg-bg-light border border-border text-start mb-8">
        <h2 className="text-lg font-bold text-foreground mb-4 text-center">
          {t('checkout.success.nextSteps.title')}
        </h2>

        <div className="space-y-4">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-lut/10 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-lut" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {t(`checkout.success.nextSteps.${step.key}`)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild className="bg-lut hover:bg-lut/90 text-white">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 me-2" />
            {t('checkout.success.goHome')}
          </Link>
        </Button>
        <Button asChild variant="outline" className="border-border">
          <Link href="/products">
            <CheckCheck className="w-4 h-4 me-2" />
            {t('checkout.success.browseMore')}
          </Link>
        </Button>
      </div>
    </div>
  )
}

```


========================================
FILE: src/components/contact/contact-view.tsx
========================================
```
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, CheckCircle2, MapPin, Phone, Mail, Clock, MessageCircle, Instagram } from 'lucide-react'

const contactSchema = z.object({
  name: z.string().min(3).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[0-9\s-]{8,20}$/).optional().or(z.literal('')),
  subject: z.string().min(5).max(200),
  message: z.string().min(20).max(2000),
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactView() {
  const t = useTranslations()
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (_data: ContactFormData) => {
    setSubmitting(true)
    // Simulate submission (n8n will handle email sending later)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSubmitting(false)
    setSubmitted(true)
    reset()
  }

  const contactInfo = [
    { icon: MapPin, label: t('contact.info.address'), value: t('contact.info.addressValue') },
    { icon: Phone, label: t('contact.info.phone'), value: t('contact.info.phoneValue'), dir: 'ltr' as const },
    { icon: Mail, label: t('contact.info.email'), value: t('contact.info.emailValue'), dir: 'ltr' as const },
    { icon: Clock, label: t('contact.info.hours'), value: t('contact.info.hoursValue') },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
          {t('contact.title')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          {t('contact.subtitle')}
        </p>
        <div className="h-1 bg-gold mt-6" style={{ width: '60px' }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          {submitted ? (
            <div className="p-8 rounded-xl bg-card border border-border text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                {t('contact.form.success')}
              </h2>
              <Button
                onClick={() => setSubmitted(false)}
                variant="outline"
                className="mt-4 border-border"
              >
                {t('contact.form.subject') !== 'Subject' ? 'إرسال رسالة أخرى' : 'Send another message'}
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 p-6 rounded-xl bg-card border border-border"
            >
              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">
                    {t('contact.form.name')}
                  </Label>
                  <Input
                    id="name"
                    {...register('name')}
                    className="bg-background"
                  />
                  {errors.name && (
                    <p className="text-xs text-lut">{t('contact.form.name')} *</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">
                    {t('contact.form.email')}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    dir="ltr"
                    {...register('email')}
                    className="bg-background"
                  />
                  {errors.email && (
                    <p className="text-xs text-lut">{t('contact.form.email')} *</p>
                  )}
                </div>
              </div>

              {/* Phone + Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone">
                    {t('contact.form.phone')}
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    dir="ltr"
                    {...register('phone')}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="subject">
                    {t('contact.form.subject')}
                  </Label>
                  <Input
                    id="subject"
                    {...register('subject')}
                    className="bg-background"
                  />
                  {errors.subject && (
                    <p className="text-xs text-lut">{t('contact.form.subject')} *</p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <Label htmlFor="message">
                  {t('contact.form.message')}
                </Label>
                <Textarea
                  id="message"
                  rows={6}
                  {...register('message')}
                  className="bg-background"
                />
                {errors.message && (
                  <p className="text-xs text-lut">{t('contact.form.message')} *</p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-lut hover:bg-lut/90 text-white py-3 text-base font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 me-2 animate-spin" />
                    {t('contact.form.submitting')}
                  </>
                ) : (
                  t('contact.form.submit')
                )}
              </Button>
            </form>
          )}
        </div>

        {/* Contact info */}
        <div className="lg:col-span-1">
          <div className="p-6 rounded-xl bg-bg-light border border-border space-y-6">
            {contactInfo.map((info, idx) => {
              const Icon = info.icon
              return (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">
                      {info.label}
                    </p>
                    <p
                      className="text-sm font-medium text-foreground break-words"
                      dir={info.dir}
                    >
                      {info.value}
                    </p>
                  </div>
                </div>
              )
            })}

            {/* Social */}
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-3">
                {t('contact.info.whatsapp')} / {t('contact.info.instagram')}
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://wa.me/96512345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-lut hover:text-white hover:border-lut transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com/lastuniquetouch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-lut hover:text-white hover:border-lut transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

```


========================================
FILE: src/components/legal/page-header.tsx
========================================
```
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

interface PageHeaderProps {
  title: string
  subtitle?: string
  lastUpdated?: string
}

export function PageHeader({ title, subtitle, lastUpdated }: PageHeaderProps) {
  return (
    <>
      <Navbar />
      <div className="bg-bg-light pt-32 pb-12 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {lastUpdated && (
            <p className="text-xs text-muted-foreground mb-2">{lastUpdated}</p>
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-foreground">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl">
              {subtitle}
            </p>
          )}
          <div className="h-1 bg-gold mt-6" style={{ width: '60px' }} />
        </div>
      </div>
    </>
  )
}

interface LegalPageWrapperProps {
  title: string
  subtitle?: string
  lastUpdated?: string
  children: React.ReactNode
}

export function LegalPageWrapper({
  title,
  subtitle,
  lastUpdated,
  children,
}: LegalPageWrapperProps) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} lastUpdated={lastUpdated} />
      <main className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl">
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

```


========================================
FILE: src/components/legal/legal-content.tsx
========================================
```
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'

interface LegalContentProps {
  content: string
}

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold mt-0 mb-6 text-foreground sr-only">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold mt-6 mb-3 text-foreground">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-base leading-relaxed mb-4 text-foreground/90">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc ps-6 mb-4 space-y-2">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal ps-6 mb-4 space-y-2">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-foreground/90 leading-relaxed">
      {children}
    </li>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">
      {children}
    </strong>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-lut underline hover:opacity-80 transition-opacity"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-s-4 border-gold ps-4 py-2 mb-4 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
      {children}
    </code>
  ),
}

export function LegalContent({ content }: LegalContentProps) {
  return (
    <div className="prose prose-lg max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}

```


========================================
FILE: src/components/seo/json-ld.tsx
========================================
```
interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

```


========================================
FILE: src/components/providers/cart-provider.tsx
========================================
```
'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import {
  type CartItem,
  getCart,
  addToCart as storageAdd,
  removeFromCart as storageRemove,
  clearCart as storageClear,
} from '@/lib/cart'

const CART_KEY = 'lut_cart'

interface CartContextValue {
  items: CartItem[]
  count: number
  total: number
  rentalTotal: number
  depositTotal: number
  addItem: (item: CartItem) => void
  removeItem: (index: number) => void
  updateQuantity: (index: number, quantity: number) => void
  clear: () => void
  hydrated: boolean
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Load from localStorage on mount — required for client-only state hydration
  useEffect(() => {
    const loadCart = () => setItems(getCart())
    loadCart()
    setHydrated(true)

    window.addEventListener('cart-updated', loadCart)
    return () => window.removeEventListener('cart-updated', loadCart)
  }, [])

  const addItem = useCallback((item: CartItem) => {
    storageAdd(item)
    setItems(getCart())
  }, [])

  const removeItem = useCallback((index: number) => {
    storageRemove(index)
    setItems(getCart())
  }, [])

  const updateQuantity = useCallback((index: number, quantity: number) => {
    setItems((prev) => {
      if (index < 0 || index >= prev.length) return prev
      const item = prev[index]
      if (!item) return prev
      const newQty = Math.max(1, quantity)
      const updated: CartItem = {
        ...item,
        quantity: newQty,
        total:
          item.rentalPricePerDay * item.days * newQty +
          item.securityDeposit * newQty,
      }
      const next = [...prev]
      next[index] = updated
      if (typeof window !== 'undefined') {
        localStorage.setItem(CART_KEY, JSON.stringify(next))
        window.dispatchEvent(new Event('cart-updated'))
      }
      return next
    })
  }, [])

  const clear = useCallback(() => {
    storageClear()
    setItems([])
  }, [])

  const count = items.reduce((sum, i) => sum + i.quantity, 0)
  const rentalTotal = items.reduce(
    (sum, i) => sum + i.rentalPricePerDay * i.days * i.quantity,
    0
  )
  const depositTotal = items.reduce(
    (sum, i) => sum + i.securityDeposit * i.quantity,
    0
  )
  const total = rentalTotal + depositTotal

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        total,
        rentalTotal,
        depositTotal,
        addItem,
        removeItem,
        updateQuantity,
        clear,
        hydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

```


========================================
FILE: src/components/providers/toast-provider.tsx
========================================
```
'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning'

interface Toast {
  id: string
  type: ToastType
  message: string
}

interface ToastContextValue {
  showToast: (type: ToastType, message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).slice(2, 11)
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 end-4 z-[100] space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white max-w-sm ${
              toast.type === 'success'
                ? 'bg-green-600'
                : toast.type === 'error'
                ? 'bg-red-600'
                : 'bg-yellow-600'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0" />}
            {toast.type === 'error' && <XCircle className="w-5 h-5 shrink-0" />}
            {toast.type === 'warning' && <AlertCircle className="w-5 h-5 shrink-0" />}
            <span className="text-sm">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

```


========================================
FILE: src/components/products/products-filters.tsx
========================================
```
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/routing'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Category } from '@prisma/client'
import type { ProductSort } from '@/lib/products'

interface ProductsFiltersProps {
  categories: Category[]
  activeCategory?: string
  search?: string
  sort: ProductSort
}

export function ProductsFilters({
  categories,
  activeCategory,
  search,
  sort,
}: ProductsFiltersProps) {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [searchValue, setSearchValue] = useState(search ?? '')

  // Sync local search state when URL changes
  useEffect(() => {
    setSearchValue(search ?? '')
  }, [search])

  // Debounced search update
  const updateSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(window.location.search)
      if (value.trim()) {
        params.set('q', value.trim())
      } else {
        params.delete('q')
      }
      // Reset to page 1 when search changes
      params.delete('page')
      const qs = params.toString()
      router.replace(`${pathname}${qs ? `?${qs}` : ''}`)
    },
    [router, pathname]
  )

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== (search ?? '')) {
        updateSearch(searchValue)
      }
    }, 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])

  const handleCategoryClick = (slug: string | undefined) => {
    const params = new URLSearchParams(window.location.search)
    if (slug) {
      params.set('category', slug)
    } else {
      params.delete('category')
    }
    // Reset to page 1 when category changes
    params.delete('page')
    const qs = params.toString()
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`)
  }

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(window.location.search)
    params.set('sort', value)
    // Reset to page 1 when sort changes
    params.delete('page')
    const qs = params.toString()
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`)
  }

  // Category chips: "All" + each category
  const chips = [
    { slug: undefined, label: t('products.allCategories') },
    ...categories.map((c) => ({
      slug: c.slug,
      label: locale === 'ar' ? c.nameAr : c.nameEn,
    })),
  ]

  return (
    <div className="mb-8 space-y-4">
      {/* Search + Sort row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder={t('products.searchPlaceholder')}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="ps-10 bg-card"
          />
        </div>

        {/* Sort dropdown */}
        <div className="w-full sm:w-56">
          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger className="bg-card">
              <SelectValue placeholder={t('products.sort.label')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t('products.sort.newest')}</SelectItem>
              <SelectItem value="price-asc">{t('products.sort.price-asc')}</SelectItem>
              <SelectItem value="price-desc">{t('products.sort.price-desc')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => {
          const isActive =
            chip.slug === undefined
              ? !activeCategory
              : activeCategory === chip.slug
          return (
            <button
              key={chip.slug ?? 'all'}
              onClick={() => handleCategoryClick(chip.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-lut text-white'
                  : 'bg-bg-light text-foreground hover:bg-secondary'
              }`}
            >
              {chip.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

```


========================================
FILE: src/components/products/products-page-content.tsx
========================================
```
import { useTranslations } from 'next-intl'
import { ProductCard } from '@/components/landing/product-card'
import { Pagination } from '@/components/products/pagination'
import { EmptyState } from '@/components/products/empty-state'
import type { ProductWithImages, ProductSort } from '@/lib/products'

interface ProductsPageContentProps {
  products: ProductWithImages[]
  total: number
  page: number
  totalPages: number
  categorySlug?: string
  search?: string
  sort: ProductSort
}

export function ProductsPageContent({
  products,
  total,
  page,
  totalPages,
  categorySlug,
  search,
  sort,
}: ProductsPageContentProps) {
  const t = useTranslations()

  return (
    <div>
      {/* Result count */}
      <div className="mb-6 text-sm text-muted-foreground">
        {t('products.resultCount', { count: total })}
      </div>

      {/* Grid or Empty state */}
      {products.length === 0 ? (
        <EmptyState search={search} categorySlug={categorySlug} />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            categorySlug={categorySlug}
            search={search}
            sort={sort}
          />
        </>
      )}
    </div>
  )
}

```


========================================
FILE: src/components/products/pagination.tsx
========================================
```
'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/routing'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  categorySlug?: string
  search?: string
  sort: string
}

export function Pagination({
  currentPage,
  totalPages,
  categorySlug,
  search,
  sort,
}: PaginationProps) {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  if (totalPages <= 1) return null

  const buildUrl = (page: number) => {
    const params = new URLSearchParams()
    if (categorySlug) params.set('category', categorySlug)
    if (search) params.set('q', search)
    if (sort && sort !== 'newest') params.set('sort', sort)
    if (page > 1) params.set('page', String(page))
    const qs = params.toString()
    return `${pathname}${qs ? `?${qs}` : ''}`
  }

  const goTo = (page: number) => {
    if (page < 1 || page > totalPages) return
    router.replace(buildUrl(page))
  }

  // Generate page numbers with ellipsis logic
  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible + 2) {
      // Show all pages if not too many
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) pages.push(i)

      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()
  const isRtl = locale === 'ar'
  const PrevIcon = isRtl ? ChevronRight : ChevronLeft
  const NextIcon = isRtl ? ChevronLeft : ChevronRight

  return (
    <nav
      className="flex items-center justify-center gap-2 mt-12"
      aria-label={t('products.page')}
    >
      {/* Previous button */}
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label={t('products.previous')}
      >
        <PrevIcon className="w-4 h-4" />
      </button>

      {/* Page numbers */}
      {pageNumbers.map((pageNum, idx) => {
        if (pageNum === '...') {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="w-10 h-10 flex items-center justify-center text-muted-foreground"
            >
              ...
            </span>
          )
        }
        const isActive = pageNum === currentPage
        return (
          <button
            key={pageNum}
            onClick={() => goTo(pageNum)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
              isActive
                ? 'bg-lut text-white border-lut'
                : 'bg-card text-foreground border-border hover:bg-secondary'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {pageNum}
          </button>
        )
      })}

      {/* Next button */}
      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label={t('products.next')}
      >
        <NextIcon className="w-4 h-4" />
      </button>
    </nav>
  )
}

```


========================================
FILE: src/components/products/empty-state.tsx
========================================
```
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  search?: string
  categorySlug?: string
}

export function EmptyState({ search: _search, categorySlug: _categorySlug }: EmptyStateProps) {
  const t = useTranslations()

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
        <SearchX className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {t('products.empty.title')}
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        {t('products.empty.subtitle')}
      </p>
      <Button
        asChild
        variant="outline"
        className="border-lut text-lut hover:bg-lut/10"
      >
        <Link href="/products">
          {t('products.empty.clearFilters')}
        </Link>
      </Button>
    </div>
  )
}

```


========================================
FILE: src/components/products/products-grid-skeleton.tsx
========================================
```
export function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl overflow-hidden bg-card border border-border"
        >
          {/* Image skeleton */}
          <div className="aspect-square bg-muted animate-pulse" />

          {/* Info skeleton */}
          <div className="p-4 space-y-2">
            <div className="h-3 w-1/3 bg-muted rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
            <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}

```


========================================
FILE: src/components/admin/admin-shell.tsx
========================================
```
'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link, usePathname } from '@/i18n/routing'
import { LayoutDashboard, Package, FolderTree, CalendarDays, LogOut, Menu, X, ExternalLink } from 'lucide-react'
import { logoutAction } from '@/app/[locale]/admin/login/actions'
import { useRouter } from '@/i18n/routing'

export function AdminShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations()
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navLinks = [
    { href: '/admin' as const, label: t('admin.nav.dashboard'), icon: LayoutDashboard },
    { href: '/admin/products' as const, label: t('admin.nav.products'), icon: Package },
    { href: '/admin/categories' as const, label: t('admin.nav.categories'), icon: FolderTree },
    { href: '/admin/bookings' as const, label: t('admin.nav.bookings'), icon: CalendarDays },
  ]

  const handleLogout = async () => {
    await logoutAction()
    router.push('/admin/login')
    router.refresh()
  }

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-background flex" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-bg-dark text-white shrink-0">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-lut">Last Unique Touch</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          </div>
          <p className="text-xs text-white/50 mt-1">{t('admin.title')}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-lut text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors w-full"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {t('admin.nav.logout')}
          </button>
        </div>
      </aside>

      {/* Sidebar — mobile drawer */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <aside
            className="absolute top-0 start-0 w-64 h-full bg-bg-dark text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-lut">LUT</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              </div>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon
                const active = isActive(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-lut text-white'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {link.label}
                  </Link>
                )
              })}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors w-full"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                {t('admin.nav.logout')}
              </button>
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 sm:px-6 shrink-0">
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:block" />
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-lut transition-colors"
          >
            {t('admin.nav.viewSite')}
            <ExternalLink className="w-4 h-4" />
          </a>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

```


========================================
FILE: src/components/admin/login-page-view.tsx
========================================
```
'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, Loader2, AlertCircle } from 'lucide-react'
import { loginAction } from '@/app/[locale]/admin/login/actions'

export function LoginPageView() {
  const t = useTranslations()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (formData: FormData) => {
    setSubmitting(true)
    setError(null)

    const result = await loginAction(formData)

    if (result.success) {
      router.push('/admin')
      router.refresh()
    } else {
      setError(t('admin.login.invalid'))
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl font-bold text-lut">
              {t('brand.lut')}
            </span>
            <span className="w-2 h-2 rounded-full bg-gold" />
          </div>
          <p className="text-sm text-white/60">{t('admin.title')}</p>
        </div>

        {/* Login card */}
        <form
          action={onSubmit}
          className="bg-card rounded-xl shadow-xl p-8 space-y-5"
        >
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-lut/10 mx-auto mb-2">
            <Lock className="w-7 h-7 text-lut" />
          </div>

          <h1 className="text-xl font-bold text-center text-foreground">
            {t('admin.login.title')}
          </h1>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="password">{t('admin.login.password')}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoFocus
              required
              className="bg-background"
            />
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-lut hover:bg-lut/90 text-white py-3 font-semibold rounded-lg"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 me-2 animate-spin" />
                ...
              </>
            ) : (
              t('admin.login.submit')
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            {t('admin.login.devHint')}
          </p>
        </form>
      </div>
    </div>
  )
}

```


========================================
FILE: src/components/admin/product-form.tsx
========================================
```
'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/routing'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import type { Category } from '@prisma/client'
import type { ProductWithImages } from '@/lib/products'
import { createProductAction, updateProductAction } from '@/app/[locale]/admin/(dashboard)/products/actions'

interface ProductFormProps {
  categories: Category[]
  product?: ProductWithImages
  mode: 'create' | 'edit'
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function ProductForm({ categories, product, mode }: ProductFormProps) {
  const t = useTranslations()
  const locale = useLocale()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>(
    product?.images ?? ['']
  )
  const [slug, setSlug] = useState(product?.slug ?? '')
  const [nameEn, setNameEn] = useState(product?.nameEn ?? '')
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? categories[0]?.id ?? '')
  const [isActive, setIsActive] = useState(product?.isActive ?? true)
  const [model3dUrl, setModel3dUrl] = useState(product?.model3dUrl ?? '')

  const handleNameEnChange = (value: string) => {
    setNameEn(value)
    if (mode === 'create') {
      setSlug(slugify(value))
    }
  }

  const addImage = () => {
    setImages([...images, ''])
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const updateImage = (index: number, value: string) => {
    setImages(images.map((img, i) => (i === index ? value : img)))
  }

  const handleSubmit = async (formData: FormData) => {
    setSubmitting(true)

    // Add dynamic fields to formData
    const validImages = images.filter((img) => img.trim())
    formData.set('images', JSON.stringify(validImages))
    formData.set('slug', slug)
    formData.set('categoryId', categoryId)
    formData.set('isActive', String(isActive))
    formData.set('model3dUrl', model3dUrl)

    const result = mode === 'create'
      ? await createProductAction(formData)
      : await updateProductAction(product?.id ?? '', formData)

    if (result.success) {
      router.push('/admin/products')
      router.refresh()
    } else {
      setSubmitting(false)
      // Error is handled by the action (redirect on success)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          {mode === 'create' ? t('admin.products.form.titleNew') : t('admin.products.form.titleEdit')}
        </h1>
      </div>

      {/* Names */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="nameAr">{t('admin.products.form.nameAr')}</Label>
          <Input
            id="nameAr"
            name="nameAr"
            defaultValue={product?.nameAr ?? ''}
            required
            className="bg-card"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nameEn">{t('admin.products.form.nameEn')}</Label>
          <Input
            id="nameEn"
            name="nameEn"
            value={nameEn}
            onChange={(e) => handleNameEnChange(e.target.value)}
            required
            className="bg-card"
          />
        </div>
      </div>

      {/* Descriptions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="descriptionAr">{t('admin.products.form.descriptionAr')}</Label>
          <Textarea
            id="descriptionAr"
            name="descriptionAr"
            defaultValue={product?.descriptionAr ?? ''}
            rows={4}
            required
            className="bg-card"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="descriptionEn">{t('admin.products.form.descriptionEn')}</Label>
          <Textarea
            id="descriptionEn"
            name="descriptionEn"
            defaultValue={product?.descriptionEn ?? ''}
            rows={4}
            required
            className="bg-card"
          />
        </div>
      </div>

      {/* Category + Slug */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="categoryId">{t('admin.products.form.category')}</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="bg-card">
              <SelectValue placeholder={t('admin.products.form.category')} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {locale === 'ar' ? c.nameAr : c.nameEn}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="categoryId" value={categoryId} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="slug">{t('admin.products.form.slug')}</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            dir="ltr"
            className="bg-card"
          />
        </div>
      </div>

      {/* Pricing + Stock */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="rentalPricePerDay">{t('admin.products.form.rentalPrice')}</Label>
          <Input
            id="rentalPricePerDay"
            name="rentalPricePerDay"
            type="number"
            step="0.001"
            min="0"
            defaultValue={product?.rentalPricePerDay ?? ''}
            required
            dir="ltr"
            className="bg-card"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="securityDeposit">{t('admin.products.form.securityDeposit')}</Label>
          <Input
            id="securityDeposit"
            name="securityDeposit"
            type="number"
            step="0.001"
            min="0"
            defaultValue={product?.securityDeposit ?? ''}
            required
            dir="ltr"
            className="bg-card"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="stock">{t('admin.products.form.stock')}</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            min="0"
            defaultValue={product?.stock ?? ''}
            required
            dir="ltr"
            className="bg-card"
          />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-2">
        <Label>{t('admin.products.form.images')}</Label>
        <div className="space-y-2">
          {images.map((img, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={img}
                onChange={(e) => updateImage(index, e.target.value)}
                placeholder="https://..."
                dir="ltr"
                className="bg-card"
              />
              {images.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeImage(index)}
                  className="shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addImage}
          className="mt-2"
        >
          <Plus className="w-4 h-4 me-2" />
          {t('admin.products.form.addImage')}
        </Button>
      </div>

      {/* 3D Model URL */}
      <div className="space-y-1.5">
        <Label htmlFor="model3dUrl">{t('admin.products.form.model3dUrl')}</Label>
        <Input
          id="model3dUrl"
          value={model3dUrl}
          onChange={(e) => setModel3dUrl(e.target.value)}
          placeholder="https://..."
          dir="ltr"
          className="bg-card"
        />
      </div>

      {/* Active checkbox */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="isActive"
          checked={isActive}
          onCheckedChange={(checked) => setIsActive(checked === true)}
        />
        <Label htmlFor="isActive" className="text-sm cursor-pointer">
          {t('admin.products.form.isActive')}
        </Label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={submitting}
          className="bg-lut hover:bg-lut/90 text-white"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 me-2 animate-spin" />
              ...
            </>
          ) : (
            t('admin.products.form.submit')
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/products')}
          className="border-border"
        >
          {t('admin.products.form.cancel')}
        </Button>
      </div>
    </form>
  )
}

```


========================================
FILE: src/components/admin/products-table.tsx
========================================
```
'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { Search, Pencil, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ConfirmDelete } from '@/components/admin/confirm-delete'
import { useToast } from '@/components/providers/toast-provider'
import { deleteProductAction } from '@/app/[locale]/admin/(dashboard)/products/actions'
import { localizedName } from '@/lib/products'
import { useRouter } from '@/i18n/routing'
import type { Category } from '@prisma/client'

interface AdminProduct {
  id: string
  nameAr: string
  nameEn: string
  slug: string
  rentalPricePerDay: number
  stock: number
  isActive: boolean
  categoryId: string
  category: { nameAr: string; nameEn: string }
  firstImage: string | null
}

interface ProductsTableProps {
  products: AdminProduct[]
  categories: Category[]
  locale: string
}

export function ProductsTable({ products, categories, locale }: ProductsTableProps) {
  const t = useTranslations()
  const { showToast } = useToast()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const name = localizedName(p.nameAr, p.nameEn, locale).toLowerCase()
      if (search && !name.includes(search.toLowerCase())) return false
      if (categoryFilter !== 'all' && p.categoryId !== categoryFilter) return false
      if (statusFilter === 'active' && !p.isActive) return false
      if (statusFilter === 'inactive' && p.isActive) return false
      return true
    })
  }, [products, search, categoryFilter, statusFilter, locale])

  const handleDelete = async (id: string, _name: string) => {
    const result = await deleteProductAction(id)
    if (result.success) {
      showToast('success', t('admin.products.deleted'))
      router.refresh()
    } else {
      showToast('error', t('admin.errors.internal_error'))
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t('admin.products.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="ps-10 bg-card"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-card">
            <SelectValue placeholder={t('admin.products.filterCategory')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('admin.products.filterCategory')}</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {locale === 'ar' ? c.nameAr : c.nameEn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40 bg-card">
            <SelectValue placeholder={t('admin.products.filterStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('admin.products.filterStatus')}</SelectItem>
            <SelectItem value="active">{t('admin.products.active')}</SelectItem>
            <SelectItem value="inactive">{t('admin.products.inactive')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-start py-3 px-4 font-medium text-muted-foreground">{t('admin.products.title')}</th>
                <th className="text-start py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">{t('admin.products.filterCategory')}</th>
                <th className="text-start py-3 px-4 font-medium text-muted-foreground">{t('admin.products.price')}</th>
                <th className="text-start py-3 px-4 font-medium text-muted-foreground">{t('admin.products.stock')}</th>
                <th className="text-start py-3 px-4 font-medium text-muted-foreground">{t('admin.products.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted-foreground">
                    {t('admin.common.noData')}
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="border-t border-border">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                          {product.firstImage ? (
                            <Image
                              src={product.firstImage}
                              alt={localizedName(product.nameAr, product.nameEn, locale)}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          ) : (
                            <div className="w-full h-full" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {localizedName(product.nameAr, product.nameEn, locale)}
                          </p>
                          <p className="text-xs text-muted-foreground">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell text-muted-foreground">
                      {localizedName(product.category.nameAr, product.category.nameEn, locale)}
                    </td>
                    <td className="py-3 px-4 text-foreground font-medium">
                      {product.rentalPricePerDay} KWD
                    </td>
                    <td className="py-3 px-4">
                      <span className={product.stock === 0 ? 'text-red-600 font-bold' : product.stock <= 2 ? 'text-yellow-600 font-bold' : 'text-foreground'}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <ConfirmDelete
                          trigger={
                            <span className="p-2 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors block">
                              <Trash2 className="w-4 h-4" />
                            </span>
                          }
                          itemName={localizedName(product.nameAr, product.nameEn, locale)}
                          onConfirm={() => handleDelete(product.id, localizedName(product.nameAr, product.nameEn, locale))}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

```


========================================
FILE: src/components/admin/categories-table.tsx
========================================
```
'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react'
import { useToast } from '@/components/providers/toast-provider'
import { useRouter } from '@/i18n/routing'
import { ConfirmDelete } from '@/components/admin/confirm-delete'
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from '@/app/[locale]/admin/(dashboard)/categories/actions'
import { localizedName } from '@/lib/products'

interface AdminCategory {
  id: string
  nameAr: string
  nameEn: string
  slug: string
  productCount: number
}

interface CategoriesTableProps {
  categories: AdminCategory[]
  locale: string
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export function CategoriesTable({ categories, locale }: CategoriesTableProps) {
  const t = useTranslations()
  const { showToast } = useToast()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleCreate = async (formData: FormData) => {
    setSubmitting(true)
    const result = await createCategoryAction(formData)
    setSubmitting(false)
    if (result.success) {
      showToast('success', t('admin.categories.saved'))
      setShowForm(false)
      router.refresh()
    } else {
      showToast('error', t(`admin.errors.${result.error ?? 'internal_error'}`))
    }
  }

  const handleUpdate = async (id: string, formData: FormData) => {
    setSubmitting(true)
    const result = await updateCategoryAction(id, formData)
    setSubmitting(false)
    if (result.success) {
      showToast('success', t('admin.categories.saved'))
      setEditingCategory(null)
      router.refresh()
    } else {
      showToast('error', t(`admin.errors.${result.error ?? 'internal_error'}`))
    }
  }

  const handleDelete = async (id: string) => {
    const result = await deleteCategoryAction(id)
    if (result.success) {
      showToast('success', t('admin.categories.deleted'))
      router.refresh()
    } else if (result.error === 'has_products') {
      showToast('error', t('admin.categories.cannotDelete'))
    } else {
      showToast('error', t('admin.errors.internal_error'))
    }
  }

  return (
    <div className="space-y-4">
      {/* Add button */}
      {!showForm && !editingCategory && (
        <Button
          onClick={() => setShowForm(true)}
          className="bg-lut hover:bg-lut/90 text-white"
        >
          <Plus className="w-4 h-4 me-2" />
          {t('admin.categories.add')}
        </Button>
      )}

      {/* Create form */}
      {showForm && (
        <CategoryForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          submitting={submitting}
        />
      )}

      {/* Table */}
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-start py-3 px-4 font-medium text-muted-foreground">{t('admin.categories.title')}</th>
                <th className="text-start py-3 px-4 font-medium text-muted-foreground">{t('admin.categories.slug')}</th>
                <th className="text-start py-3 px-4 font-medium text-muted-foreground">{t('admin.categories.productCount')}</th>
                <th className="text-start py-3 px-4 font-medium text-muted-foreground">{t('admin.products.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-muted-foreground">
                    {t('admin.common.noData')}
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <>
                    {editingCategory?.id === cat.id ? (
                      <tr key={cat.id}>
                        <td colSpan={4} className="p-4">
                          <CategoryForm
                            category={editingCategory}
                            onSubmit={(fd) => handleUpdate(cat.id, fd)}
                            onCancel={() => setEditingCategory(null)}
                            submitting={submitting}
                          />
                        </td>
                      </tr>
                    ) : (
                      <tr key={cat.id} className="border-t border-border">
                        <td className="py-3 px-4 font-medium text-foreground">
                          {localizedName(cat.nameAr, cat.nameEn, locale)}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground" dir="ltr">{cat.slug}</td>
                        <td className="py-3 px-4 text-foreground">{cat.productCount}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingCategory(cat)}
                              className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <ConfirmDelete
                              trigger={
                                <span className="p-2 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors block">
                                  <Trash2 className="w-4 h-4" />
                                </span>
                              }
                              itemName={localizedName(cat.nameAr, cat.nameEn, locale)}
                              onConfirm={() => handleDelete(cat.id)}
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

interface CategoryFormProps {
  category?: AdminCategory
  onSubmit: (formData: FormData) => Promise<void>
  onCancel: () => void
  submitting: boolean
}

function CategoryForm({ category, onSubmit, onCancel, submitting }: CategoryFormProps) {
  const t = useTranslations()
  const [nameEn, setNameEn] = useState(category?.nameEn ?? '')
  const [slug, setSlug] = useState(category?.slug ?? '')

  const handleNameEnChange = (value: string) => {
    setNameEn(value)
    if (!category) {
      setSlug(slugify(value))
    }
  }

  return (
    <form
      action={onSubmit}
      className="p-4 rounded-lg bg-muted/30 border border-border space-y-3"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">
          {category ? t('admin.products.edit') : t('admin.categories.add')}
        </h3>
        <button type="button" onClick={onCancel} className="text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label htmlFor="cat-nameAr">{t('admin.categories.nameAr')}</Label>
          <Input id="cat-nameAr" name="nameAr" defaultValue={category?.nameAr ?? ''} required className="bg-card" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="cat-nameEn">{t('admin.categories.nameEn')}</Label>
          <Input
            id="cat-nameEn"
            name="nameEn"
            value={nameEn}
            onChange={(e) => handleNameEnChange(e.target.value)}
            required
            className="bg-card"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="cat-slug">{t('admin.categories.slug')}</Label>
          <Input
            id="cat-slug"
            name="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            dir="ltr"
            className="bg-card"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={submitting} className="bg-lut hover:bg-lut/90 text-white">
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : t('admin.common.save')}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="border-border">
          {t('admin.common.cancel')}
        </Button>
      </div>
    </form>
  )
}

```


========================================
FILE: src/components/admin/bookings-table.tsx
========================================
```
'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname, Link } from '@/i18n/routing'
import { Search, Eye } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface AdminBooking {
  id: string
  customerName: string
  customerPhone: string
  startDate: string
  endDate: string
  status: string
  totalAmount: number
  productName: string
  productSlug: string
}

interface BookingsTableProps {
  bookings: AdminBooking[]
  currentStatus: string
  currentSearch: string
  locale: string
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
}

export function BookingsTable({ bookings, currentStatus, currentSearch, locale: _locale }: BookingsTableProps) {
  const t = useTranslations()
  const router = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState(currentSearch)

  const statusFilters = ['all', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']

  const updateUrl = (status: string, q: string) => {
    const params = new URLSearchParams()
    if (status !== 'all') params.set('status', status)
    if (q.trim()) params.set('q', q.trim())
    const qs = params.toString()
    router.replace(`${pathname}${qs ? `?${qs}` : ''}`)
  }

  const handleStatusChange = (status: string) => {
    updateUrl(status, search)
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    const timer = setTimeout(() => updateUrl(currentStatus, value), 400)
    return () => clearTimeout(timer)
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t('admin.bookings.table.customer') + ' / ' + t('admin.bookings.detail.phone') + ' / ' + t('admin.bookings.detail.email')}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="ps-10 bg-card"
          />
        </div>
      </div>

      {/* Status chips */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((status) => (
          <button
            key={status}
            onClick={() => handleStatusChange(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentStatus === status
                ? 'bg-lut text-white'
                : 'bg-card border border-border text-foreground hover:bg-muted'
            }`}
          >
            {status === 'all' ? t('admin.bookings.filterStatus.all') : t(`admin.bookings.filterStatus.${status}` as const)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-start py-3 px-4 font-medium text-muted-foreground">{t('admin.bookings.table.id')}</th>
                <th className="text-start py-3 px-4 font-medium text-muted-foreground">{t('admin.bookings.table.customer')}</th>
                <th className="text-start py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">{t('admin.bookings.table.product')}</th>
                <th className="text-start py-3 px-4 font-medium text-muted-foreground">{t('admin.bookings.table.status')}</th>
                <th className="text-start py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">{t('admin.bookings.table.total')}</th>
                <th className="text-start py-3 px-4 font-medium text-muted-foreground">{t('admin.bookings.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    {t('admin.common.noData')}
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="border-t border-border">
                    <td className="py-3 px-4 text-muted-foreground font-mono text-xs" dir="ltr">
                      {booking.id.slice(-8)}
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">{booking.customerName}</td>
                    <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{booking.productName}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[booking.status]}`}>
                        {t(`admin.bookings.filterStatus.${booking.status}` as const)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-foreground font-medium hidden sm:table-cell">
                      {booking.totalAmount.toFixed(3)} KWD
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/admin/bookings/${booking.id}`}
                        className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors inline-flex"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

```


========================================
FILE: src/components/admin/booking-detail.tsx
========================================
```
'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, X, CheckCheck, Loader2 } from 'lucide-react'
import { useToast } from '@/components/providers/toast-provider'
import { updateBookingStatusAction } from '@/app/[locale]/admin/(dashboard)/bookings/actions'
import { localizedName } from '@/lib/products'

interface BookingDetailData {
  id: string
  status: string
  startDate: string
  endDate: string
  totalAmount: number
  currency: string
  createdAt: string
  customerName: string
  customerPhone: string
  customerEmail: string
  product: {
    nameAr: string
    nameEn: string
    slug: string
    rentalPricePerDay: number
    securityDeposit: number
    categoryNameAr: string
    categoryNameEn: string
  }
}

interface BookingDetailProps {
  booking: BookingDetailData
  locale: string
}

export function BookingDetail({ booking, locale }: BookingDetailProps) {
  const t = useTranslations()
  const { showToast } = useToast()
  const router = useRouter()
  const [updating, setUpdating] = useState(false)

  const days = Math.max(
    1,
    Math.ceil(
      (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (24 * 60 * 60 * 1000)
    )
  )

  const rentalAmount = booking.product.rentalPricePerDay * days
  const depositAmount = booking.product.securityDeposit

  const handleStatusChange = async (newStatus: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED') => {
    setUpdating(true)
    const result = await updateBookingStatusAction(booking.id, newStatus)
    setUpdating(false)

    if (result.success) {
      showToast('success', t('admin.bookings.statusChanged'))
      router.refresh()
    } else {
      const errorKey = result.error === 'invalid_transition'
        ? 'admin.bookings.invalidTransition'
        : 'admin.errors.internal_error'
      showToast('error', t(errorKey))
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back link */}
      <Link
        href="/admin/bookings"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-lut transition-colors"
      >
        <ArrowRight className="w-4 h-4 rotate-180" />
        {t('admin.bookings.title')}
      </Link>

      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('admin.bookings.detail.title')}</h1>
          <p className="text-sm text-muted-foreground mt-1 font-mono" dir="ltr">#{booking.id}</p>
        </div>
        <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
          booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
          booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
          booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {t(`admin.bookings.filterStatus.${booking.status}` as const)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer info */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <h2 className="text-lg font-bold text-foreground mb-4">{t('admin.bookings.detail.customerInfo')}</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-muted-foreground">{t('admin.bookings.detail.name')}</dt>
              <dd className="text-sm font-medium text-foreground">{booking.customerName}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">{t('admin.bookings.detail.phone')}</dt>
              <dd className="text-sm font-medium text-foreground" dir="ltr">{booking.customerPhone}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">{t('admin.bookings.detail.email')}</dt>
              <dd className="text-sm font-medium text-foreground" dir="ltr">{booking.customerEmail}</dd>
            </div>
          </dl>
        </div>

        {/* Rental info */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <h2 className="text-lg font-bold text-foreground mb-4">{t('admin.bookings.detail.rentalInfo')}</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-muted-foreground">{t('admin.bookings.detail.product')}</dt>
              <dd className="text-sm font-medium text-foreground">
                {localizedName(booking.product.nameAr, booking.product.nameEn, locale)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">{t('admin.bookings.detail.startDate')}</dt>
              <dd className="text-sm font-medium text-foreground">{booking.startDate.split('T')[0]}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">{t('admin.bookings.detail.endDate')}</dt>
              <dd className="text-sm font-medium text-foreground">{booking.endDate.split('T')[0]}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">{t('admin.bookings.detail.days')}</dt>
              <dd className="text-sm font-medium text-foreground">{days}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Financial summary */}
      <div className="p-6 rounded-xl bg-bg-light border border-border">
        <h2 className="text-lg font-bold text-foreground mb-4">{t('admin.bookings.detail.financialSummary')}</h2>
        <div className="space-y-2 max-w-md">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('admin.bookings.detail.rental')}</span>
            <span className="font-medium text-foreground">{rentalAmount.toFixed(3)} {booking.currency}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('admin.bookings.detail.deposit')}</span>
            <span className="font-medium text-foreground">{depositAmount.toFixed(3)} {booking.currency}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-border">
            <span className="font-bold text-foreground">{t('admin.bookings.detail.total')}</span>
            <span className="text-lg font-bold text-lut">{booking.totalAmount.toFixed(3)} {booking.currency}</span>
          </div>
        </div>
      </div>

      {/* Status change buttons */}
      <div className="p-6 rounded-xl bg-card border border-border">
        <h2 className="text-lg font-bold text-foreground mb-4">{t('admin.bookings.detail.changeStatus')}</h2>
        <div className="flex flex-wrap gap-3">
          {booking.status === 'PENDING' && (
            <>
              <Button
                onClick={() => handleStatusChange('CONFIRMED')}
                disabled={updating}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 me-2" />}
                {t('admin.bookings.detail.confirm')}
              </Button>
              <Button
                onClick={() => handleStatusChange('CANCELLED')}
                disabled={updating}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <X className="w-4 h-4 me-2" />
                {t('admin.bookings.detail.cancel')}
              </Button>
            </>
          )}
          {booking.status === 'CONFIRMED' && (
            <>
              <Button
                onClick={() => handleStatusChange('COMPLETED')}
                disabled={updating}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4 me-2" />}
                {t('admin.bookings.detail.complete')}
              </Button>
              <Button
                onClick={() => handleStatusChange('CANCELLED')}
                disabled={updating}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <X className="w-4 h-4 me-2" />
                {t('admin.bookings.detail.cancel')}
              </Button>
            </>
          )}
          {(booking.status === 'CANCELLED' || booking.status === 'COMPLETED') && (
            <p className="text-sm text-muted-foreground">
              {t('admin.bookings.invalidTransition')}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

```


========================================
FILE: src/components/admin/confirm-delete.tsx
========================================
```
'use client'

import { useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmDeleteProps {
  trigger: ReactNode
  itemName: string
  onConfirm: () => Promise<void> | void
}

export function ConfirmDelete({ trigger, itemName, onConfirm }: ConfirmDeleteProps) {
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleConfirm = async () => {
    setDeleting(true)
    try {
      await onConfirm()
      setOpen(false)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {trigger}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => !deleting && setOpen(false)}
        >
          <div
            className="bg-card rounded-xl shadow-xl max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <button
                onClick={() => !deleting && setOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-foreground mb-2">
              تأكيد الحذف
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              هل أنت متأكد من حذف &ldquo;{itemName}&rdquo;؟
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-border"
                onClick={() => setOpen(false)}
                disabled={deleting}
              >
                إلغاء
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={handleConfirm}
                disabled={deleting}
              >
                {deleting ? 'جارٍ الحذف...' : 'حذف'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

```


========================================
FILE: src/lib/seo.ts
========================================
```
import type { Metadata } from 'next'

const BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'
const SITE_NAME = 'Last Unique Touch'

const DEFAULT_DESCRIPTION = {
  ar: 'منصة فاخرة لتأجير الأثاث ومعدات الأيفنتات في الكويت',
  en: 'Luxury platform for furniture and event equipment rental in Kuwait',
}

interface BuildMetadataParams {
  title?: string
  description?: string
  path?: string
  image?: string
  locale?: 'ar' | 'en'
  noIndex?: boolean
}

export function buildMetadata({
  title,
  description,
  path = '',
  image,
  locale = 'ar',
  noIndex = false,
}: BuildMetadataParams): Metadata {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} — ${DEFAULT_DESCRIPTION[locale]}`
  const desc = description || DEFAULT_DESCRIPTION[locale]
  const url = `${BASE_URL}/${locale}${path}`
  const ogImage = image || `${BASE_URL}/og-default.png`

  return {
    title: fullTitle,
    description: desc,
    alternates: {
      canonical: url,
      languages: {
        ar: `${BASE_URL}/ar${path}`,
        en: `${BASE_URL}/en${path}`,
      },
    },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      locale: locale === 'ar' ? 'ar_KW' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: desc,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  }
}

```


========================================
FILE: src/lib/cart.ts
========================================
```
export interface CartItem {
  productId: string
  slug: string
  nameAr: string
  nameEn: string
  image: string
  rentalPricePerDay: number
  securityDeposit: number
  startDate: string
  endDate: string
  quantity: number
  days: number
  total: number
}

const CART_KEY = 'lut_cart'

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? JSON.parse(raw) as CartItem[] : []
  } catch {
    return []
  }
}

export function addToCart(item: CartItem): void {
  if (typeof window === 'undefined') return
  const cart = getCart()
  const existing = cart.findIndex(
    (c) =>
      c.productId === item.productId &&
      c.startDate === item.startDate &&
      c.endDate === item.endDate
  )
  if (existing >= 0) {
    cart[existing].quantity += item.quantity
    cart[existing].total =
      cart[existing].rentalPricePerDay * cart[existing].days * cart[existing].quantity +
      cart[existing].securityDeposit * cart[existing].quantity
  } else {
    cart.push(item)
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
  window.dispatchEvent(new Event('cart-updated'))
}

export function removeFromCart(index: number): void {
  if (typeof window === 'undefined') return
  const cart = getCart()
  cart.splice(index, 1)
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
  window.dispatchEvent(new Event('cart-updated'))
}

export function clearCart(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(CART_KEY)
  window.dispatchEvent(new Event('cart-updated'))
}

export function getCartCount(): number {
  return getCart().reduce((sum, item) => sum + item.quantity, 0)
}

export function getCartTotal(): number {
  return getCart().reduce((sum, item) => sum + item.total, 0)
}

```


========================================
FILE: src/lib/products.ts
========================================
```
import { Prisma, type Brand, type Category, type Product } from '@prisma/client'
import { db } from './db'

/**
 * Parse images JSON string to array of URLs.
 * SQLite stores String[] as JSON string, so we need this helper.
 */
export function parseImages(imagesField: string | null | undefined): string[] {
  if (!imagesField) return []
  try {
    const parsed = JSON.parse(imagesField)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

/**
 * Convert array of image URLs to JSON string for SQLite storage.
 */
export function stringifyImages(images: string[]): string {
  return JSON.stringify(images)
}

/**
 * Get localized product name based on locale.
 */
export function localizedName(
  nameAr: string,
  nameEn: string,
  locale: string
): string {
  return locale === 'ar' ? nameAr : nameEn
}

/**
 * Product type with parsed images array.
 */
export interface ProductWithImages {
  id: string
  brand: string
  slug: string
  nameAr: string
  nameEn: string
  descriptionAr: string
  descriptionEn: string
  rentalPricePerDay: number
  securityDeposit: number
  images: string[]
  model3dUrl: string | null
  stock: number
  isActive: boolean
  categoryId: string
  category: {
    id: string
    nameAr: string
    nameEn: string
    slug: string
  }
  createdAt: Date
  updatedAt: Date
}

/**
 * Get featured products for landing page.
 */
export async function getFeaturedProducts(limit = 4): Promise<ProductWithImages[]> {
  const products = await db.product.findMany({
    where: {
      brand: 'LUT',
      isActive: true,
    },
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      category: {
        select: { id: true, nameAr: true, nameEn: true, slug: true },
      },
    },
  })

  return products.map((p) => ({
    ...p,
    images: parseImages(p.images),
  }))
}

/**
 * Get all categories for a brand (for filter sidebar).
 */
export async function getCategoriesByBrand(brand: Brand = 'LUT'): Promise<Category[]> {
  return db.category.findMany({
    where: { brand },
    orderBy: { nameEn: 'asc' },
  })
}

/**
 * Product list query parameters.
 */
export interface ProductListParams {
  brand?: Brand
  categorySlug?: string
  search?: string
  sort?: 'newest' | 'price-asc' | 'price-desc'
  page?: number
  pageSize?: number
}

/**
 * Sort options type.
 */
export type ProductSort = 'newest' | 'price-asc' | 'price-desc'

/**
 * Result of getProducts query.
 */
export interface ProductListResult {
  products: ProductWithImages[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * Get paginated, filtered, sorted product list.
 */
export async function getProducts(params: ProductListParams = {}): Promise<ProductListResult> {
  const {
    brand = 'LUT',
    categorySlug,
    search,
    sort = 'newest',
    page = 1,
    pageSize = 12,
  } = params

  const where: Prisma.ProductWhereInput = {
    brand,
    isActive: true,
  }

  // Category filter
  if (categorySlug) {
    where.category = { slug: categorySlug }
  }

  // Text search (SQLite-friendly: case-insensitive contains)
  if (search && search.trim()) {
    const q = search.trim()
    where.OR = [
      { nameAr: { contains: q } },
      { nameEn: { contains: q } },
      { descriptionAr: { contains: q } },
      { descriptionEn: { contains: q } },
    ]
  }

  // Sort
  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === 'price-asc' ? { rentalPricePerDay: 'asc' } :
    sort === 'price-desc' ? { rentalPricePerDay: 'desc' } :
    { createdAt: 'desc' }

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        category: {
          select: { id: true, nameAr: true, nameEn: true, slug: true },
        },
      },
    }),
    db.product.count({ where }),
  ])

  return {
    products: products.map((p) => ({
      ...p,
      images: parseImages(p.images),
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

/**
 * Get a single product by slug (for product detail page — Phase 4).
 */
export async function getProductBySlug(slug: string): Promise<ProductWithImages | null> {
  const product = await db.product.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
      isActive: true,
    },
    include: {
      category: {
        select: { id: true, nameAr: true, nameEn: true, slug: true },
      },
    },
  })

  if (!product) return null

  return {
    ...product,
    images: parseImages(product.images),
  }
}

/**
 * Check if a product is available for booking in a given date range.
 * Returns true if no overlapping CONFIRMED or PENDING booking exists.
 */
export async function checkProductAvailability(
  productId: string,
  startDate: Date,
  endDate: Date
): Promise<{ available: boolean; conflictingBookings: number }> {
  const conflictingBookings = await db.booking.count({
    where: {
      productId,
      status: { in: ['CONFIRMED', 'PENDING'] },
      // Overlap condition: existing booking (s, e) overlaps with (startDate, endDate)
      // if startDate < e AND endDate > s
      AND: [
        { startDate: { lt: endDate } },
        { endDate: { gt: startDate } },
      ],
    },
  })

  return {
    available: conflictingBookings === 0,
    conflictingBookings,
  }
}

/**
 * Get related products (same category, different slug, with stock).
 */
export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  brand: Brand = 'LUT',
  limit = 4
): Promise<ProductWithImages[]> {
  const products = await db.product.findMany({
    where: {
      brand,
      isActive: true,
      categoryId,
      id: { not: productId },
      stock: { gt: 0 },
    },
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      category: {
        select: { id: true, nameAr: true, nameEn: true, slug: true },
      },
    },
  })

  return products.map((p) => ({
    ...p,
    images: parseImages(p.images),
  }))
}

/**
 * Calculate total rental price for a booking.
 */
export function calculateRentalTotal(
  rentalPricePerDay: number,
  securityDeposit: number,
  startDate: Date,
  endDate: Date,
  quantity: number = 1
): { days: number; subtotal: number; deposit: number; total: number } {
  const msPerDay = 24 * 60 * 60 * 1000
  const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / msPerDay))
  const subtotal = rentalPricePerDay * days * quantity
  const deposit = securityDeposit * quantity
  return {
    days,
    subtotal,
    deposit,
    total: subtotal + deposit,
  }
}

/**
 * Type for raw Product from Prisma (before image parsing).
 */
export type RawProduct = Product

/**
 * Get a single product by ID (for admin edit page).
 */
export async function getProductById(id: string): Promise<ProductWithImages | null> {
  const product = await db.product.findUnique({
    where: { id },
    include: {
      category: {
        select: { id: true, nameAr: true, nameEn: true, slug: true },
      },
    },
  })

  if (!product) return null

  return {
    ...product,
    images: parseImages(product.images),
  }
}

```


========================================
FILE: src/lib/auth.ts
========================================
```
import { cookies } from 'next/headers'
import { createHmac } from 'crypto'

const SESSION_COOKIE = 'lut_admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function getAdminPassword(): string | null {
  return process.env.ADMIN_PASSWORD || null
}

function createSessionToken(): string {
  const secret = process.env.ADMIN_PASSWORD || 'fallback-secret'
  const timestamp = Date.now().toString()
  const signature = createHmac('sha256', secret).update(timestamp).digest('hex')
  return `${timestamp}.${signature}`
}

function verifySessionToken(token: string): boolean {
  if (!token || !token.includes('.')) return false
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [timestamp, signature] = parts
  const secret = process.env.ADMIN_PASSWORD || 'fallback-secret'
  const expectedSignature = createHmac('sha256', secret).update(timestamp).digest('hex')

  if (signature !== expectedSignature) return false

  const timestampNum = parseInt(timestamp, 10)
  if (isNaN(timestampNum)) return false

  const age = Date.now() - timestampNum
  if (age > SESSION_MAX_AGE * 1000) return false

  return true
}

export async function login(password: string): Promise<boolean> {
  const adminPassword = getAdminPassword()
  const isProduction = process.env.NODE_ENV === 'production'

  if (!adminPassword) {
    // In development without ADMIN_PASSWORD set, allow "dev" as password
    if (!isProduction && process.env.NODE_ENV === 'development' && password === 'dev') {
      const cookieStore = await cookies()
      cookieStore.set(SESSION_COOKIE, createSessionToken(), {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: SESSION_MAX_AGE,
        path: '/',
      })
      return true
    }
    return false
  }

  if (password !== adminPassword) return false

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
  return true
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return false
  return verifySessionToken(token)
}

/**
 * Redirects to login if not authenticated.
 * Use in Server Components.
 */
export async function requireAuth(): Promise<void> {
  const authed = await isAuthenticated()
  if (!authed) {
    const { redirect } = await import('next/navigation')
    redirect('/admin/login')
  }
}

```


========================================
FILE: src/lib/n8n.ts
========================================
```
import { db } from './db'
import { createHmac } from 'crypto'

/**
 * Trigger the n8n webhook for a confirmed order.
 * Sends order details to n8n, which then:
 * 1. Sends Telegram message to business owner
 * 2. Creates Google Calendar event
 * 3. Sends HTML invoice email to customer
 *
 * Uses HMAC signature for security (prevents forged requests).
 * If N8N_WEBHOOK_URL is not set, logs and skips (useful in development).
 */
export async function triggerOrderConfirmedWebhook(bookingId: string): Promise<void> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET

  // If n8n is not configured, log and skip (useful in development)
  if (!webhookUrl) {
    console.warn('[n8n] Webhook URL not configured, skipping for booking:', bookingId)
    return
  }

  // 1. Fetch full booking details
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: {
      product: {
        include: { category: true },
      },
    },
  })

  if (!booking) {
    throw new Error(`Booking not found: ${bookingId}`)
  }

  // 2. Build payload
  const payload = {
    event: 'order.confirmed',
    timestamp: new Date().toISOString(),
    booking: {
      id: booking.id,
      status: booking.status,
      startDate: booking.startDate.toISOString(),
      endDate: booking.endDate.toISOString(),
      totalAmount: booking.totalAmount,
      currency: booking.currency,
      createdAt: booking.createdAt.toISOString(),
    },
    customer: {
      name: booking.customerName,
      phone: booking.customerPhone,
      email: booking.customerEmail,
    },
    product: {
      id: booking.product.id,
      slug: booking.product.slug,
      nameAr: booking.product.nameAr,
      nameEn: booking.product.nameEn,
      rentalPricePerDay: booking.product.rentalPricePerDay,
      securityDeposit: booking.product.securityDeposit,
      categoryAr: booking.product.category.nameAr,
      categoryEn: booking.product.category.nameEn,
    },
  }

  // 3. Compute HMAC signature (security rule #3 — sign the body before sending)
  // n8n will verify this signature on its end
  const body = JSON.stringify(payload)
  const signature = webhookSecret
    ? createHmac('sha256', webhookSecret).update(body).digest('hex')
    : null

  // 4. Send webhook with timeout (security rule #21 — timeout for external requests)
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10000) // 10s timeout

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Order-Id': bookingId,
      'X-Event': 'order.confirmed',
    }

    if (signature) {
      headers['X-Signature-256'] = `sha256=${signature}`
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body,
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`n8n webhook failed: ${response.status} ${response.statusText}`)
    }

    console.warn('[n8n] Webhook sent successfully for booking:', bookingId)

    // Log success
    await db.securityLog.create({
      data: {
        event: 'n8n_webhook_sent',
        details: JSON.stringify({
          bookingId,
          webhookUrl,
          responseStatus: response.status,
        }),
      },
    })
  } finally {
    clearTimeout(timeout)
  }
}

```


========================================
FILE: src/lib/admin-stats.ts
========================================
```
import { db } from './db'

export interface AdminStats {
  totalProducts: number
  pendingBookings: number
  confirmedBookings: number
  monthlyRevenue: number
  recentBookings: Array<{
    id: string
    customerName: string
    customerPhone: string
    startDate: Date
    endDate: Date
    status: string
    totalAmount: number
    product: {
      id: string
      nameAr: string
      nameEn: string
      slug: string
    }
  }>
  lowStockProducts: Array<{
    id: string
    nameAr: string
    nameEn: string
    slug: string
    stock: number
  }>
}

export async function getAdminStats(): Promise<AdminStats> {
  const [
    totalProducts,
    pendingBookings,
    confirmedBookings,
    recentBookings,
    lowStockProducts,
    monthlyRevenue,
  ] = await Promise.all([
    db.product.count({ where: { isActive: true } }),
    db.booking.count({ where: { status: 'PENDING' } }),
    db.booking.count({ where: { status: 'CONFIRMED' } }),
    db.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: { id: true, nameAr: true, nameEn: true, slug: true },
        },
      },
    }),
    db.product.findMany({
      where: { stock: { lte: 2 }, isActive: true },
      take: 5,
      select: { id: true, nameAr: true, nameEn: true, slug: true, stock: true },
    }),
    db.booking.aggregate({
      where: {
        status: 'CONFIRMED',
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
      _sum: { totalAmount: true },
    }),
  ])

  return {
    totalProducts,
    pendingBookings,
    confirmedBookings,
    recentBookings,
    lowStockProducts,
    monthlyRevenue: monthlyRevenue._sum.totalAmount || 0,
  }
}

```


========================================
FILE: src/lib/content.ts
========================================
```
import fs from 'fs/promises'
import path from 'path'

/**
 * Read a markdown content file for the given locale and page name.
 * Falls back to Arabic if the requested locale file doesn't exist.
 */
export async function getContent(
  locale: string,
  page: 'about' | 'terms' | 'privacy' | 'refund'
): Promise<string> {
  const basePath = path.join(process.cwd(), 'content')
  const localeDir = locale === 'en' ? 'en' : 'ar'
  const filePath = path.join(basePath, localeDir, `${page}.md`)

  try {
    return await fs.readFile(filePath, 'utf-8')
  } catch {
    // Fallback to Arabic
    const fallbackPath = path.join(basePath, 'ar', `${page}.md`)
    return await fs.readFile(fallbackPath, 'utf-8')
  }
}

```


========================================
FILE: src/lib/db.ts
========================================
```
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

```


========================================
FILE: messages/ar.json
========================================
```
{
  "nav": {
    "home": "الرئيسية",
    "products": "المنتجات",
    "about": "من نحن",
    "contact": "تواصل"
  },
  "brand": {
    "lut": "Last Unique Touch",
    "lalounge": "La Lounge",
    "birthday": "Your Birthday"
  },
  "hero": {
    "title": "أناقة تُلهم",
    "titleAccent": "أحداثك",
    "subtitle": "منصة فاخرة لتأجير الأثاث ومعدات الأيفنتات في الكويت",
    "ctaPrimary": "تصفّح المنتجات",
    "ctaSecondary": "تعرّف علينا",
    "stat": "+500 منتج فاخر"
  },
  "brandSelector": {
    "title": "اختر تجربتك",
    "subtitle": "ثلاث علامات، رحلة واحدة",
    "lut": {
      "name": "Last Unique Touch",
      "desc": "تأجير الأثاث ومعدات الأيفنتات"
    },
    "lalounge": {
      "name": "La Lounge",
      "desc": "المعارض، التأجير والصناعة",
      "comingSoon": "قريباً"
    },
    "birthday": {
      "name": "Your Birthday",
      "desc": "حفلات أعياد الميلاد",
      "comingSoon": "قريباً"
    }
  },
  "featured": {
    "title": "منتجات مختارة",
    "viewAll": "عرض الكل",
    "perDay": "د.ك / يوم"
  },
  "whyUs": {
    "title": "لماذا Last Unique Touch؟",
    "items": {
      "luxury": {
        "title": "تشكيلة فاخرة",
        "desc": "أكثر من 500 منتج فاخر بعناية منتقى"
      },
      "flexible": {
        "title": "حجز مرن",
        "desc": "احجز باليوم أو بالأسبوع حسب احتياجك"
      },
      "delivery": {
        "title": "توصيل سريع",
        "desc": "توصيل وتركيب احترافي لبعض المواقع"
      },
      "3d": {
        "title": "عرض ثلاثي الأبعاد",
        "desc": "شاهد المنتجات من كل الزوايا قبل الحجز"
      }
    }
  },
  "cta": {
    "title": "جاهز لتجهيز حدثك القادم؟",
    "subtitle": "تصفّح مجموعتنا الفاخرة وابدأ الحجز الآن",
    "primary": "ابدأ الآن",
    "secondary": "تواصل معنا"
  },
  "footer": {
    "tagline": "منصة تأجير الأثاث ومعدات الأيفنتات الفاخرة",
    "quickLinks": "روابط سريعة",
    "sisterBrands": "العلامات الشقيقة",
    "contact": "تواصل",
    "phone": "+965 1234 5678",
    "email": "info@lastuniquetouch.com",
    "address": "الكويت",
    "rights": "© 2026 Last Unique Touch. جميع الحقوق محفوظة.",
    "terms": "الشروط والأحكام",
    "privacy": "سياسة الخصوصية",
    "refund": "سياسة الاسترجاع"
  },
  "common": {
    "loading": "جارٍ التحميل...",
    "error": "حدث خطأ",
    "retry": "إعادة المحاولة",
    "notFound": "الصفحة غير موجودة",
    "comingSoon": "قريباً",
    "phaseLabel": "المرحلة {phase} — التأسيس مكتمل",
    "noImage": "لا توجد صورة"
  },
  "a11y": {
    "skipToContent": "تخطّي إلى المحتوى الرئيسي"
  },
  "error": {
    "title": "حدث خطأ ما",
    "subtitle": "نعتذر — حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
    "errorId": "معرّف الخطأ",
    "retry": "إعادة المحاولة"
  },
  "products": {
    "title": "المنتجات",
    "subtitle": "اكتشف مجموعتنا الفاخرة من الأثاث ومعدات الأيفنتات",
    "searchPlaceholder": "ابحث عن منتج...",
    "allCategories": "كل الفئات",
    "sort": {
      "label": "ترتيب حسب",
      "newest": "الأحدث",
      "price-asc": "السعر: من الأقل للأعلى",
      "price-desc": "السعر: من الأعلى للأقل"
    },
    "resultCount": "{count, plural, =0 {لا توجد منتجات} =1 {منتج واحد} =2 {منتجان} few {# منتجات} many {# منتجاً} other {# منتج}}",
    "perDay": "د.ك / يوم",
    "badge3d": "عرض ثلاثي الأبعاد",
    "outOfStock": "غير متاح حالياً",
    "previous": "السابق",
    "next": "التالي",
    "page": "صفحة",
    "empty": {
      "title": "لا توجد منتجات مطابقة",
      "subtitle": "جرّب تعديل الفلاتر أو البحث بكلمة أخرى",
      "clearFilters": "مسح الفلاتر"
    },
    "comingPhase": "المرحلة 3"
  },
  "product": {
    "breadcrumbs": {
      "home": "الرئيسية",
      "products": "المنتجات",
      "category": "الفئة"
    },
    "category": "الفئة",
    "perDay": "د.ك / يوم",
    "securityDeposit": "+ {amount} د.ك تأمين (يُسترجع)",
    "description": "الوصف",
    "rental": {
      "title": "اختر فترة الإيجار",
      "startDate": "تاريخ البداية",
      "endDate": "تاريخ النهاية",
      "checking": "جارٍ الفحص...",
      "available": "متاح للفترة المختارة",
      "unavailable": "غير متاح — يوجد حجز متداخل",
      "selectDates": "اختر التواريخ للتحقق من التوافر"
    },
    "quantity": {
      "label": "الكمية",
      "decrease": "إنقاص",
      "increase": "زيادة"
    },
    "priceSummary": {
      "title": "ملخص السعر",
      "days": "عدد الأيام: {count}",
      "rental": "الإيجار ({rate} × {days} × {qty}): {amount} د.ك",
      "deposit": "التأمين: {amount} د.ك",
      "total": "الإجمالي: {amount} د.ك"
    },
    "addToCart": "أضف للسلة",
    "outOfStock": "غير متاح حالياً",
    "addedToCart": "تمت الإضافة للسلة",
    "viewCart": "عرض السلة",
    "3d": {
      "enable": "عرض ثلاثي الأبعاد",
      "disable": "إخفاء",
      "title": "عرض ثلاثي الأبعاد",
      "hint": "اسحب للتدوير، عجلة الماوس للتكبير"
    },
    "related": "منتجات ذات صلة",
    "trustBadges": {
      "delivery": "توصيل وتركيب احترافي",
      "insurance": "تأمين مشمول",
      "refund": "استرجاع التأمين بعد الإرجاع",
      "quality": "منتجات فاخرة منتقاة"
    }
  },
  "admin": {
    "title": "لوحة التحكم",
    "comingPhase": "المرحلة 8",
    "login": {
      "title": "تسجيل الدخول",
      "password": "كلمة المرور",
      "submit": "دخول",
      "invalid": "كلمة المرور غير صحيحة",
      "devHint": "في التطوير، استخدم كلمة المرور \"dev\""
    },
    "nav": {
      "dashboard": "لوحة القيادة",
      "products": "المنتجات",
      "categories": "الفئات",
      "bookings": "الحجوزات",
      "logout": "تسجيل الخروج",
      "viewSite": "عرض الموقع"
    },
    "dashboard": {
      "title": "لوحة القيادة",
      "stats": {
        "totalProducts": "إجمالي المنتجات",
        "pendingBookings": "حجوزات معلّقة",
        "confirmedBookings": "حجوزات مؤكدة",
        "monthlyRevenue": "الإيرادات (هذا الشهر)"
      },
      "recentBookings": "أحدث الحجوزات",
      "lowStock": "منتجات منخفضة المخزون",
      "viewAll": "عرض الكل"
    },
    "products": {
      "title": "المنتجات",
      "add": "إضافة منتج",
      "edit": "تعديل",
      "delete": "حذف",
      "search": "بحث...",
      "filterCategory": "كل الفئات",
      "filterStatus": "كل الحالات",
      "active": "نشط",
      "inactive": "غير نشط",
      "stock": "المخزون",
      "price": "السعر/يوم",
      "actions": "إجراءات",
      "form": {
        "titleNew": "إضافة منتج جديد",
        "titleEdit": "تعديل المنتج",
        "nameAr": "الاسم (عربي)",
        "nameEn": "الاسم (إنجليزي)",
        "descriptionAr": "الوصف (عربي)",
        "descriptionEn": "الوصف (إنجليزي)",
        "category": "الفئة",
        "rentalPrice": "سعر الإيجار/اليوم",
        "securityDeposit": "التأمين",
        "stock": "المخزون",
        "images": "صور (URLs)",
        "addImage": "إضافة صورة",
        "model3dUrl": "URL نموذج 3D (اختياري)",
        "isActive": "نشط",
        "slug": "Slug",
        "submit": "حفظ",
        "cancel": "إلغاء"
      },
      "deleted": "تم حذف المنتج",
      "saved": "تم حفظ المنتج",
      "confirmDelete": "هل أنت متأكد من حذف \"{name}\"؟"
    },
    "categories": {
      "title": "الفئات",
      "add": "إضافة فئة",
      "nameAr": "الاسم (عربي)",
      "nameEn": "الاسم (إنجليزي)",
      "slug": "Slug",
      "productCount": "عدد المنتجات",
      "actions": "إجراءات",
      "cannotDelete": "لا يمكن حذف فئة تحتوي على منتجات",
      "saved": "تم حفظ الفئة",
      "deleted": "تم حذف الفئة"
    },
    "bookings": {
      "title": "الحجوزات",
      "filterStatus": {
        "all": "الكل",
        "PENDING": "معلّق",
        "CONFIRMED": "مؤكد",
        "CANCELLED": "ملغي",
        "COMPLETED": "مكتمل"
      },
      "table": {
        "id": "رقم الحجز",
        "customer": "الزبون",
        "product": "المنتج",
        "period": "فترة الإيجار",
        "total": "الإجمالي",
        "status": "الحالة",
        "actions": "إجراءات"
      },
      "detail": {
        "title": "تفاصيل الحجز",
        "customerInfo": "بيانات الزبون",
        "name": "الاسم",
        "phone": "الهاتف",
        "email": "البريد",
        "address": "العنوان",
        "city": "المدينة",
        "notes": "ملاحظات",
        "productInfo": "بيانات المنتج",
        "product": "المنتج",
        "rentalInfo": "بيانات الإيجار",
        "startDate": "تاريخ البداية",
        "endDate": "تاريخ النهاية",
        "days": "عدد الأيام",
        "financialSummary": "الملخص المالي",
        "rental": "الإيجار",
        "deposit": "التأمين",
        "total": "الإجمالي",
        "changeStatus": "تغيير الحالة",
        "confirm": "تأكيد",
        "cancel": "إلغاء",
        "complete": "إكمال"
      },
      "statusChanged": "تم تغيير حالة الحجز",
      "invalidTransition": "لا يمكن تغيير الحالة بهذا الشكل"
    },
    "common": {
      "save": "حفظ",
      "cancel": "إلغاء",
      "delete": "حذف",
      "edit": "تعديل",
      "view": "عرض",
      "confirm": "تأكيد",
      "back": "رجوع",
      "loading": "جارٍ التحميل...",
      "noData": "لا توجد بيانات",
      "error": "حدث خطأ"
    },
    "errors": {
      "invalid_input": "بيانات غير صالحة",
      "slug_exists": "الـ Slug مستخدم مسبقاً",
      "not_found": "غير موجود",
      "internal_error": "حدث خطأ — يرجى المحاولة لاحقاً",
      "unauthorized": "غير مصرّح"
    }
  },
  "cart": {
    "title": "سلة التسوق",
    "empty": {
      "title": "سلتك فارغة",
      "subtitle": "ابدأ بإضافة منتجاتك المفضلة",
      "cta": "تصفّح المنتجات"
    },
    "item": {
      "period": "من {start} إلى {end} ({days} يوم)",
      "perDay": "د.ك / يوم",
      "remove": "حذف",
      "quantity": "الكمية"
    },
    "summary": {
      "title": "ملخص الطلب",
      "rental": "إجمالي الإيجار",
      "deposit": "إجمالي التأمين",
      "total": "الإجمالي النهائي"
    },
    "continueShopping": "متابعة التسوق",
    "checkout": "إتمام الطلب"
  },
  "checkout": {
    "title": "إتمام الطلب",
    "form": {
      "customerInfo": "بيانات الزبون",
      "name": "الاسم الكامل",
      "phone": "رقم الهاتف",
      "email": "البريد الإلكتروني",
      "address": "العنوان",
      "city": "المدينة",
      "notes": "ملاحظات (اختياري)",
      "submit": "تأكيد الطلب",
      "submitting": "جارٍ تأكيد الطلب..."
    },
    "summary": {
      "title": "ملخص طلبك",
      "availabilityNote": "سيتم تأكيد التوافر قبل المعالجة",
      "total": "الإجمالي"
    },
    "errors": {
      "invalid_input": "بيانات غير صالحة",
      "duplicate_request": "تم استلام هذا الطلب مسبقاً",
      "invalid_products": "بعض المنتجات غير صالحة",
      "price_mismatch": "أسعار المنتجات تغيّرت — يرجى تحديث السلة",
      "insufficient_stock": "لا توجد كمية كافية لأحد المنتجات",
      "not_available": "أحد المنتجات لم يعد متاحاً في الفترة المختارة",
      "internal_error": "حدث خطأ — يرجى المحاولة لاحقاً"
    },
    "empty": "لا يمكن إتمام الطلب بسلة فارغة",
    "success": {
      "title": "تم استلام طلبك بنجاح!",
      "orderId": "رقم الطلب: #{id}",
      "subtitle": "سنتواصل معك قريباً عبر الهاتف أو البريد الإلكتروني لتأكيد التفاصيل",
      "nextSteps": {
        "title": "ماذا يحدث بعد ذلك؟",
        "step1": "نتلقى طلبك ونراجعه",
        "step2": "نتصل بك لتأكيد التفاصيل والدفع",
        "step3": "نجهّز منتجاتك للتسليم في الوقت المحدد",
        "step4": "أُرسل لك بريد إلكتروني بفاتورة طلبك",
        "step5": "تمت إضافة تذكير بتاريخ الحدث إلى تقويمنا"
      },
      "goHome": "العودة للرئيسية",
      "browseMore": "تصفّح منتجات أخرى"
    }
  },
  "payment": {
    "title": "الدفع الآمن",
    "orderSummary": "ملخص الطلب",
    "orderId": "رقم الطلب: #{id}",
    "total": "الإجمالي: {amount} د.ك",
    "displayNote": "هذه واجهة عرض فقط — سيتم توجيهك لبوابة الدفع الرسمية",
    "form": {
      "cardNumber": "رقم البطاقة",
      "cardName": "الاسم على البطاقة",
      "expiry": "تاريخ الانتهاء",
      "cvv": "CVV",
      "saveCard": "حفظ البطاقة للاستخدام لاحقاً",
      "submit": "ادفع {amount} د.ك",
      "processing": "جارٍ معالجة الدفع..."
    },
    "trust": {
      "ssl": "دفع آمن SSL",
      "fraud": "حماية ضد الاحتيال",
      "cards": "Visa / Mastercard مقبولة"
    },
    "errors": {
      "invalid_card": "رقم البطاقة غير صالح",
      "invalid_expiry": "تاريخ الانتهاء غير صالح",
      "invalid_cvv": "CVV غير صالح",
      "payment_failed": "فشل الدفع — يرجى المحاولة مرة أخرى",
      "order_not_found": "الطلب غير موجود"
    },
    "backToCart": "العودة للسلة"
  },
  "about": {
    "title": "من نحن",
    "subtitle": "نتعرّف على Last Unique Touch — قصة شغفنا بالأحداث الفاخرة",
    "values": {
      "title": "رؤيتنا وقيمنا",
      "quality": {
        "title": "الجودة أولاً",
        "desc": "ننتقي كل قطعة بعناية فائقة"
      },
      "transparency": {
        "title": "الشفافية التامة",
        "desc": "أسعار واضحة، لا مفاجآت"
      },
      "speed": {
        "title": "السرعة والمرونة",
        "desc": "حجز سريع، تأجير مرن"
      },
      "luxury": {
        "title": "الفخامة العصرية",
        "desc": "تصاميم عصرية بلمسة فاخرة"
      }
    },
    "stats": {
      "title": "أرقام تعبّر عنّا",
      "products": "+500 منتج فاخر",
      "clients": "+1000 عميل سعيد",
      "events": "+2000 حدث ناجح",
      "years": "5 سنوات من الخبرة"
    },
    "cta": {
      "title": "جاهز لتجهيز حدثك القادم؟",
      "button": "تصفّح المنتجات"
    }
  },
  "terms": {
    "title": "الشروط والأحكام",
    "subtitle": "يرجى قراءة هذه الشروط بعناية قبل استخدام خدماتنا",
    "lastUpdated": "آخر تحديث: يونيو 2026"
  },
  "privacy": {
    "title": "سياسة الخصوصية",
    "subtitle": "نلتزم بحماية خصوصيتك وبياناتك الشخصية",
    "lastUpdated": "آخر تحديث: يونيو 2026"
  },
  "refund": {
    "title": "سياسة الاسترجاع",
    "subtitle": "تفاصيل شروط الإلغاء والاسترجاع والتأمين",
    "lastUpdated": "آخر تحديث: يونيو 2026"
  },
  "contact": {
    "title": "تواصل معنا",
    "subtitle": "نحن هنا لمساعدتك — تواصل معنا في أي وقت",
    "form": {
      "name": "الاسم الكامل",
      "email": "البريد الإلكتروني",
      "phone": "رقم الهاتف (اختياري)",
      "subject": "الموضوع",
      "message": "الرسالة",
      "submit": "إرسال",
      "submitting": "جارٍ الإرسال...",
      "success": "تم إرسال رسالتك بنجاح! سنرد عليك قريباً."
    },
    "info": {
      "address": "العنوان",
      "addressValue": "الكويت - الكويت",
      "phone": "الهاتف",
      "phoneValue": "+965 1234 5678",
      "email": "البريد الإلكتروني",
      "emailValue": "info@lastuniquetouch.com",
      "hours": "ساعات العمل",
      "hoursValue": "السبت - الخميس: 9 ص - 9 م",
      "whatsapp": "واتساب",
      "instagram": "إنستغرام"
    }
  }
}

```


========================================
FILE: messages/en.json
========================================
```
{
  "nav": {
    "home": "Home",
    "products": "Products",
    "about": "About",
    "contact": "Contact"
  },
  "brand": {
    "lut": "Last Unique Touch",
    "lalounge": "La Lounge",
    "birthday": "Your Birthday"
  },
  "hero": {
    "title": "Elegance that",
    "titleAccent": "inspires",
    "subtitle": "A luxury platform for furniture and event equipment rental in Kuwait",
    "ctaPrimary": "Browse Products",
    "ctaSecondary": "About Us",
    "stat": "+500 luxury items"
  },
  "brandSelector": {
    "title": "Choose Your Experience",
    "subtitle": "Three brands, one journey",
    "lut": {
      "name": "Last Unique Touch",
      "desc": "Furniture & event equipment rental"
    },
    "lalounge": {
      "name": "La Lounge",
      "desc": "Exhibitions, rental & manufacturing",
      "comingSoon": "Coming soon"
    },
    "birthday": {
      "name": "Your Birthday",
      "desc": "Birthday celebrations",
      "comingSoon": "Coming soon"
    }
  },
  "featured": {
    "title": "Featured Products",
    "viewAll": "View All",
    "perDay": "KWD / day"
  },
  "whyUs": {
    "title": "Why Last Unique Touch?",
    "items": {
      "luxury": {
        "title": "Luxury Selection",
        "desc": "500+ carefully curated luxury items"
      },
      "flexible": {
        "title": "Flexible Booking",
        "desc": "Book by day or week as you need"
      },
      "delivery": {
        "title": "Fast Delivery",
        "desc": "Professional delivery and setup"
      },
      "3d": {
        "title": "3D Preview",
        "desc": "View products from every angle before booking"
      }
    }
  },
  "cta": {
    "title": "Ready for your next event?",
    "subtitle": "Browse our luxury collection and book now",
    "primary": "Get Started",
    "secondary": "Contact Us"
  },
  "footer": {
    "tagline": "A luxury platform for furniture and event equipment rental",
    "quickLinks": "Quick Links",
    "sisterBrands": "Sister Brands",
    "contact": "Contact",
    "phone": "+965 1234 5678",
    "email": "info@lastuniquetouch.com",
    "address": "Kuwait",
    "rights": "© 2026 Last Unique Touch. All rights reserved.",
    "terms": "Terms & Conditions",
    "privacy": "Privacy Policy",
    "refund": "Refund Policy"
  },
  "common": {
    "loading": "Loading...",
    "error": "An error occurred",
    "retry": "Try again",
    "notFound": "Page not found",
    "comingSoon": "Coming soon",
    "phaseLabel": "Phase {phase} — Foundation complete",
    "noImage": "No image"
  },
  "a11y": {
    "skipToContent": "Skip to main content"
  },
  "error": {
    "title": "Something went wrong",
    "subtitle": "We apologize — an unexpected error occurred. Please try again.",
    "errorId": "Error ID",
    "retry": "Try again"
  },
  "products": {
    "title": "Products",
    "subtitle": "Discover our luxury collection of furniture and event equipment",
    "searchPlaceholder": "Search for a product...",
    "allCategories": "All Categories",
    "sort": {
      "label": "Sort by",
      "newest": "Newest",
      "price-asc": "Price: Low to High",
      "price-desc": "Price: High to Low"
    },
    "resultCount": "{count, plural, =0 {No products} =1 {1 product} other {# products}}",
    "perDay": "KWD / day",
    "badge3d": "3D Preview",
    "outOfStock": "Out of stock",
    "previous": "Previous",
    "next": "Next",
    "page": "Page",
    "empty": {
      "title": "No matching products found",
      "subtitle": "Try adjusting filters or searching for something else",
      "clearFilters": "Clear Filters"
    },
    "comingPhase": "Phase 3"
  },
  "product": {
    "breadcrumbs": {
      "home": "Home",
      "products": "Products",
      "category": "Category"
    },
    "category": "Category",
    "perDay": "KWD / day",
    "securityDeposit": "+ {amount} KWD deposit (refundable)",
    "description": "Description",
    "rental": {
      "title": "Select Rental Period",
      "startDate": "Start Date",
      "endDate": "End Date",
      "checking": "Checking...",
      "available": "Available for selected period",
      "unavailable": "Unavailable — overlapping booking exists",
      "selectDates": "Select dates to check availability"
    },
    "quantity": {
      "label": "Quantity",
      "decrease": "Decrease",
      "increase": "Increase"
    },
    "priceSummary": {
      "title": "Price Summary",
      "days": "Number of days: {count}",
      "rental": "Rental ({rate} × {days} × {qty}): {amount} KWD",
      "deposit": "Deposit: {amount} KWD",
      "total": "Total: {amount} KWD"
    },
    "addToCart": "Add to Cart",
    "outOfStock": "Out of stock",
    "addedToCart": "Added to cart",
    "viewCart": "View Cart",
    "3d": {
      "enable": "View 3D",
      "disable": "Hide",
      "title": "3D Preview",
      "hint": "Drag to rotate, scroll to zoom"
    },
    "related": "Related Products",
    "trustBadges": {
      "delivery": "Professional delivery & setup",
      "insurance": "Insurance included",
      "refund": "Deposit refund after return",
      "quality": "Curated luxury items"
    }
  },
  "admin": {
    "title": "Dashboard",
    "comingPhase": "Phase 8",
    "login": {
      "title": "Login",
      "password": "Password",
      "submit": "Login",
      "invalid": "Invalid password",
      "devHint": "In development, use password \"dev\""
    },
    "nav": {
      "dashboard": "Dashboard",
      "products": "Products",
      "categories": "Categories",
      "bookings": "Bookings",
      "logout": "Logout",
      "viewSite": "View Site"
    },
    "dashboard": {
      "title": "Dashboard",
      "stats": {
        "totalProducts": "Total Products",
        "pendingBookings": "Pending Bookings",
        "confirmedBookings": "Confirmed Bookings",
        "monthlyRevenue": "Monthly Revenue"
      },
      "recentBookings": "Recent Bookings",
      "lowStock": "Low Stock Products",
      "viewAll": "View All"
    },
    "products": {
      "title": "Products",
      "add": "Add Product",
      "edit": "Edit",
      "delete": "Delete",
      "search": "Search...",
      "filterCategory": "All Categories",
      "filterStatus": "All Statuses",
      "active": "Active",
      "inactive": "Inactive",
      "stock": "Stock",
      "price": "Price/Day",
      "actions": "Actions",
      "form": {
        "titleNew": "Add New Product",
        "titleEdit": "Edit Product",
        "nameAr": "Name (Arabic)",
        "nameEn": "Name (English)",
        "descriptionAr": "Description (Arabic)",
        "descriptionEn": "Description (English)",
        "category": "Category",
        "rentalPrice": "Rental Price/Day",
        "securityDeposit": "Security Deposit",
        "stock": "Stock",
        "images": "Images (URLs)",
        "addImage": "Add Image",
        "model3dUrl": "3D Model URL (optional)",
        "isActive": "Active",
        "slug": "Slug",
        "submit": "Save",
        "cancel": "Cancel"
      },
      "deleted": "Product deleted",
      "saved": "Product saved",
      "confirmDelete": "Are you sure you want to delete \"{name}\"?"
    },
    "categories": {
      "title": "Categories",
      "add": "Add Category",
      "nameAr": "Name (Arabic)",
      "nameEn": "Name (English)",
      "slug": "Slug",
      "productCount": "Product Count",
      "actions": "Actions",
      "cannotDelete": "Cannot delete a category with products",
      "saved": "Category saved",
      "deleted": "Category deleted"
    },
    "bookings": {
      "title": "Bookings",
      "filterStatus": {
        "all": "All",
        "PENDING": "Pending",
        "CONFIRMED": "Confirmed",
        "CANCELLED": "Cancelled",
        "COMPLETED": "Completed"
      },
      "table": {
        "id": "Booking ID",
        "customer": "Customer",
        "product": "Product",
        "period": "Rental Period",
        "total": "Total",
        "status": "Status",
        "actions": "Actions"
      },
      "detail": {
        "title": "Booking Details",
        "customerInfo": "Customer Info",
        "name": "Name",
        "phone": "Phone",
        "email": "Email",
        "address": "Address",
        "city": "City",
        "notes": "Notes",
        "productInfo": "Product Info",
        "product": "Product",
        "rentalInfo": "Rental Info",
        "startDate": "Start Date",
        "endDate": "End Date",
        "days": "Number of Days",
        "financialSummary": "Financial Summary",
        "rental": "Rental",
        "deposit": "Deposit",
        "total": "Total",
        "changeStatus": "Change Status",
        "confirm": "Confirm",
        "cancel": "Cancel",
        "complete": "Complete"
      },
      "statusChanged": "Booking status changed",
      "invalidTransition": "Cannot change status this way"
    },
    "common": {
      "save": "Save",
      "cancel": "Cancel",
      "delete": "Delete",
      "edit": "Edit",
      "view": "View",
      "confirm": "Confirm",
      "back": "Back",
      "loading": "Loading...",
      "noData": "No data",
      "error": "An error occurred"
    },
    "errors": {
      "invalid_input": "Invalid input",
      "slug_exists": "Slug already exists",
      "not_found": "Not found",
      "internal_error": "An error occurred — please try again later",
      "unauthorized": "Unauthorized"
    }
  },
  "cart": {
    "title": "Shopping Cart",
    "empty": {
      "title": "Your cart is empty",
      "subtitle": "Start adding your favorite products",
      "cta": "Browse Products"
    },
    "item": {
      "period": "From {start} to {end} ({days} days)",
      "perDay": "KWD / day",
      "remove": "Remove",
      "quantity": "Quantity"
    },
    "summary": {
      "title": "Order Summary",
      "rental": "Rental Total",
      "deposit": "Deposit Total",
      "total": "Grand Total"
    },
    "continueShopping": "Continue Shopping",
    "checkout": "Checkout"
  },
  "checkout": {
    "title": "Checkout",
    "form": {
      "customerInfo": "Customer Information",
      "name": "Full Name",
      "phone": "Phone Number",
      "email": "Email Address",
      "address": "Address",
      "city": "City",
      "notes": "Notes (optional)",
      "submit": "Confirm Order",
      "submitting": "Confirming order..."
    },
    "summary": {
      "title": "Your Order Summary",
      "availabilityNote": "Availability will be confirmed before processing",
      "total": "Total"
    },
    "errors": {
      "invalid_input": "Invalid input data",
      "duplicate_request": "This order has already been received",
      "invalid_products": "Some products are invalid",
      "price_mismatch": "Product prices have changed — please update your cart",
      "insufficient_stock": "Insufficient stock for one of the products",
      "not_available": "One of the products is no longer available for the selected period",
      "internal_error": "An error occurred — please try again later"
    },
    "empty": "Cannot checkout with an empty cart",
    "success": {
      "title": "Your order has been received!",
      "orderId": "Order ID: #{id}",
      "subtitle": "We will contact you soon via phone or email to confirm the details",
      "nextSteps": {
        "title": "What happens next?",
        "step1": "We receive and review your order",
        "step2": "We call you to confirm details and payment",
        "step3": "We prepare your products for delivery on time",
        "step4": "An email with your invoice has been sent",
        "step5": "A reminder for your event date has been added to our calendar"
      },
      "goHome": "Back to Home",
      "browseMore": "Browse More Products"
    }
  },
  "payment": {
    "title": "Secure Payment",
    "orderSummary": "Order Summary",
    "orderId": "Order ID: #{id}",
    "total": "Total: {amount} KWD",
    "displayNote": "This is a display interface — you will be redirected to the official payment gateway",
    "form": {
      "cardNumber": "Card Number",
      "cardName": "Name on Card",
      "expiry": "Expiry Date",
      "cvv": "CVV",
      "saveCard": "Save card for future use",
      "submit": "Pay {amount} KWD",
      "processing": "Processing payment..."
    },
    "trust": {
      "ssl": "SSL Secure Payment",
      "fraud": "Fraud Protection",
      "cards": "Visa / Mastercard Accepted"
    },
    "errors": {
      "invalid_card": "Invalid card number",
      "invalid_expiry": "Invalid expiry date",
      "invalid_cvv": "Invalid CVV",
      "payment_failed": "Payment failed — please try again",
      "order_not_found": "Order not found"
    },
    "backToCart": "Back to Cart"
  },
  "about": {
    "title": "About Us",
    "subtitle": "Meet Last Unique Touch — our passion for luxury events",
    "values": {
      "title": "Our Vision & Values",
      "quality": {
        "title": "Quality First",
        "desc": "We carefully curate every piece"
      },
      "transparency": {
        "title": "Full Transparency",
        "desc": "Clear prices, no surprises"
      },
      "speed": {
        "title": "Speed & Flexibility",
        "desc": "Quick booking, flexible rental"
      },
      "luxury": {
        "title": "Modern Luxury",
        "desc": "Modern designs with a luxurious touch"
      }
    },
    "stats": {
      "title": "Numbers That Speak",
      "products": "+500 Luxury Products",
      "clients": "+1000 Happy Clients",
      "events": "+2000 Successful Events",
      "years": "5 Years of Experience"
    },
    "cta": {
      "title": "Ready for your next event?",
      "button": "Browse Products"
    }
  },
  "terms": {
    "title": "Terms & Conditions",
    "subtitle": "Please read these terms carefully before using our services",
    "lastUpdated": "Last updated: June 2026"
  },
  "privacy": {
    "title": "Privacy Policy",
    "subtitle": "We are committed to protecting your privacy and personal data",
    "lastUpdated": "Last updated: June 2026"
  },
  "refund": {
    "title": "Refund Policy",
    "subtitle": "Details of cancellation, refund, and deposit terms",
    "lastUpdated": "Last updated: June 2026"
  },
  "contact": {
    "title": "Contact Us",
    "subtitle": "We're here to help — reach out anytime",
    "form": {
      "name": "Full Name",
      "email": "Email Address",
      "phone": "Phone Number (optional)",
      "subject": "Subject",
      "message": "Message",
      "submit": "Send",
      "submitting": "Sending...",
      "success": "Your message has been sent! We'll reply soon."
    },
    "info": {
      "address": "Address",
      "addressValue": "Kuwait - Kuwait",
      "phone": "Phone",
      "phoneValue": "+965 1234 5678",
      "email": "Email",
      "emailValue": "info@lastuniquetouch.com",
      "hours": "Working Hours",
      "hoursValue": "Sat - Thu: 9 AM - 9 PM",
      "whatsapp": "WhatsApp",
      "instagram": "Instagram"
    }
  }
}

```


========================================
FILE: next.config.ts
========================================
```
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import bundleAnalyzer from '@next/bundle-analyzer'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
}

export default withBundleAnalyzer(withNextIntl(nextConfig))

```


========================================
FILE: tailwind.config.ts
========================================
```
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
    darkMode: "class",
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [tailwindcssAnimate],
};
export default config;

```


========================================
FILE: vitest.config.ts
========================================
```
import { defineConfig } from 'vitest/config'
import path from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    exclude: ['node_modules', '.next'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', '.next/', '**/*.test.*'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

```


========================================
FILE: src/middleware.ts
========================================
```
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}

```


========================================
FILE: src/i18n/routing.ts
========================================
```
import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  locales: ['ar', 'en'],
  defaultLocale: 'ar',
})

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing)

```


========================================
FILE: src/i18n/request.ts
========================================
```
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as 'ar' | 'en')) {
    locale = routing.defaultLocale
  }
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})

```


========================================
FILE: prisma/schema.prisma
========================================
```
// Prisma Schema — Last Unique Touch (Phase 1: Foundation)
// SQLite for local dev — will migrate to PostgreSQL in Phase 10

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// ===== Multi-tenant: Brands =====
// Note: SQLite doesn't support native enums — Prisma stores these as Strings
enum Brand {
  LUT
  LA_LOUNGE
  YOUR_BIRTHDAY
}

// ===== Categories =====
model Category {
  id        String    @id @default(cuid())
  brand     Brand     @default(LUT)
  slug      String    @unique
  nameAr    String
  nameEn    String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  products  Product[]

  @@index([brand, slug])
}

// ===== Products (Rental only — no sales) =====
model Product {
  id                String    @id @default(cuid())
  brand             Brand     @default(LUT)
  slug              String    @unique
  nameAr            String
  nameEn            String
  descriptionAr     String
  descriptionEn     String
  rentalPricePerDay Float
  securityDeposit   Float
  images            String    // JSON array of URLs — SQLite doesn't support String[]
  model3dUrl        String?
  stock             Int       @default(1)
  isActive          Boolean   @default(true)
  categoryId        String
  category          Category  @relation(fields: [categoryId], references: [id])
  bookings          Booking[]
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  @@index([brand, categoryId])
  @@index([brand, isActive])
}

// ===== Bookings =====
enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}

model Booking {
  id            String        @id @default(cuid())
  productId     String
  product       Product       @relation(fields: [productId], references: [id])
  startDate     DateTime
  endDate       DateTime
  status        BookingStatus @default(PENDING)
  customerName  String
  customerPhone String
  customerEmail String
  totalAmount   Float
  currency      String        @default("KWD")
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  @@index([productId, startDate, endDate])
  @@index([status])
}

// ===== Security Event Log =====
model SecurityLog {
  id        String   @id @default(cuid())
  event     String
  ip        String?
  userId    String?
  details   String?
  createdAt DateTime @default(now())

  @@index([event, createdAt])
}

```


========================================
FILE: src/app/[locale]/products/page.tsx
========================================
```
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ProductsFilters } from '@/components/products/products-filters'
import { ProductsPageContent } from '@/components/products/products-page-content'
import { ProductsGridSkeleton } from '@/components/products/products-grid-skeleton'
import { getCategoriesByBrand, getProducts } from '@/lib/products'
import type { ProductSort } from '@/lib/products'
import { buildMetadata } from '@/lib/seo'

interface PageProps {
  searchParams: Promise<{
    category?: string
    q?: string
    sort?: string
    page?: string
  }>
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations()
  return buildMetadata({
    locale: locale as 'ar' | 'en',
    path: '/products',
    title: t('products.title'),
    description: t('products.subtitle'),
  })
}

export default async function ProductsPage({ searchParams, params }: PageProps) {
  const t = await getTranslations()
  await params // consume the promise

  const search = await searchParams

  const categorySlug = search.category || undefined
  const searchQuery = search.q || undefined
  const sort: ProductSort =
    search.sort === 'price-asc' || search.sort === 'price-desc'
      ? search.sort
      : 'newest'
  const page = search.page ? Math.max(1, parseInt(search.page, 10) || 1) : 1

  const [categories, result] = await Promise.all([
    getCategoriesByBrand(),
    getProducts({ categorySlug, search: searchQuery, sort, page }),
  ])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background" id="main-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              {t('products.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('products.subtitle')}
            </p>
          </div>

          {/* Filters */}
          <ProductsFilters
            categories={categories}
            activeCategory={categorySlug}
            search={searchQuery}
            sort={sort}
          />

          {/* Content with suspense */}
          <Suspense fallback={<ProductsGridSkeleton />}>
            <ProductsPageContent
              products={result.products}
              total={result.total}
              page={result.page}
              totalPages={result.totalPages}
              categorySlug={categorySlug}
              search={searchQuery}
              sort={sort}
            />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}

```


========================================
FILE: src/app/[locale]/products/[slug]/page.tsx
========================================
```
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { getProductBySlug, getRelatedProducts } from '@/lib/products'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Breadcrumbs } from '@/components/product/breadcrumbs'
import { ProductGallery } from '@/components/product/product-gallery'
import { Product3DViewer } from '@/components/product/product-3d-viewer'
import { ProductInfo } from '@/components/product/product-info'
import { RelatedProducts } from '@/components/product/related-products'
import { TrustBadges } from '@/components/product/trust-badges'
import { JsonLd } from '@/components/seo/json-ld'
import { buildMetadata } from '@/lib/seo'

interface PageProps {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateStaticParams() {
  const products = await db.product.findMany({
    where: { isActive: true },
    select: { slug: true },
  })
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  const product = await getProductBySlug(slug)
  if (!product) return buildMetadata({ locale: locale as 'ar' | 'en', path: '/products' })

  return buildMetadata({
    locale: locale as 'ar' | 'en',
    path: `/products/${slug}`,
    title: locale === 'ar' ? product.nameAr : product.nameEn,
    description: locale === 'ar' ? product.descriptionAr : product.descriptionEn,
    image: product.images[0],
  })
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params

  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const related = await getRelatedProducts(product.id, product.categoryId)

  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.nameEn,
    description: product.descriptionEn,
    image: product.images,
    sku: product.id,
    brand: { '@type': 'Brand', name: 'Last Unique Touch' },
    category: product.category.nameEn,
    offers: {
      '@type': 'Offer',
      price: product.rentalPricePerDay,
      priceCurrency: 'KWD',
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: product.rentalPricePerDay,
        priceCurrency: 'KWD',
        unitText: 'per day',
      },
    },
  }

  return (
    <>
      <JsonLd data={productLd} />
      <Navbar />
      <main className="min-h-screen bg-background" id="main-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <Breadcrumbs
            categorySlug={product.category.slug}
            categoryNameAr={product.category.nameAr}
            categoryNameEn={product.category.nameEn}
            productName={product.nameAr}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Gallery + 3D */}
            <div>
              <ProductGallery
                images={product.images}
                model3dUrl={product.model3dUrl}
                productName={product.nameAr}
              />
              {product.model3dUrl && (
                <Product3DViewer modelUrl={product.model3dUrl} productSlug={product.slug} />
              )}
            </div>

            {/* Right: Product Info */}
            <div>
              <ProductInfo product={product} />
            </div>
          </div>

          <TrustBadges />

          {related.length > 0 && (
            <RelatedProducts products={related} />
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

```


========================================
FILE: src/app/[locale]/cart/page.tsx
========================================
```
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

```


========================================
FILE: src/app/[locale]/checkout/page.tsx
========================================
```
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { CheckoutView } from '@/components/checkout/checkout-view'

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
          <CheckoutView />
        </div>
      </main>
      <Footer />
    </>
  )
}

```


========================================
FILE: src/app/[locale]/checkout/payment/page.tsx
========================================
```
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

```


========================================
FILE: src/app/[locale]/checkout/success/page.tsx
========================================
```
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
      <main className="min-h-screen bg-background">
        <SuccessView orderId={order} />
      </main>
      <Footer />
    </>
  )
}

```


========================================
FILE: src/app/[locale]/about/page.tsx
========================================
```
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getLocale } from 'next-intl/server'
import { LegalPageWrapper } from '@/components/legal/page-header'
import { LegalContent } from '@/components/legal/legal-content'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Target, Handshake, Zap, Gem } from 'lucide-react'
import { getContent } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations()
  return buildMetadata({
    locale: locale as 'ar' | 'en',
    path: '/about',
    title: t('about.title'),
    description: t('about.subtitle'),
  })
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  await params // consume the promise
  const t = await getTranslations()
  const locale = await getLocale()
  const content = await getContent(locale, 'about')

  const ArrowIcon = locale === 'ar' ? ArrowLeft : ArrowRight

  const values = [
    { icon: Target, title: t('about.values.quality.title'), desc: t('about.values.quality.desc') },
    { icon: Handshake, title: t('about.values.transparency.title'), desc: t('about.values.transparency.desc') },
    { icon: Zap, title: t('about.values.speed.title'), desc: t('about.values.speed.desc') },
    { icon: Gem, title: t('about.values.luxury.title'), desc: t('about.values.luxury.desc') },
  ]

  const stats = [
    { value: '+500', label: t('about.stats.products') },
    { value: '+1000', label: t('about.stats.clients') },
    { value: '+2000', label: t('about.stats.events') },
    { value: '5', label: t('about.stats.years') },
  ]

  return (
    <LegalPageWrapper title={t('about.title')} subtitle={t('about.subtitle')}>
      {/* Story (from markdown) */}
      <LegalContent content={content} />

      {/* Values section */}
      <section className="mt-16 pt-12 border-t border-border">
        <h2 className="text-2xl font-bold text-foreground mb-8">
          {t('about.values.title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, idx) => {
            const Icon = value.icon
            return (
              <div
                key={idx}
                className="p-6 rounded-xl bg-bg-light border border-border"
              >
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Stats section */}
      <section className="mt-16 pt-12 border-t border-border">
        <h2 className="text-2xl font-bold text-foreground mb-8">
          {t('about.stats.title')}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-card border border-border text-center"
            >
              <p className="text-3xl font-bold text-lut mb-2">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16 pt-12 border-t border-border text-center">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {t('about.cta.title')}
        </h2>
        <Button asChild className="bg-lut hover:bg-lut/90 text-white">
          <Link href="/products">
            {t('about.cta.button')}
            <ArrowIcon className="w-4 h-4 ms-2" />
          </Link>
        </Button>
      </section>
    </LegalPageWrapper>
  )
}

```


========================================
FILE: src/app/[locale]/contact/page.tsx
========================================
```
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ContactView } from '@/components/contact/contact-view'

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <ContactView />
      </main>
      <Footer />
    </>
  )
}

```


========================================
FILE: src/app/[locale]/terms/page.tsx
========================================
```
import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'
import { LegalPageWrapper } from '@/components/legal/page-header'
import { LegalContent } from '@/components/legal/legal-content'
import { getContent } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations()
  return buildMetadata({
    locale: locale as 'ar' | 'en',
    path: '/terms',
    title: t('terms.title'),
    description: t('terms.subtitle'),
  })
}

export default async function TermsPage() {
  const t = await getTranslations()
  const locale = await getLocale()
  const content = await getContent(locale, 'terms')

  return (
    <LegalPageWrapper
      title={t('terms.title')}
      subtitle={t('terms.subtitle')}
      lastUpdated={t('terms.lastUpdated')}
    >
      <LegalContent content={content} />
    </LegalPageWrapper>
  )
}

```


========================================
FILE: src/app/[locale]/privacy/page.tsx
========================================
```
import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'
import { LegalPageWrapper } from '@/components/legal/page-header'
import { LegalContent } from '@/components/legal/legal-content'
import { getContent } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations()
  return buildMetadata({
    locale: locale as 'ar' | 'en',
    path: '/privacy',
    title: t('privacy.title'),
    description: t('privacy.subtitle'),
  })
}

export default async function PrivacyPage() {
  const t = await getTranslations()
  const locale = await getLocale()
  const content = await getContent(locale, 'privacy')

  return (
    <LegalPageWrapper
      title={t('privacy.title')}
      subtitle={t('privacy.subtitle')}
      lastUpdated={t('privacy.lastUpdated')}
    >
      <LegalContent content={content} />
    </LegalPageWrapper>
  )
}

```


========================================
FILE: src/app/[locale]/refund/page.tsx
========================================
```
import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'
import { LegalPageWrapper } from '@/components/legal/page-header'
import { LegalContent } from '@/components/legal/legal-content'
import { getContent } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations()
  return buildMetadata({
    locale: locale as 'ar' | 'en',
    path: '/refund',
    title: t('refund.title'),
    description: t('refund.subtitle'),
  })
}

export default async function RefundPage() {
  const t = await getTranslations()
  const locale = await getLocale()
  const content = await getContent(locale, 'refund')

  return (
    <LegalPageWrapper
      title={t('refund.title')}
      subtitle={t('refund.subtitle')}
      lastUpdated={t('refund.lastUpdated')}
    >
      <LegalContent content={content} />
    </LegalPageWrapper>
  )
}

```


========================================
FILE: src/app/api/v1/health/route.ts
========================================
```
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error'
    return NextResponse.json(
      { status: 'error', message },
      { status: 500 }
    )
  }
}

```


========================================
FILE: src/app/api/orders/route.ts
========================================
```
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { checkProductAvailability } from '@/lib/products'

const itemSchema = z.object({
  productId: z.string().min(1),
  slug: z.string().min(1),
  nameAr: z.string(),
  nameEn: z.string(),
  image: z.string(),
  rentalPricePerDay: z.number().positive(),
  securityDeposit: z.number().nonnegative(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  quantity: z.number().int().positive(),
  days: z.number().int().positive(),
  total: z.number().positive(),
})

const customerSchema = z.object({
  customerName: z.string().min(3).max(100),
  customerPhone: z.string().regex(/^\+?[0-9\s-]{8,20}$/),
  customerEmail: z.string().email(),
  address: z.string().min(10).max(500),
  city: z.string().min(2).max(50),
  notes: z.string().max(1000).optional(),
})

const orderSchema = z.object({
  items: z.array(itemSchema).min(1),
  customer: customerSchema,
  idempotencyKey: z.string().min(10),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = orderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'invalid_input', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const { items, customer, idempotencyKey } = parsed.data

    // 1. Idempotency check — prevent duplicate orders
    const existing = await db.securityLog.findFirst({
      where: {
        event: 'order_idempotency',
        details: { contains: idempotencyKey },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'duplicate_request' },
        { status: 409 }
      )
    }

    // 2. Re-verify products and prices on server (security rule #2)
    const productIds = items.map((i) => i.productId)
    const dbProducts = await db.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    })

    if (dbProducts.length !== items.length) {
      return NextResponse.json(
        { error: 'invalid_products' },
        { status: 400 }
      )
    }

    // 3. Re-check availability for each item (security critical)
    for (const item of items) {
      const product = dbProducts.find((p) => p.id === item.productId)
      if (!product) continue

      // Verify price matches DB
      if (Math.abs(product.rentalPricePerDay - item.rentalPricePerDay) > 0.01) {
        return NextResponse.json(
          { error: 'price_mismatch' },
          { status: 400 }
        )
      }

      // Verify stock
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: 'insufficient_stock' },
          { status: 400 }
        )
      }

      // Verify availability
      const startDate = new Date(item.startDate)
      const endDate = new Date(item.endDate)
      const availability = await checkProductAvailability(item.productId, startDate, endDate)

      if (!availability.available) {
        return NextResponse.json(
          { error: 'not_available' },
          { status: 409 }
        )
      }
    }

    // 4. Create bookings in a transaction (security rule #12)
    const result = await db.$transaction(async (tx) => {
      const bookings = []

      for (const item of items) {
        const startDate = new Date(item.startDate)
        const endDate = new Date(item.endDate)

        const booking = await tx.booking.create({
          data: {
            productId: item.productId,
            startDate,
            endDate,
            status: 'PENDING',
            customerName: customer.customerName,
            customerPhone: customer.customerPhone,
            customerEmail: customer.customerEmail,
            totalAmount: item.total,
            currency: 'KWD',
          },
        })

        bookings.push(booking)
      }

      // Log idempotency key
      await tx.securityLog.create({
        data: {
          event: 'order_idempotency',
          details: JSON.stringify({
            idempotencyKey,
            bookingIds: bookings.map((b) => b.id),
          }),
        },
      })

      return bookings
    })

    // 5. Return success with first booking ID as order reference
    const orderId = result[0]?.id

    return NextResponse.json(
      {
        success: true,
        orderId,
        bookingIds: result.map((b) => b.id),
        totalBookings: result.length,
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error'
    console.error('Order creation error:', message, error)
    return NextResponse.json(
      { error: 'internal_error' },
      { status: 500 }
    )
  }
}

```


========================================
FILE: src/app/sitemap.ts
========================================
```
import type { MetadataRoute } from 'next'
import { db } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const now = new Date()

  const staticPages = [
    { path: '', priority: 1, changeFrequency: 'weekly' as const },
    { path: '/products', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/terms', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/refund', priority: 0.5, changeFrequency: 'monthly' as const },
  ]

  const locales = ['ar', 'en']

  // Fetch all active products for dynamic product URLs
  const products = await db.product.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  })

  const staticEntries = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${baseUrl}/${locale}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }))
  )

  const productEntries = locales.flatMap((locale) =>
    products.map((product) => ({
      url: `${baseUrl}/${locale}/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  )

  return [...staticEntries, ...productEntries]
}

```


========================================
FILE: src/app/robots.ts
========================================
```
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/checkout'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

```

