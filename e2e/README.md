# E2E Tests (Playwright)

## Running tests
```bash
# First time: install browser binaries
bun run e2e:install

# Run all E2E tests (starts dev server automatically)
bun run e2e

# Run with UI mode for debugging
bunx playwright test --ui

# Run a specific test file
bunx playwright tests e2e/homepage.spec.ts

# View HTML report
bunx playwright show-report
```

## Test coverage
- `homepage.spec.ts` — homepage loads, 3 brand cards visible, taglines correct, AR+EN
- `brand-navigation.spec.ts` — clicking each brand card navigates to correct brand page, no console errors
- `admin-login.spec.ts` — login page loads, empty/wrong password rejected, rate limiting works

## Notes
- Tests run against `http://localhost:3000` (dev server, auto-started)
- Both desktop (Chrome) and mobile (iPhone 14) viewports are tested
- Locale defaults to `ar-KW`, timezone `Asia/Kuwait`
- 3D backgrounds may or may not render (depends on WebGL); tests accept canvas OR CSS fallback
