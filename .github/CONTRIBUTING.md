# Contributing to Last Unique Touch

Thanks for taking the time to contribute! This guide covers setup, conventions, and the
PR process. The short version: branch off `main`, follow conventional commits, fill in the
PR template, and make sure CI is green.

---

## 1. Development environment

### Prerequisites

- **Bun** ≥ 1.3 — https://bun.sh/docs/install
- **Node.js** 20 (only needed for some tooling; Bun is the primary runtime)
- **Git** ≥ 2.30

### First-time setup

```bash
git clone <repo-url> last-unique-touch
cd last-unique-touch
bun install                # installs deps AND runs `husky` (sets up git hooks)
cp .env.example .env       # then fill in real secrets (NEVER commit .env)
bun run db:push            # create SQLite schema in prisma/db/app.db
bun run db:seed            # seed LUT + La Lounge + Your Birthday catalog
bun run dev                # → http://localhost:3000
```

The `bun install` step automatically installs Husky git hooks via the `prepare` script in
`package.json`. If hooks aren't firing, run `bun run prepare` manually.

### Environment variables

`.env.example` lists every variable the app reads. Copy it to `.env` and fill in real
values. **Never commit `.env`.** Required for production:

- `DATABASE_URL` — SQLite path or external DB URL
- `SESSION_SECRET` — ≥ 32 chars (`openssl rand -hex 32`)
- `PAYMENT_WEBHOOK_SECRET` — ≥ 16 chars (`openssl rand -hex 16`)
- `ADMIN_PASSWORD` — strong password for `/admin/login`
- `TRUSTED_PROXY_IPS` — comma-separated list (for `X-Forwarded-For` parsing)
- `SESSION_EPOCH` — integer; bump to invalidate every existing session
- `NODE_ENV` — `production` or `development`

---

## 2. Commit message convention

We use [Conventional Commits](https://www.conventionalcommits.org/) — enforced by
**commitlint** via the `commit-msg` git hook.

```
<type>(<optional scope>): <subject>

<optional body>

<optional footer>
```

### Allowed `type` values

| Type       | Use for                                                          |
| ---------- | ---------------------------------------------------------------- |
| `feat`     | New user-facing feature                                          |
| `fix`      | Bug fix                                                          |
| `docs`     | Documentation only (README, CONTRIBUTING, comments)              |
| `style`    | Formatting / whitespace / lint fixes — no code logic change      |
| `refactor` | Code restructure without behavior change                         |
| `perf`     | Performance improvement                                          |
| `test`     | Adding or correcting tests                                       |
| `chore`    | Tooling, deps, config (non-user-facing)                          |
| `ci`       | CI/CD pipeline changes                                           |
| `build`    | Build system / dependency changes                                |
| `revert`   | Reverting a previous commit                                      |

### Rules

- Subject line ≤ 100 characters.
- Subject is lowercase, imperative mood (`add`, not `added` or `adds`).
- No `.` at the end of the subject.
- Reference issues in the footer: `Closes #123` or `Refs #456`.

### Examples

```
feat(checkout): add K-Net payment redirect flow
fix(cart): preserve RTL layout on mobile Safari
docs(claude): add architecture notes for new contributors
chore(deps): bump next to 16.2.10
ci: cache .next/cache between runs
revert: feat(checkout): add K-Net payment redirect flow
```

The commit-msg hook (`bun run commitlint --edit "$1"`) will reject non-conforming messages.

---

## 3. Pull request process

1. **Branch** off `main`: `git checkout -b feat/short-description`.
2. **Make your changes.** Keep PRs small and focused — one feature or one fix per PR.
3. **Commit.** Husky's `pre-commit` hook runs `lint-staged` (eslint --fix + prettier --write
   on staged files). If anything fails, fix it and re-stage.
4. **Push** and open a PR against `main`.
5. **Fill in the PR template** (`.github/pull_request_template.md`). Every checkbox that
   applies to your change should be ticked.
6. **CI must pass.** The workflow at `.github/workflows/ci.yml` runs
   `lint → typecheck → test → build`. If it fails, fix it before requesting review.
7. **Code review.** CODEOWNERS requires approval from `@Akrout111` for changes to
   `/src/components/admin/` and `/prisma/`. Other paths can be approved by any owner.
8. **Squash-merge** is the default — your PR's commits get squashed into one on `main`,
   so the conventional-commit subject on the PR title becomes the canonical commit message.
9. **Delete your branch** after merge.

### PR template sections (don't skip)

- **Summary** — what changed and why
- **Type of change** — `feat` / `fix` / `refactor` / etc.
- **Testing checklist** — lint, typecheck, tests, manual smoke test, build
- **Security checklist** — no secrets, no console.log, inputs validated
- **Accessibility checklist** — keyboard nav, ARIA, contrast, RTL
- **i18n checklist** — new strings added to BOTH `messages/en.json` and `messages/ar.json`
- **Database / migrations** — only if you touched `prisma/schema.prisma`

---

## 4. Code style

Prettier and ESLint are configured to enforce the project style. They run automatically on
staged files via Husky's `pre-commit` hook — you generally don't need to run them manually.

### Manual commands

```bash
bun run format            # prettier --write . (format everything)
bun run format:check      # prettier --check . (CI mode — fails if unformatted)
bun run lint              # eslint . (across the whole repo)
bun run typecheck         # tsc --noEmit
```

### Style highlights (see `.prettierrc` and `eslint.config.mjs` for the full spec)

- No semicolons
- Single quotes for strings
- Trailing commas everywhere (`all`)
- 100-char print width
- 2-space indentation
- LF line endings
- Arrow functions always take parens: `(x) => x`, not `x => x`

### Project-specific rules

- **No `console.log`** — use `console.warn` or `console.error`.
- **Logical CSS properties only** — `ms-*` / `me-*` / `ps-*` / `pe-*`, never `ml-*`/`mr-*`
  (the site is RTL-first).
- **Always `next/image`** — never raw `<img>`.
- **No `any`** — use `unknown` + type guards or proper zod schemas.
- **No `dangerouslySetInnerHTML`** without sanitization.

---

## 5. Testing

- **Unit tests** — Vitest, colocated in `__tests__/` next to the code under test.
  - Run: `bun run test` (or `bun run test:watch` for watch mode).
  - Coverage: `bun run test:coverage`.
- **E2E tests** — Playwright, in `e2e/`.
  - First run: `bun run e2e:install` to download browser binaries.
  - Run: `bun run e2e`.
- New features should ship with tests. Bug fixes should ship with a regression test.

---

## 6. Database changes

1. Edit `prisma/schema.prisma`.
2. Create a migration: `bun run db:migrate` (gives it a descriptive name).
3. Update `prisma/seed.ts` if new tables / enums / rows need seed data.
4. Test locally: `bun run db:reset && bun run db:seed`.
5. Mention the migration in the PR description and call out any data-backfill steps.

Never edit an already-applied migration — create a new one.

---

## 7. Questions / getting help

- Open a GitHub Discussion for "how do I…" questions.
- Open an Issue for reproducible bugs.
- For sensitive security reports, DO NOT open a public issue — DM `@Akrout111` directly.

Happy hacking! 🛠️
