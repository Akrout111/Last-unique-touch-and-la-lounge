# ADR-008: Defensive Client-side Error Handling & Idempotency

- **Status:** Accepted
- **Date:** 2026-07-21
- **Context:** Several client-side flows had silent failure modes:

  1. The cart provider wrote to `localStorage` and dispatched the
     storage event inside the reducer, causing React 19 strict-mode
     double-invocation warnings and intermittent desyncs.
  2. The navbar and footer used a `mounted` flag + `usePathname()` to
     suppress hydration warnings; this caused a flash where the
     navbar/footer rendered on `/admin/*` before the client hid them.
  3. The checkout view called `response.json()` without try/catch; a
     5xx from a misconfigured proxy (returning HTML) crashed the
     promise with an unhelpful "Unexpected token <" error.
  4. The checkout view's error map only covered a subset of API error
     codes; unknown codes showed a generic "Something went wrong".
  5. The checkout view assumed `orderId` was always present on a 200
     response; if the API returned 200 with a missing body, the
     success-page redirect crashed.
  6. The idempotency key was regenerated only on initial mount, so
     retrying after a failure reused the same key and got the same
     "duplicate" error.
  7. The 3D model loader had an eslint complaint about a value that
     "cannot be modified" inside the `useEffect` cleanup.
  8. KWD amounts were displayed with 2 decimals, losing the fil
     precision (1 KWD = 1000 fils).

## Decision

1. **Storage side-effects outside the reducer** — `cart-provider.tsx`
   moves `localStorage.setItem` and `dispatchEvent` into a
   `useEffect` so they run once per state change, not inside the
   reducer.
2. **`usePathname()` directly** — navbar and footer call
   `usePathname()` directly without a `mounted` flag; Next.js 16
   hydrates `usePathname()` synchronously so the flash is gone.
3. **Defensive JSON parse** — the checkout view wraps `response.json()`
   in try/catch and falls back to a generic error.
4. **Complete error code map** — every error code the API can return is
   mapped to a user-facing message.
5. **Null-guard `orderId`** — if the API returns 200 without an
   `orderId`, the checkout view shows an error instead of crashing on
   the redirect.
6. **Regenerate idempotency key on every retry** — the key is rotated
   on initial mount, on API error, and on client-side throw.
7. **eslint override for 3D model** — the "value cannot be modified"
   warning is documented as an expected pattern for the
   `useEffect`-driven Three.js cleanup.
8. **KWD 3-decimal display** — admin product table formats KWD amounts
   with 3 decimals (1 fil = 0.001).

## Consequences

- Cart state stays in sync across tabs and across strict-mode
  double-invocation.
- No navbar/footer flash on `/admin/*`.
- Checkout errors always show a helpful, localized message.
- Retries actually retry (instead of returning the cached duplicate
  error).
- KWD amounts display correctly to the fil.

## Related V# Fix comments

- `V11 Fix #6` (src/components/providers/cart-provider.tsx): storage
  side-effects moved outside the reducer
- `V11 Fix #7` (src/components/layout/navbar.tsx,
  src/components/layout/footer.tsx, src/components/cart/cart-view.tsx):
  use `usePathname()` directly without a `mounted` flag; second
  remove-click while a timer is pending cancels the pending timer
- `V11 Fix #8` (src/components/checkout/checkout-view.tsx): defensive
  JSON parse + complete error code map + null-guard `orderId`
- `V11 Fix #13` (src/components/hero-3d/model-3d.tsx): eslint
  "value cannot be modified" is an expected Three.js cleanup pattern
- `FIX-1C Fix 3` (src/components/checkout/checkout-view.tsx):
  regenerate idempotency key on every retry (initial mount, API error,
  client-side throw)
- `FIX-1C Fix 4` (src/components/admin/products-table.tsx): KWD uses 3
  decimal places (1 fil = 0.001)
- `V11 Fix #3` (src/components/your-birthday/your-birthday-view.tsx):
  removed `selectedPackageLabel` — packages section no longer needs it
