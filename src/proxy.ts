import { NextResponse, type NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

// ===== Admin session verification (V9 Fix #1) =====
//
// Moving admin auth into the proxy (formerly middleware) closes the SSR auth
// bypass: in Next.js 16 the page component can begin rendering in parallel
// with the layout, so a redirect issued from `requireAuth()` in the layout
// becomes an RSC instruction that may still leak HTML. The proxy runs BEFORE
// any rendering, so an unauthenticated request never reaches the React tree.
//
// V11 Fix #9: Uses the Web Crypto API (`crypto.subtle`) instead of Node.js
// `crypto` module so the proxy is Edge Runtime compatible. The cookie format
// is `timestamp.signature` where signature = HMAC-SHA256(SESSION_SECRET,
// timestamp).

const SESSION_COOKIE = 'lut_admin_session'
const SESSION_MAX_AGE_MS = 60 * 60 * 24 * 7 * 1000 // 7 days (matches auth.ts)
const DEV_ONLY_SESSION_SECRET = 'dev-insecure-session-secret-do-not-use-in-prod'

function getSessionSecret(): string | null {
  const isProduction = process.env.NODE_ENV === 'production'
  const envSecret = process.env.SESSION_SECRET

  if (envSecret && envSecret.length >= 32) {
    return envSecret
  }

  if (isProduction) {
    // Fail closed — no secret means no token is valid.
    console.error('[proxy] FATAL: SESSION_SECRET not set in production')
    return null
  }

  // Dev fallback (with warning)
  if (!envSecret) {
    console.warn(
      '[proxy] WARNING: SESSION_SECRET not set. Using dev-only secret.'
    )
    return DEV_ONLY_SESSION_SECRET
  }

  // envSecret provided but too short in dev — warn but allow.
  console.warn(
    `[proxy] WARNING: SESSION_SECRET shorter than 32 chars (got ${envSecret.length}).`
  )
  return envSecret
}

/**
 * Constant-time string comparison (V11 Fix #9 — Edge Runtime compatible).
 * Does NOT use Node.js `crypto.timingSafeEqual` (not available on Edge).
 * Instead, manually XORs each char code — the result is 0 iff all bytes
 * match, and the loop always iterates over the longer string so timing
 * doesn't leak the length.
 */
function safeEqualStrings(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Still iterate to keep timing roughly constant.
    const maxLen = Math.max(a.length, b.length)
    for (let i = 0; i < maxLen; i++) {
      void (a.charCodeAt(i % a.length) ^ b.charCodeAt(i % b.length))
    }
    return false
  }
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

/**
 * Compute HMAC-SHA256(secret, data) as a hex string using the Web Crypto
 * API (V11 Fix #9 — Edge Runtime compatible). Does NOT use Node.js
 * `crypto.createHmac`.
 */
async function hmacSha256Hex(secret: string, data: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
  // Convert ArrayBuffer to hex string.
  const bytes = new Uint8Array(signature)
  let hex = ''
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0')
  }
  return hex
}

/**
 * Verify the admin session cookie value (`timestamp.signature`).
 * Returns true iff the signature is valid AND the token has not expired.
 *
 * V11 Fix #9: async because Web Crypto API is async (returns Promises).
 */
async function verifySessionCookie(cookieValue: string | undefined): Promise<boolean> {
  if (!cookieValue || !cookieValue.includes('.')) return false
  const parts = cookieValue.split('.')
  if (parts.length !== 2) return false
  const [timestamp, signature] = parts

  const secret = getSessionSecret()
  if (!secret) return false

  const expectedSignature = await hmacSha256Hex(secret, timestamp)

  let sigMatch = false
  try {
    sigMatch = safeEqualStrings(signature, expectedSignature)
  } catch {
    return false
  }
  if (!sigMatch) return false

  const timestampNum = parseInt(timestamp, 10)
  if (isNaN(timestampNum)) return false

  const age = Date.now() - timestampNum
  if (age > SESSION_MAX_AGE_MS) return false
  // Tokens from the future are also invalid (clock skew / tampering).
  if (age < -60_000) return false

  return true
}

// V13 Group C8: In-memory cache for product slug existence checks.
// Reduces per-request DB roundtrip to one query per 60s per slug.
const slugCache = new Map<string, { exists: boolean; expires: number }>()
const SLUG_CACHE_TTL = 60_000 // 60 seconds

/**
 * Build a branded 404 HTML response for a non-existent product slug.
 */
