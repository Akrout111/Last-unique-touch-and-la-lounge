'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * BrandThemeSetter (client side)
 *
 * Sets `data-brand` on <html> based on the current pathname so per-brand CSS
 * variables (defined in globals.css) take effect during SPA navigations:
 *   - `/la-lounge/*`    → data-brand="lalounge"
 *   - `/your-birthday/*` → data-brand="birthday"
 *   - everything else    → data-brand="lut"
 *
 * The server-rendered <html> in `src/app/[locale]/layout.tsx` already sets
 * `data-brand` from the `x-pathname` middleware header for the initial
 * response (so SSR HTML is brand-correct). This client component keeps the
 * attribute in sync when the route changes client-side without a full
 * server round-trip. `suppressHydrationWarning` is set on <html> so the
 * post-hydration update does not warn.
 */
export function BrandThemeSetter() {
  const pathname = usePathname()

  useEffect(() => {
    const brand = pathname.includes('/la-lounge')
      ? 'lalounge'
      : pathname.includes('/your-birthday')
        ? 'birthday'
        : 'lut'
    document.documentElement.setAttribute('data-brand', brand)
  }, [pathname])

  return null
}
