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
      <nav
        className={`navbar-slide-in fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
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
                scrolled ? 'text-paper' : 'text-ink'
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
                      : scrolled ? 'text-paper/70 hover:text-paper' : 'text-ink/70 hover:text-ink'
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
                  scrolled ? 'text-paper/70 hover:text-gold' : 'text-ink/70 hover:text-gold'
                }`}
                aria-label={t('nav.cart')}
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
                      : 'text-ink/70 hover:text-gold'
                  }`}
                >
                  <Globe className="w-4 h-4" strokeWidth={1.3} />
                  <span>{locale === 'ar' ? 'EN' : 'عربي'}</span>
                </button>
              </MagneticButton>

              {/* Mobile menu button */}
              <button
                className="md:hidden text-paper p-2 min-w-[44px] min-h-[44px]"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={t('nav.menu')}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

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
              initial={{ x: locale === 'ar' ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: locale === 'ar' ? '-100%' : '100%' }}
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