function buildNotFoundResponse(locale: string): NextResponse {
  const html = `<!DOCTYPE html><html lang="${locale}" dir="${locale === 'ar' ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><title>404 — ${locale === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found'}</title><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0;display:flex;min-height:100vh;align-items:center;justify-content:center;font-family:system-ui,sans-serif;background:#FAF6EF;color:#0A0A0A"><div style="text-align:center"><h1 style="font-size:3rem;margin:0;color:#E3222B">404</h1><p style="margin:0.5rem 0 1rem;color:#666">${locale === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found'}</p><a href="/${locale}/products" style="display:inline-block;padding:0.5rem 1rem;background:#E3222B;color:#fff;text-decoration:none;border-radius:0.375rem">${locale === 'ar' ? 'العودة للمنتجات' : 'Back to Products'}</a></div></body></html>`
  return new NextResponse(html, {
    status: 404,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

/**
 * V10 Fix #1: Product slug existence check.
 *
 * The standalone production build has a quirk where `notFound()` inside the
 * product page renders the 404 body but the HTTP status remains 200 (a
 * soft-404). This function calls a lightweight internal API endpoint
 * (`/api/products/check-slug`) to check if the product exists BEFORE the
 * request reaches the page component. If the product doesn't exist, the
 * middleware returns a 404 response directly — which reliably sets the
 * HTTP 404 status code.
 *
 * V13 Group C8: Results are cached for 60 seconds per slug to avoid a
 * DB roundtrip on every product page request.
 *
 * Returns:
 *   - `null` if the product exists (or the check fails — fail open)
 *   - `NextResponse` with 404 if the product doesn't exist
 */
async function checkProductExists(
  request: NextRequest,
  locale: string,
  slug: string
): Promise<NextResponse | null> {
  // Check cache first
  const cached = slugCache.get(slug)
  if (cached && cached.expires > Date.now()) {
    if (!cached.exists) {
      return buildNotFoundResponse(locale)
    }
    return null
  }

  try {
    const checkUrl = new URL('/api/products/check-slug', request.nextUrl.origin)
    checkUrl.searchParams.set('slug', slug)
    checkUrl.searchParams.set('brand', 'LUT')

    const res = await fetch(checkUrl, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3_000),
    })

    if (!res.ok) {
      return null
    }

    const data = (await res.json()) as { exists?: boolean }
    const exists = data.exists !== false

    // Cache the result
    slugCache.set(slug, { exists, expires: Date.now() + SLUG_CACHE_TTL })

    if (!exists) {
      return buildNotFoundResponse(locale)
    }
  } catch {
    // Network error, timeout, or JSON parse error — fail open.
    // The page's own `getProductBySlug` + `notFound()` will handle it
    // (with the 200 status, but at least the 404 body renders).
  }
  return null
}

/**
 * Wraps next-intl's middleware so we can additionally:
 * 1. Enforce admin auth (V9 Fix #1) — redirect unauthenticated /admin/*
 *    requests to /admin/login BEFORE any SSR rendering.
 * 2. Expose the matched pathname to the server layer via the `x-pathname`
 *    response header (used by the root layout to set `data-brand` on <html>
 *    for correct first-paint brand theming).
 * 3. V10 Fix #1: Check product slug existence for storefront product pages
 *    and return a real HTTP 404 if the product doesn't exist (closes the
 *    soft-404 gap in the standalone build).
 *
 * The client-side `BrandThemeSetter` still runs and keeps the attribute in
 * sync during SPA navigations (where the layout server component is not
 * re-rendered but the route changes).
 */
export default async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl

  // --- Admin auth guard (V9 Fix #1) ---
  // Protect every /admin/* route EXCEPT the login page itself. Both
  // `/(dashboard)/...` and `/login` live under `/[locale]/admin/`, so we
  // match on the `/admin/` segment regardless of locale prefix.
  // V13 Group D11: use precise path-segment matching instead of loose includes.
  // `includes('/admin')` matched false positives like `/blog/admin-tips`.
  const isAdminPath = /^\/(ar|en)\/admin(\/|$)/.test(pathname)
  const isAdminLogin = /^\/(ar|en)\/admin\/login(\/|$)/.test(pathname)
  if (isAdminPath && !isAdminLogin) {
    const session = request.cookies.get(SESSION_COOKIE)?.value
    // V11 Fix #9: verifySessionCookie is now async (Web Crypto API).
    if (!await verifySessionCookie(session)) {
      // Build the localized login URL preserving the current locale.
      const localeMatch = pathname.match(/^\/(ar|en)\//)
      const locale = localeMatch ? localeMatch[1] : 'ar'
      const loginUrl = new URL(`/${locale}/admin/login`, request.url)
      // 307 preserves the method (GET) — important if the user later
      // POSTs a form after re-authenticating.
      return NextResponse.redirect(loginUrl, 307)
    }
  }

  // --- Product slug existence check (V10 Fix #1) ---
  // Match /ar/products/<slug> or /en/products/<slug> (but NOT /products
  // itself, which is the product listing page).
  const productMatch = pathname.match(/^\/(ar|en)\/products\/([^/]+)$/)
  if (productMatch) {
    const [, locale, slug] = productMatch
    // Skip special non-product slugs (shouldn't match, but defense-in-depth).
    if (slug !== 'categories' && slug !== 'search' && !slug.startsWith('_')) {
      const notFoundResponse = await checkProductExists(request, locale, slug)
      if (notFoundResponse) {
        return notFoundResponse
      }
    }
  }

  const response = intlMiddleware(request)
  response.headers.set('x-pathname', pathname)
  return response
}

export const config = {
  // Match everything except:
  // - API routes (`/api/...`)
  // - Next.js internals (`/_next/...`, `/_vercel/...`)
  // - Files with extensions (static assets, favicons, etc.)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
