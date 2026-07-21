# ADR-001: Auth, Session Verification & Webhook Replay Protection

- **Status:** Accepted
- **Date:** 2026-07-21
- **Context:** The admin dashboard and payment webhooks need a defence-in-depth
  auth story: every `/admin/*` request must be authenticated, session cookies
  must be verifiable in the Edge runtime, and inbound payment webhooks must
  reject replays / tampering.

## Decision

1. **Admin auth guard in middleware** — `src/proxy.ts` enforces session-cookie
   verification on every `/admin/*` request and redirects unauthenticated
   callers to `/admin/login`.
2. **Async session cookie verification** — switched to the Web Crypto API
   (`crypto.subtle`) so verification runs in the Edge runtime; `verifySessionCookie`
   returns a `Promise`.
3. **Webhook replay protection** — payment webhooks require
   `X-Signature`, `X-Timestamp`, and `X-Nonce` headers; the raw body is read
   **first** (before any JSON parsing), then signature + timestamp window +
   nonce-uniqueness are checked together.
4. **Idempotent booking creation** — the `IdempotencyKey` row is created
   **inside** the same transaction as the booking; a `P2002` on the unique
   `key` constraint is treated as a concurrent duplicate and returns the
   original result.
5. **Idempotency key expiry** — expired keys are treated as new requests so
   long-running clients don't accidentally replay after the window.
6. **Booking state machine** — includes `PAYMENT_FAILED` transitions so
   failed payments can be retried back to `PENDING` instead of being stuck.

## Consequences

- Auth is enforced before any page renders — no client-side bypass.
- Edge-runtime compatibility means the middleware stays fast and runs in
  the same region as the request.
- Replay attacks require forging all three headers within the timestamp
  window, which is computationally infeasible without the secret.
- Concurrent duplicate orders collapse to the original result.

## Related V# Fix comments

- `V9 Fix #1` (src/proxy.ts): admin session verification + redirect to `/admin/login`
- `V11 Fix #9` (src/proxy.ts): Web Crypto API, async `verifySessionCookie`
- `V9 Fix #3` (src/app/api/webhooks/payment-callback/route.ts,
  src/app/api/webhooks/payment-success/route.ts): webhook replay protection
  (signature + timestamp + nonce + raw body first)
- `V9 Fix #5` (src/app/api/orders/route.ts): idempotency key created inside
  the transaction; `P2002` → concurrent duplicate
- `V10 Fix #11` (src/app/api/orders/route.ts): enforce `expiresAt` on
  idempotency keys
- `V10 Fix #9` (src/app/api/webhooks/payment-callback/route.ts):
  idempotency check + state guard + update ALL inside the transaction
- `V9 Fix #6` (src/app/[locale]/admin/(dashboard)/bookings/actions.ts,
  src/components/admin/bookings-table.tsx,
  src/components/admin/booking-detail.tsx): `PAYMENT_FAILED` transitions in
  the booking state machine
- `FIX-1C Fix 6` (src/app/api/orders/route.ts): cap items array at 50 to
  prevent DoS
