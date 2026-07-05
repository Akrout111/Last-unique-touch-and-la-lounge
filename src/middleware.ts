import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

/**
 * Wraps next-intl's middleware so we can additionally expose the matched
 * pathname to the server layer via the `x-pathname` response header.
 *
 * `src/app/[locale]/layout.tsx` reads this header with `headers()` and sets
 * `data-brand` on <html> server-side — this gives a correct brand attribute
 * on the very first SSR response (before client hydration), so per-brand CSS
 * variables apply without a flash and the initial server-rendered HTML is
 * brand-correct (important for SEO, social scrapers, and no-JS clients).
 *
 * The client-side `BrandThemeSetter` still runs and keeps the attribute in
 * sync during SPA navigations (where the layout server component is not
 * re-rendered but the route changes).
 */
export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request)
  response.headers.set('x-pathname', request.nextUrl.pathname)
  return response
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
