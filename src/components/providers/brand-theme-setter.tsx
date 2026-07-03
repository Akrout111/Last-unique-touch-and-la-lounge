'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * BrandThemeSetter
 *
 * Sets `data-brand` on <html> based on the current pathname so per-brand CSS
 * variables (defined in globals.css) take effect:
 *   - `/la-lounge/*`    → data-brand="lalounge"
 *   - `/your-birthday/*` → data-brand="birthday"
 *   - everything else    → data-brand="lut"
 *
 * Why a client component?
 *   The App Router `[locale]` dynamic segment means `headers().get('x-pathname')`
 *   is not reliably available in the server-rendered layout (the project's
 *   next-intl middleware does not forward it). Reading `usePathname()` on the
 *   client and updating `document.documentElement` is the most robust approach.
 *
 * The server-rendered <html> already ships with `data-brand="lut"` as a safe
 * default, and `suppressHydrationWarning` is set so the post-hydration update
 * does not warn.
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
