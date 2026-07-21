# ADR-002: Multi-tenant Brand Scoping

- **Status:** Accepted
- **Date:** 2026-07-21
- **Context:** The platform hosts three storefront brands (LUT, La Lounge,
  Your Birthday) on the same codebase. Without explicit brand scoping at the
  data layer, a client could probe another tenant's products, slugs, or
  availability simply by guessing identifiers.

## Decision

Every public read path — product detail, related products, availability
check, sitemap, and the orders API — applies a `brand='LUT'` (or
brand-of-current-storefront) filter at the Prisma `where` clause.
Cross-tenant slugs return 404, not 403, so probes leak no information
about which slugs exist in other tenants.

## Consequences

- A La Lounge customer cannot accidentally land on a LUT product URL, and
  a malicious actor cannot enumerate other tenants' catalogues.
- Admin callers may omit the brand filter (they have a privileged shell).
- The sitemap advertises only the active storefront's URLs.

## Related V# Fix comments

- `V9 Fix #2` (src/app/[locale]/products/[slug]/page.tsx): scope by
  `brand='LUT'` so a La Lounge slug returns 404; pass the product's own
  brand to `getRelatedProducts`
- `V9 Fix #2` (src/app/api/orders/route.ts): `brand='LUT'` filter prevents
  cross-tenant booking
- `V9 Fix #2` (src/app/api/products/[id]/availability/route.ts): scope by
  `brand='LUT'` so clients cannot probe availability for other tenants
- `V9 Fix #2` (src/app/sitemap.ts): sitemap only advertises LUT products
- `V9 Fix #2` (src/lib/products.ts): `brand` is required for the
  storefront; admin callers may omit it
- `V9 Fix #2` (src/app/[locale]/products/[slug]/not-found.tsx):
  product-specific 404 page covers "slug belongs to a non-LUT brand"
