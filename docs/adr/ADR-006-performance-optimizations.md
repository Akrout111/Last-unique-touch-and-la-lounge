# ADR-006: Performance Optimizations — Code-splitting, Touch Targets, Self-fetch Removal

- **Status:** Accepted
- **Date:** 2026-07-21
- **Context:** Three independent performance issues were addressed:

  1. The Your Birthday page shipped Three.js (~150 KB) in the initial
     bundle even though the 3D visualizer only runs in the browser.
  2. Icon buttons in the design system were smaller than the WCAG AA
     44×44 px touch target, hurting both a11y and perceived
     tap-ability on mobile.
  3. The middleware made an internal `fetch()` to `checkProductExists()`
     on every request, adding 50–200 ms of latency and a self-fetch
     loop risk.
  4. `layout.tsx` called `resolveBrandFromPath(null)` locally even
     though the middleware had already resolved the brand.
  5. `page.tsx` (homepage) used a hardcoded production URL even on
     preview / staging deployments, breaking OG previews.

## Decision

1. **Lazy-load BirthdayVisualizer** — `next/dynamic` with `ssr: false`
   keeps Three.js out of the initial bundle and only loads it in the
   browser (where WebGL exists).
2. **44 px icon buttons** — the `icon` variant in `button.tsx` is now
   `size-11` (44×44 px) to meet WCAG AA touch targets.
3. **Remove `checkProductExists()` self-fetch** — the middleware now
   does the existence check directly against the data layer instead of
   fetching its own endpoint.
4. **Remove local `resolveBrandFromPath(null)`** — `layout.tsx` reads
   the brand that the middleware already attached to the request.
5. **`NEXT_PUBLIC_SITE_URL`** — the homepage uses the environment
   variable so preview / staging deployments emit correct canonical /
   OG URLs.

## Consequences

- Initial JS bundle is ~150 KB smaller for the Your Birthday route.
- All icon buttons meet WCAG AA touch target.
- Median TTFB drops by 50–200 ms because the middleware no longer
  self-fetches.
- Preview deployments get correct OG previews.

## Related V# Fix comments

- `V10 Fix #5` (src/components/your-birthday/features-view.tsx): lazy-load
  `BirthdayVisualizer` with `next/dynamic` + `ssr:false`
- `V10 Fix #12` (src/components/ui/button.tsx): icon buttons must be
  ≥ 44 px (WCAG AA touch target)
- `FIX-4B / R3-B-2 / R3-B-3` (src/proxy.ts): removed
  `checkProductExists()` self-fetch
- `FIX-4B / R3-B-1` (src/app/[locale]/layout.tsx, src/lib/brand.ts):
  removed the local `resolveBrandFromPath(null)` call
- `FIX-4B / R3-E #7` (src/app/[locale]/page.tsx): use
  `NEXT_PUBLIC_SITE_URL` so preview / staging deployments get correct
  canonical URLs
