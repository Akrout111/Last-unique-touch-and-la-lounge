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
