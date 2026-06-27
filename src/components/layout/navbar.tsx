'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { Menu, X, Globe, ShoppingCart } from 'lucide-react'
import { useCart } from '@/components/providers/cart-provider'

export function Navbar() {
  const t = useTranslations()
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { count, hydrated } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
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
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-bg-dark/95 backdrop-blur-md shadow-lg'
          : 'bg-bg-dark'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl font-bold text-lut">
              {t('brand.lut')}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-lut ${
                  pathname === link.href
                    ? 'text-lut'
                    : 'text-white/80'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side: cart + lang switch + mobile menu */}
          <div className="flex items-center gap-3">
            {/* Cart icon with badge */}
            <Link
              href="/cart"
              className="relative p-2 text-white/80 hover:text-lut transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {hydrated && count > 0 && (
                <span className="absolute -top-0.5 -end-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded-full bg-lut text-white text-[10px] font-bold">
                  {count}
                </span>
              )}
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={switchLocale}
              className="text-white/80 hover:text-lut hover:bg-white/10 gap-1.5"
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-medium hidden sm:inline">
                {locale === 'ar' ? 'EN' : 'عربي'}
              </span>
            </Button>

            {/* Mobile hamburger */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white/80 hover:text-lut hover:bg-white/10"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-bg-dark/98 backdrop-blur-md border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block text-sm font-medium py-2 transition-colors hover:text-lut ${
                  pathname === link.href
                    ? 'text-lut'
                    : 'text-white/80'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
