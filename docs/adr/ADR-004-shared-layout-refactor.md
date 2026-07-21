# ADR-004: Shared Layout Refactor — Navbar / Footer / Theme-color

- **Status:** Accepted
- **Date:** 2026-07-21
- **Context:** Before this refactor, each per-brand page (LUT, La Lounge,
  Your Birthday, legal pages, checkout, cart, products) rendered its own
  `<Navbar />` + `<Footer />` pair, plus its own back button, language
  toggle, and scroll-to-top button. This caused:

  - Inconsistent chrome between pages of the same brand.
  - Duplicate code in every page module.
  - `<meta name="theme-color">` was static instead of following the active
    brand, so the mobile browser chrome didn't match.
  - The storefront navbar/footer were rendering inside `/admin/*` even
    though the admin shell renders its own chrome.

## Decision

1. **Single source of truth** — `[locale]/layout.tsx` renders `<Navbar />`
   and `<Footer />` as siblings of `{children}`. Per-page instances were
   removed from LUT, La Lounge, Your Birthday, checkout, cart, products,
   and legal pages.
2. **Per-brand custom nav removed** — the per-brand `<nav>` (back button,
   language toggle, scroll-to-top) inside `your-birthday-view.tsx`,
   `la-lounge-view.tsx`, and `last-unique-touch-view.tsx` was deleted
   because the shared `<Navbar />` already provides all three.
3. **Admin route suppression** — `<Navbar />` and `<Footer />` bail out
   early when `usePathname()` matches `/admin/*` so the admin shell is
   the only chrome.
4. **Dynamic theme-color** — `BrandThemeSetter` updates
   `<meta name="theme-color">` per-brand on the client, and the server
   sets an initial value too, so the mobile browser chrome matches.
5. **Per-brand label fix** — "LA Lounge" → "La Lounge" (correct casing)
  in the admin brand switcher.

## Consequences

- One change to `<Navbar />` or `<Footer />` propagates to every brand.
- Less duplicate code, smaller bundle.
- Mobile browser chrome always matches the active brand.
- `/admin/*` no longer renders the storefront chrome.

## Related V# Fix comments

- `FIX-1A` (src/app/[locale]/layout.tsx): Navbar + Footer rendered as
  siblings of `{children}`; themeColor set dynamically per-brand
- `FIX-1A` (src/app/[locale]/page.tsx, src/app/[locale]/checkout/page.tsx,
  src/app/[locale]/checkout/payment/page.tsx,
  src/app/[locale]/checkout/success/page.tsx,
  src/app/[locale]/cart/page.tsx, src/app/[locale]/products/page.tsx,
  src/app/[locale]/products/[slug]/page.tsx,
  src/components/legal/page-header.tsx,
  src/components/your-birthday/your-birthday-view.tsx,
  src/components/la-lounge/la-lounge-view.tsx,
  src/components/last-unique-touch/last-unique-touch-view.tsx):
  per-page `<Navbar />` / `<Footer />` removed; per-brand custom
  `<nav>` / `<footer>` removed; "Back" button removed
- `FIX-1A` (src/components/layout/navbar.tsx, src/components/layout/footer.tsx):
  hide inside `/admin/*` routes
- `FIX-1A` (src/components/providers/brand-theme-setter.tsx): update
  `<meta name="theme-color">` per-brand on the client
- `FIX-1A` (src/app/fonts.ts): `preload: false` on La Lounge + Your
  Birthday fonts so the LUT preload hint stays the priority
- `FIX-1A` (src/components/admin/admin-shell.tsx): "LA Lounge" →
  "La Lounge" label fix
- `FIX-1A` (src/components/your-birthday/your-birthday-view.tsx):
  removed `onBack`, scroll-tracking state/effect, `scrollToTop` helper,
  `BackIcon`, `currentYear` (handled by shared `<Footer />`)
