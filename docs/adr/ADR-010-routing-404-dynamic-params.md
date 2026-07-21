# ADR-010: Routing — 404 Handling & Dynamic Params

- **Status:** Accepted
- **Date:** 2026-07-21
- **Context:** Two routing issues affected SEO and UX:

  1. `generateStaticParams` enumerated every product slug, but
     `dynamicParams = true` (Next.js default) meant unknown slugs
     fell through to a dynamic render that returned `null` and
     produced a generic 404 instead of the LUT-branded not-found page.
  2. There was no product-specific 404 page, so users landing on a
     non-existent or cross-tenant slug saw the generic Next.js 404.
  3. The middleware used `check-slug` via an internal `fetch()` to
     determine whether a route existed, adding a self-fetch round-trip.

## Decision

1. **`dynamicParams = false`** on the product detail page — Next.js
   now returns a real HTTP 404 for slugs not in `generateStaticParams`,
   which renders the brand-specific `not-found.tsx`.
2. **Product-specific `not-found.tsx`** — branded 404 page covers
   "slug doesn't exist" and "slug belongs to a non-LUT brand".
3. **Lightweight `check-slug` route** — used by middleware to short-
   circuit 404s before the page renders, but called directly against
   the data layer (no self-fetch).

## Consequences

- Unknown slugs get a real 404 (better for SEO and analytics).
- The 404 page is on-brand instead of generic Next.js.
- Middleware 404 short-circuit is fast (no self-fetch).

## Related V# Fix comments

- `V10 Fix #1` (src/app/[locale]/products/[slug]/page.tsx):
  `dynamicParams = false` makes Next.js return a real HTTP 404 for
  unknown slugs
- `V10 Fix #1` (src/app/api/products/check-slug/route.ts): lightweight
  existence check used by the middleware
- `V9 Fix #8` (src/app/[locale]/products/[slug]/not-found.tsx):
  product-specific not-found page
