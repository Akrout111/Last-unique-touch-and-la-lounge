import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { MotionConfig } from 'framer-motion'
import { routing } from '@/i18n/routing'
import { CartProvider } from '@/components/providers/cart-provider'
import { ToastProvider } from '@/components/providers/toast-provider'
import { BrandThemeSetter } from '@/components/providers/brand-theme-setter'
import { inter, tajawal, cormorant, dmMono, orbitron, rajdhani, cairo } from '@/app/fonts'

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

  const t = await getTranslations()

  return (
    <html
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      data-brand="lut"
      className={`${inter.variable} ${tajawal.variable} ${cormorant.variable} ${dmMono.variable} ${orbitron.variable} ${rajdhani.variable} ${cairo.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#E62129" />
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
          <NextIntlClientProvider>
            <CartProvider>
              <ToastProvider>
                <BrandThemeSetter />
                {children}
              </ToastProvider>
            </CartProvider>
          </NextIntlClientProvider>
        </MotionConfig>
      </body>
    </html>
  )
}
