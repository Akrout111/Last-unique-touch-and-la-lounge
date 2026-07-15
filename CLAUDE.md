# CLAUDE.md — Project Context for AI Assistants

> Read this first when working in this repository. Keep it concise; link out to detailed docs
> instead of duplicating their content.

## Project Overview

**Last Unique Touch (LUT)** is a multi-tenant rental-platform monorepo serving three
distinct event-rental brands from a single Next.js codebase:

| Brand            | Slug              | Primary color | Theme                            |
| ---------------- | ----------------- | ------------- | -------------------------------- |
| LUT              | `last-unique-touch` | `#8B6B3D` (gold)     | Heritage / Arabesque furniture   |
| La Lounge        | `la-lounge`         | `#E6007E` (magenta) | Modern / purple-wave aesthetic   |
| Your Birthday    | `your-birthday`     | `#F5B914` (yellow)  | Birthday / celebration experiences |

Each brand has its own landing page, 3D hero background, product catalog, and contact flow,
but they share the admin dashboard, cart, checkout, and DB schema.

## Tech Stack

- **Framework**: Next.js 16 (App Router, `output: 'standalone'`)
- **Runtime**: Bun (dev + production server) + Node.js 20 (CI)
- **UI**: React 19, Tailwind CSS 4, shadcn/ui, lucide-react
- **3D**: Three.js + `@react-three/fiber` + `@react-three/drei`
- **Forms**: react-hook-form + zod 4
- **i18n**: next-intl 4 — locales `ar` (RTL, default) and `en` (LTR)
- **ORM**: Prisma 6 + SQLite (`prisma/db/app.db`)
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Quality**: ESLint 9 (flat config), Prettier 3, Husky 9, lint-staged, commitlint

## Brand Colors (single source of truth)

Defined in `src/lib/brand-colors.ts` and `src/app/globals.css`. Do NOT hardcode hex values
in components — always import from `brand-colors.ts`:

```ts
import { BRAND_COLORS } from '@/lib/brand-colors'
const gold = BRAND_COLORS.LUT.primary // #8B6B3D
```

Note: LUT gold was darkened from `#D4A574` (~2.2:1 contrast on white, FAIL) to `#8B6B3D`
(4.92:1 contrast on white, passes WCAG AA for body text).

## Key Commands

```bash
bun install                  # install deps (also runs `prepare` → husky init)
bun run dev                  # dev server on :3000 (webpack mode)
bun run build                # production build (standalone output)
bun run start                # run built standalone server
bun run lint                 # eslint .
bun run typecheck            # tsc --noEmit
bun run test                 # vitest run (unit tests)
bun run test:watch           # vitest in watch mode
bun run test:coverage        # vitest with coverage report
bun run e2e                  # playwright test (E2E)
bun run e2e:install          # playwright install browsers
bun run format               # prettier --write .
bun run format:check         # prettier --check . (CI mode)
bun run db:push              # push prisma schema to dev DB
bun run db:migrate           # create + apply migration
bun run db:seed              # seed initial catalog (LUT, La Lounge, Your Birthday)
bun run db:studio            # prisma studio GUI
bun run commitlint           # validate a commit message
bun run lint-staged          # run lint-staged on staged files (called by husky)
```

## Architecture Notes

### Auth
- HMAC-SHA256 stateless sessions in `__Host-` prefixed cookies (prevents subdomain injection).
- All server actions / admin routes MUST call `requireAuth()` from `src/lib/auth.ts`.
- `SESSION_EPOCH` env var: bump to invalidate every existing session (token-revocation epoch).
- Constant-time comparisons everywhere (no early-return on mismatch).

### 3D Backgrounds
- Three brand-specific 3D backgrounds (`lut-3d-background.tsx`, `la-lounge-3d-background.tsx`,
  `birthday-3d-background.tsx`) and a shared landing hero.
- ALL 3D rendering must be gated by `shouldEnable3D()` from `src/lib/device-capabilities.ts`
  (checks CPU cores, memory, mobile, `prefers-reduced-motion`). Falls back to static images.
- Known issue: `shouldEnable3D()` comment says `< 2` cores but code says `< 4` — Fixer B is
  reconciling this.

