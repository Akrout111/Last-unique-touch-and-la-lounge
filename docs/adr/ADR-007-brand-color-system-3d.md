# ADR-007: Brand Color System & 3D Visuals

- **Status:** Accepted
- **Date:** 2026-07-21
- **Context:** The codebase had two related color problems:

  1. Hardcoded hex literals were scattered across 3D scenes
     (`purple-waves-3d.tsx`, `features-view.tsx`) and admin palettes
     (`products-table.tsx`, `toast-provider.tsx`, `booking-detail.tsx`),
     so changing a brand color required finding every hex.
  2. The `BRAND_COLORS` constant in `src/lib/brand-colors.ts` was out of
     sync with `globals.css`, so the 3D scenes rendered slightly
     different colors than the DOM.
  3. The Your Birthday tile palette included off-brand emerald + red
     (`#10B981` / `#EF4444`) instead of the gold family.
  4. White text on gold buttons (#F5B914) gave a 1.76:1 contrast ratio,
     failing WCAG AA.
  5. The admin status badges used raw red/yellow instead of the
     project's `rose` / `amber` tokens.

## Decision

1. **Single source of truth for brand colors** — `BRAND_COLORS` in
   `src/lib/brand-colors.ts` is the canonical JS-side mirror of the CSS
   variables in `globals.css`. 3D scenes read from `BRAND_COLORS`
   instead of hex literals.
2. **Lighter variants for 3D gradients** — `BRAND_COLORS` includes
   lighter variants for use in 3D gradients and glows (so a single base
   color can produce a believable gradient without hand-picking
   variants).
3. **On-brand tile palette** — the Your Birthday service tiles use the
   gold brand token + `#FFD147` light variant; the off-brand emerald
   and red were removed.
4. **WCAG-compliant button text** — gold buttons use `#1a1a2e` dark ink
   (`--primary-foreground` for the birthday brand) instead of white,
   giving ~12:1 contrast.
5. **Palette sweep** — admin status badges and toast notifications use
   the project's `emerald` / `rose` / `amber` tokens instead of raw
   `green` / `red` / `yellow`.

## Consequences

- Changing a brand color is a one-line edit in `globals.css` +
  `BRAND_COLORS`.
- 3D scenes match the DOM palette exactly.
- All gold buttons pass WCAG AA contrast.
- Admin status indicators use the same palette as the rest of the
  dashboard.

## Related V# Fix comments

- `V10 Fix #2` (src/lib/brand-colors.ts): sync `BRAND_COLORS` with
  `globals.css`
- `V11 Fix #12` (src/lib/brand-colors.ts, src/components/la-lounge/purple-waves-3d.tsx):
  lighter variants for 3D gradients/glows; use `BRAND_COLORS` instead of
  hardcoded hexes
- `FIX-1B / R1-D M6` (src/components/your-birthday/features-view.tsx):
  replace off-brand emerald/red with gold brand tokens
- `FIX-1B / R1-D M7` (src/components/la-lounge/purple-waves-3d.tsx):
  consolidate pink hex literals into `BRAND_COLORS`
- `FIX-1B Fix 5` (src/components/product/product-info.tsx): `aria-busy`
  flips on while the add-to-cart mutation is pending
- `FIX-4A` (src/app/globals.css, src/components/admin/products-table.tsx,
  src/components/admin/booking-detail.tsx,
  src/components/providers/toast-provider.tsx): palette sweep
  (red/yellow/green → rose/amber/emerald) and dark ink on gold buttons
  for WCAG AA contrast
