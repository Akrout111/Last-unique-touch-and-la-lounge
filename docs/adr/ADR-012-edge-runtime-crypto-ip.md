# ADR-012: Edge-runtime Crypto & IP Extraction

- **Status:** Accepted
- **Date:** 2026-07-21
- **Context:** Two infra-level concerns needed Edge-runtime-safe
  solutions:

  1. Session-cookie verification previously used Node.js `crypto` (HMAC
     via `createHmac`), which is unavailable in the Edge runtime —
     forcing the middleware to run on Node.js and losing edge latency
     gains.
  2. The `x-forwarded-for` chain parser took the **first** entry, which
     is the client-controlled hop and trivially spoofable. The fix spec
     asked for "the first entry" but the dev note documents why the
     implementation walks the chain right-to-left (taking the
     rightmost untrusted entry) instead.

## Decision

1. **Web Crypto API** — `verifySessionCookie` uses `crypto.subtle`
   (HMAC via `importKey` + `sign`), which is available in both Node.js
   and the Edge runtime. The function is `async` because Web Crypto
   returns Promises.
2. **Constant-time comparison** — `safeEqual` uses
   `crypto.subtle.timingSafeEqual` (or a manual constant-time loop on
   runtimes that lack it) to prevent timing attacks on the signature.
3. **Right-to-left XFF walk** — `get-client-ip.ts` walks the
   `x-forwarded-for` chain right-to-left and returns the rightmost
   non-private IP, which is the most-trusted hop (closest to the
   server). The dev note in the file explains why this differs from
   the literal "first entry" wording in the original task spec.

## Consequences

- Middleware runs in the Edge runtime, keeping latency low.
- Session-cookie verification is constant-time, preventing timing
  attacks.
- Client IP extraction is resistant to spoofed `x-forwarded-for`
  headers.

## Related V# Fix comments

- `V11 Fix #9` (src/proxy.ts): Web Crypto API (`crypto.subtle`);
  async `verifySessionCookie`; constant-time comparison
- `FIX-1D` (src/lib/get-client-ip.ts): walk the `x-forwarded-for`
  chain right-to-left; dev note explains why this differs from the
  task spec's literal "first entry" wording
