# Pull Request Checklist

## Before Submitting
- [ ] I read `DESIGN_RULES.md` and followed all rules
- [ ] `bun run lint` — 0 errors
- [ ] `bun run typecheck` — 0 errors
- [ ] `bun run test` — all tests pass
- [ ] `bun run build` — succeeds without MISSING_MESSAGE
- [ ] `bun run check-rules` — 0 violations

## i18n
- [ ] No hardcoded text in JSX
- [ ] Every new key in `ar.json` exists in `en.json`
- [ ] Admin panel is fully translated too

## RTL
- [ ] Used logical properties (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`)
- [ ] Animations depend on `locale` (no fixed `x: '100%'`)
- [ ] Tested visually in both Arabic and English

## Navigation
- [ ] Used `Link` from `@/i18n/routing` (not `<a href>`)
- [ ] MagneticButton and all wrappers use `Link` internally

## Images
- [ ] Used `next/image` (not `<img>`)
- [ ] Descriptive alt text (or `alt=""` for decorative)
- [ ] `sizes` added for responsive images

## A11y
- [ ] Icon-only buttons have `aria-label`
- [ ] Every input has an associated label
- [ ] Toast: `role` + `aria-live`
- [ ] Touch targets ≥ 44×44px
- [ ] Form errors: icon + specific message + `role="alert"`
- [ ] Form fields: correct `autoComplete`

## Design
- [ ] Used CSS variables (no hex codes)
- [ ] Consistent design language (same borderRadius + font for similar elements)
- [ ] Correct cursor (`pointer` for clickable, `default` otherwise)

## React Hook Form
- [ ] Used `Controller` with Radix components (not `register`)

## Performance
- [ ] Three.js: `frameloop="demand"` + lazy load + fallback
- [ ] No excessive font weights
- [ ] Skeleton components for loading states

## Visual Testing
- [ ] Tested on mobile (375px)
- [ ] Tested on tablet (768px)
- [ ] Tested on desktop (1280px+)
- [ ] Tested RTL + LTR