### Proxy / Routing
- `src/proxy.ts` is the Next.js middleware entry point (auth + i18n + brand routing).
- Production sits behind a **Caddy** reverse proxy (see `Caddyfile`).
- Mini-services (n8n webhooks, etc.) are routed via `?XTransformPort=<port>` query param.
  > ⚠️ TODO (Medium priority): replace `XTransformPort` query param with a secret header.

### i18n
- Locales: `ar` (RTL, default) and `en` (LTR).
- Message files: `messages/en.json` and `messages/ar.json` — **MUST stay in key parity**.
  Any new key must be added to BOTH files or the build / runtime will fail.
- In server components use `getTranslations()`, in client components use `useTranslations()`.

### Database
- SQLite via Prisma. Single shared schema for all 3 brands — `Brand` enum discriminates rows.
- Migrations in `prisma/migrations/`. Always create a migration for schema changes; never
  edit an applied migration.

## Coding Conventions

1. **No `console.log`** in committed code. Use `console.warn` (recoverable) or
   `console.error` (unexpected). Add `// eslint-disable-next-line no-console` only if
   absolutely necessary and document why.

2. **Logical CSS properties only** — Tailwind `ms-*` / `me-*` / `ps-*` / `pe-*`,
   NEVER `ml-*` / `mr-*` / `pl-*` / `pr-*`. The site is RTL-first.

3. **Always `next/image`** — never raw `<img>`. ESLint rule `@next/next/no-img-element`
   is enabled as an error.

4. **Validate all input** with `zod` schemas at the boundary (server action / API route).
   Never trust client-sent data.

5. **No `any`** — `@typescript-eslint/no-explicit-any` is an error. Use `unknown` + a
   type guard, or a proper schema.

6. **Server Actions**: define in `actions.ts` files colocated with their route segment.
   Always `'use server'` at the top.

7. **No `dangerouslySetInnerHTML`** without sanitization. Content from `react-markdown`
   is OK because it sanitizes by default.

8. **Conventional commits** — `feat:`, `fix:`, `docs:`, `chore:`, `ci:`, `refactor:`,
   `perf:`, `test:`, `build:`, `revert:`, `style:`. Subject ≤ 100 chars. Enforced by
   commitlint (see `commitlint.config.js`).

9. **Pre-commit hook** runs `lint-staged` (eslint --fix + prettier --write on staged
   files). Commit-msg hook runs `commitlint`. Both installed via `husky`.

## File Layout

```
.github/            # CI, Dependabot, CODEOWNERS, PR + issue templates, CONTRIBUTING
.husky/             # git hooks (pre-commit, commit-msg)
content/{en,ar}/    # long-form markdown (terms, privacy, refund, about)
messages/{en,ar}.json   # next-intl message catalogs (keep in parity)
prisma/             # schema.prisma, migrations/, seed.ts, dev DB
public/             # static assets, 3D models (.glb), product images
src/app/            # Next.js App Router pages + API routes
src/app/[locale]/   # locale-prefixed routes (ar/en)
src/app/[locale]/admin/   # admin dashboard (auth-required)
src/components/     # React components (admin/, landing/, brand/, ui/, ui-premium/)
src/components/ui/  # shadcn/ui primitives — do not hand-edit unless necessary
src/lib/            # business logic, auth, db, brand-colors, etc.
src/i18n/           # next-intl routing + request config
src/middleware.ts   # → re-exports from src/proxy.ts
src/proxy.ts        # auth + i18n + brand-routing middleware
```

## CI / CD

- GitHub Actions workflow: `.github/workflows/ci.yml` runs `lint → typecheck → test → build`
  on every push to `main` and every PR targeting `main`.
- Dependabot opens weekly PRs for npm + github-actions updates.
- CODEOWNERS enforces review from `@Akrout111` for `/src/components/admin/` and `/prisma/`.

## When You're Unsure

- Read `DESIGN_RULES.md` for design-system rules.
- Read `.github/CONTRIBUTING.md` for the contribution flow.
- Read `upload/project-analysis-final-report.md` for the full gap analysis this work is
  based on.
- Check `worklog.md` for what other parallel agents have already touched.
