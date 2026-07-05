'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Instagram, Phone } from 'lucide-react'

export function Footer() {
  const t = useTranslations()

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
                aria-label={t('contact.info.instagram')}
              >
                <Instagram className="w-4 h-4" strokeWidth={1.3} />
              </a>
              <a
                href="https://wa.me/96512345678"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-paper/20 hover:border-gold hover:text-gold transition-all duration-300"
                aria-label={t('contact.info.whatsapp')}
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
              {t('footer.legal')}
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
            {t('footer.rights', { year: new Date().getFullYear() })}
          </p>
          <p className="eyebrow text-paper/30">
            {t('footer.craftedIn')}
          </p>
        </div>
      </div>
    </footer>
  )
}
