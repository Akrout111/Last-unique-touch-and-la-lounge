import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Instagram, Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  const t = useTranslations()

  return (
    <footer className="bg-bg-dark text-white/80">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold text-lut">
                {t('brand.lut')}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/96512345678"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-gold transition-colors"
                aria-label="WhatsApp"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">
              {t('footer.quickLinks')}
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: '/' as const, label: t('nav.home') },
                { href: '/products' as const, label: t('nav.products') },
                { href: '/about' as const, label: t('nav.about') },
                { href: '/contact' as const, label: t('nav.contact') },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-lut transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Sister Brands */}
          <div>
            <h4 className="font-semibold text-white mb-4">
              {t('footer.sisterBrands')}
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-lut hover:text-lut/80 transition-colors"
                >
                  {t('brandSelector.lut.name')}
                </Link>
              </li>
              <li className="text-sm text-white/40">
                {t('brandSelector.lalounge.name')}{' '}
                <span className="text-xs">({t('brandSelector.lalounge.comingSoon')})</span>
              </li>
              <li className="text-sm text-white/40">
                {t('brandSelector.birthday.name')}{' '}
                <span className="text-xs">({t('brandSelector.birthday.comingSoon')})</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">
              {t('footer.contact')}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm text-white/50">
                <Phone className="w-4 h-4 shrink-0" />
                <span dir="ltr">{t('footer.phone')}</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white/50">
                <Mail className="w-4 h-4 shrink-0" />
                <span>{t('footer.email')}</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white/50">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{t('footer.address')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            {t('footer.rights')}
          </p>
          <div className="flex items-center gap-5">
            <Link href="/terms" className="text-xs text-white/30 hover:text-white/50 transition-colors">
              {t('footer.terms')}
            </Link>
            <Link href="/privacy" className="text-xs text-white/30 hover:text-white/50 transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link href="/refund" className="text-xs text-white/30 hover:text-white/50 transition-colors">
              {t('footer.refund')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
