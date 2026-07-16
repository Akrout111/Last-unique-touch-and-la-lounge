<!--
  Pull Request Template
  See CONTRIBUTING.md for the full guide.
  Please fill out every section. PRs with unchecked critical boxes may be blocked.
-->

## Summary

<!-- Brief description of WHAT changes and WHY. Reference the issue if applicable (Closes #123). -->

-

## Type of change

- [ ] feat — New feature (non-breaking)
- [ ] fix — Bug fix (non-breaking)
- [ ] refactor — Code restructure, no behavior change
- [ ] perf — Performance improvement
- [ ] docs — Documentation only
- [ ] style — Formatting / lint fixes
- [ ] test — Test additions or corrections
- [ ] chore — Tooling, deps, CI
- [ ] ci — CI/CD pipeline changes
- [ ] build — Build system / dependencies
- [ ] revert — Revert previous commit
- [ ] breaking change — Modifies public API or DB schema

---

## Testing checklist

- [ ] `bun run lint` passes locally
- [ ] `bun run typecheck` passes locally
- [ ] `bun run test` passes locally (or new tests added for new behavior)
- [ ] Manual smoke test performed in the browser (AR + EN locales if UI change)
- [ ] `bun run build` succeeds without warnings/errors
- [ ] E2E (`bun run e2e`) still passes for affected flows (checkout, admin login)

## Security checklist

- [ ] No secrets, API keys, or `.env` values committed (only `.env.example` updates)
- [ ] No `console.log` / `console.debug` added (use `console.warn` or `console.error` for diagnostics)
- [ ] All user-supplied input validated with `zod` or equivalent schema
- [ ] No new `dangerouslySetInnerHTML` without sanitization
- [ ] No new `eval` / `new Function` / dynamic code execution
- [ ] Auth-protected routes use `requireAuth()` server-side
- [ ] No new CSRF-unsafe server actions (verify `Origin` / use Next.js built-in protection)

## Accessibility checklist (UI changes only)

- [ ] Keyboard-only navigation works (Tab / Shift+Tab / Enter / Esc)
- [ ] Focus states are visible and ordered logically
- [ ] Interactive elements have accessible names (`aria-label` if icon-only)
- [ ] Color contrast meets WCAG AA (≥ 4.5:1 for body text, ≥ 3:1 for large text)
- [ ] No information conveyed by color alone
- [ ] RTL layout verified (AR locale) — uses logical CSS properties (`ms-*`, `me-*`, not `ml-*`/`mr-*`)

## i18n checklist (UI changes only)

- [ ] New user-facing strings added to BOTH `messages/en.json` AND `messages/ar.json`
- [ ] Message keys match exactly between AR and EN files (no missing keys on either side)
- [ ] No hardcoded English/Arabic strings in JSX (always use `useTranslations` / `getTranslations`)
- [ ] Pluralization / ICU MessageFormat used where appropriate

## Database / migrations (skip if no Prisma changes)

- [ ] Schema change accompanied by a migration (`bun run db:migrate`)
- [ ] Migration is reversible or includes data backfill
- [ ] `prisma/seed.ts` updated if new tables/enums need seed data
- [ ] Existing seed data still loads (`bun run db:reset && bun run db:seed` works)

---

## Notes for reviewers

<!-- Anything reviewers should pay extra attention to, edge cases, follow-up work, screenshots/recordings, etc. -->
