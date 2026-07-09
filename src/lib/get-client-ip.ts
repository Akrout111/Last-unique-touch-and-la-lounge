import type { NextRequest } from 'next/server'

/**
 * Resolve the caller's IP for rate-limit keying.
 *
 * Takes the LAST entry of `x-forwarded-for` — that is the IP set by the
 * trusted reverse proxy. Earlier entries are client-controllable and must
 * NOT be used for rate-limit keying (XFF spoofing fix). Falls back to
 * `x-real-ip`, then the sentinel `'unknown'` so unidentified callers
 * share a single rate-limit bucket rather than each being unlimited.
 *
 * Server-action variant: `src/app/[locale]/admin/login/actions.ts` has
 * its own `getClientIp()` that reads from `headers()` instead of
 * `req.headers` (server actions don't receive a `NextRequest`).
 */
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    const parts = forwarded.split(',').map((p) => p.trim()).filter(Boolean)
    if (parts.length > 0) {
      return parts[parts.length - 1] || 'unknown'
    }
  }
  return req.headers.get('x-real-ip') ?? 'unknown'
}
