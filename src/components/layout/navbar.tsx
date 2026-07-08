'use client'

import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useTheme } from 'next-themes'
import { Link, usePathname, useRouter } from '@/i18n/routing'
import { Menu, X, Globe, Moon, Sun } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { MagneticButton } from '@/components/ui-premium/magnetic-button'

type BrandKey = 'lut' | 'lalounge' | 'birthday'

function resolveBrandFromPath(pathname: string | null): BrandKey {
  if (!pathname) return 'lut'
  if (pathname.includes('/la-lounge')) return 'lalounge'
  if (pathname.includes('/your-birthday')) return 'birthday'
  return 'lut'
}

/**
 * Detect if the current route is the home page (`/` or `/ar` or `/en`).
 * On the home page the navbar wordmark is hidden — the home page is the
 * umbrella landing for all 3 brands and should not show any single
 * brand's name (V10 user request).
 */
function isHomePage(pathname: string | null): boolean {
  if (!pathname) return false
  return pathname === '/' || pathname === '/ar' || pathname === '/en'
}

export function Navbar() {
  const t = useTranslations()
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const brand = resolveBrandFromPath(pathname)
  // V11 Fix #7: use `usePathname()` directly (no `mounted` flag) to avoid
  // SSR hydration flash. Next.js 16's `usePathname()` returns the correct
  // path during SSR for client components, so the wordmark is hidden on
  // the home page from the very first paint — no flash.
  const homePage = isHomePage(pathname)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  // Wordmark content per brand:
  // - LUT          → "LUT"          + subtitle "Last Unique Touch" (hidden on mobile)
  // - LA_LOUNGE    → "LA LOUNGE"    (no subtitle)
  // - YOUR_BIRTHDAY→ "Your Birthday"+ subtitle "Kuwait" (hidden on mobile for visual rhythm)
  const wordmark =
    brand === 'lalounge'
      ? { main: t('brand.lalounge'), subtitle: null as string | null }
      : brand === 'birthday'
        ? { main: t('brand.birthday'), subtitle: t('brand.kuwait') }
        : { main: t('brand.lutShort'), subtitle: t('brand.lut') }

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
          <div className="flex items-center justify-between gap-4">
            {/* LEFT: wordmark (hidden on home page) + desktop nav (md+) */}
            <div className="flex items-center gap-8 lg:gap-10 min-w-0">
              {/* Wordmark — links home.
                  On the home page the wordmark is hidden — the home page
                  is the umbrella landing for all 3 brands and should not
                  show any single brand's name. */}
              {!homePage && (
                <Link
                  href="/"
                  className="group flex items-baseline gap-2 min-w-0 shrink-0"
                  aria-label={wordmark.main}
                >
                  <span
                    className="font-display tracking-tight whitespace-nowrap transition-colors duration-300 text-primary text-lg sm:text-xl lg:text-2xl"
                  >
                    {wordmark.main}
                  </span>
                  {wordmark.subtitle && (
                    <span
                      className={`hidden sm:inline text-[10px] lg:text-xs font-sans tracking-[0.2em] uppercase transition-colors duration-300 ${
                        scrolled ? 'text-paper/60' : 'text-paper/60'
                      } group-hover:text-primary`}
                    >
                      {wordmark.subtitle}
                    </span>
                  )}
                </Link>
              )}

              {/* Desktop nav links — visible md+ */}
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
                      className={`absolute -bottom-1.5 start-0 h-px bg-gold transition-all duration-300 ${
                        pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    />
                  </Link>
                ))}
              </div>
            </div>

            {/* RIGHT: theme toggle + language switcher + mobile hamburger */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Theme toggle — client-only, hydration-safe (renders a
                  placeholder until mounted so SSR + first paint match). */}
              {mounted ? (
                <button
                  onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                  aria-label={t('nav.toggleTheme')}
                  className={`flex items-center justify-center w-9 h-9 min-h-[44px] min-w-[44px] rounded-full transition-colors ${
                    scrolled
                      ? 'text-paper/70 hover:text-gold hover:bg-paper/10'
                      : 'text-paper/70 hover:text-gold hover:bg-paper/10'
                  }`}
                >
                  {resolvedTheme === 'dark' ? (
                    <Sun className="size-4" strokeWidth={1.5} />
                  ) : (
                    <Moon className="size-4" strokeWidth={1.5} />
                  )}
                </button>
              ) : (
                <div className="size-9" aria-hidden="true" />
              )}

              <MagneticButton strength={0.2}>
                <button
                  onClick={switchLocale}
                  className={`flex items-center gap-1.5 px-3 py-2 min-h-[44px] text-xs font-medium transition-colors ${
                    scrolled
                      ? 'text-paper/70 hover:text-gold'
                      : 'text-paper/70 hover:text-gold'
                  }`}
                >
                  <Globe className="w-4 h-4" strokeWidth={1.3} />
                  <span>{locale === 'ar' ? 'EN' : 'عربي'}</span>
                </button>
              </MagneticButton>

              {/* Mobile menu button — visible only on mobile */}
              <button
                className="md:hidden text-paper p-2 min-w-[44px] min-h-[44px]"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={t('nav.menu')}
                aria-expanded={mobileOpen}
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
                {/* Wordmark hidden on home page (umbrella landing — no single brand) */}
                {!homePage && (
                  <span className="font-display text-primary text-lg">
                    {wordmark.main}
                  </span>
                )}
                {homePage && <span />}
                <button
                  onClick={() => setMobileOpen(false)}
                  className="text-paper/60 hover:text-paper min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label={t('common.close')}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 p-6 space-y-2">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: locale === 'ar' ? -20 : 20 }}
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
