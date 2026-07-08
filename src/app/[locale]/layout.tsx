import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { MotionConfig } from 'framer-motion'
import { routing } from '@/i18n/routing'
import { CartProvider } from '@/components/providers/cart-provider'
import { ToastProvider } from '@/components/providers/toast-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { BrandThemeSetter } from '@/components/providers/brand-theme-setter'
import { FloatingWhatsApp } from '@/components/floating-whatsapp'
import { inter, tajawal, cormorant, dmMono, lutFonts, laLoungeFonts, birthdayFonts } from '@/app/fonts'

/**
 * Resolve the brand slug from the locale segment.
 *
 * V13 Group C9: Removed `headers()` call that forced every route to be
 * dynamically rendered. The `data-brand` attribute is now set client-side
 * by `BrandThemeSetter` (which runs on every navigation). For SSR, we
 * default to 'lut' — the `BrandThemeSetter` corrects it immediately on
 * hydration. This allows ~10 routes to be statically prerendered.
 */
function resolveBrandFromPath(pathname: string | null): 'lut' | 'lalounge' | 'birthday' {
  if (!pathname) return 'lut'
  if (pathname.includes('/la-lounge')) return 'lalounge'
  if (pathname.includes('/your-birthday')) return 'birthday'
  return 'lut'
}

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
  themeColor: '#E3222B',
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

  const t = await getTranslations()

  // V13 Group C9: No more headers() call — default to 'lut' for SSR.
  // BrandThemeSetter corrects data-brand on hydration.
  const brand = resolveBrandFromPath(null)

  return (
    <html
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      data-brand={brand}
      className={[
        // Legacy fonts (still referenced by globals.css body/eyebrow rules).
        inter.variable,
        tajawal.variable,
        cormorant.variable,
        dmMono.variable,
        // New per-brand font sets — all 9 variables exposed on <html>.
        // globals.css `:root[data-brand="X"]` blocks map --font-display /
        // --font-body / --font-arabic to the active brand's set.
        lutFonts.display.variable,
        lutFonts.body.variable,
        lutFonts.arabic.variable,
        laLoungeFonts.display.variable,
        laLoungeFonts.body.variable,
        laLoungeFonts.arabic.variable,
        birthdayFonts.display.variable,
        birthdayFonts.body.variable,
        birthdayFonts.arabic.variable,
      ].join(' ')}
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#E3222B" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        {/* Skip-to-content link (WCAG 2.4.1 / C14) — first focusable element */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:rounded-md focus:shadow-lg"
        >
          {t('a11y.skipToContent')}
        </a>

        <MotionConfig reducedMotion="user">
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
            <NextIntlClientProvider>
              <CartProvider>
                <ToastProvider>
                  <BrandThemeSetter />
                  {/*
                    Centralized <main id="main-content"> so the skip-to-content
                    link works on every route (storefront, admin, etc.) without
                    each page having to remember to render one. Individual pages
                    and AdminShell use plain <div> wrappers for their styling so
                    we don't end up with nested <main> elements (F6).
                  */}
                  <main id="main-content" className="flex-1">
                    {children}
                  </main>
                  <FloatingWhatsApp />
                </ToastProvider>
              </CartProvider>
            </NextIntlClientProvider>
          </ThemeProvider>
        </MotionConfig>
      </body>
    </html>
  )
}
