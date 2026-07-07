import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import bundleAnalyzer from '@next/bundle-analyzer'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  output: 'standalone',
  // Prisma Client must remain external to the Next.js bundle so that the
  // standalone server output can resolve it (and its generated `.prisma/client`
  // sibling) from node_modules at runtime. Without this, the standalone build
  // tries to bundle Prisma and fails with `Cannot find module '@prisma/client'`
  // or `PrismaClient is not a constructor` errors.
  serverExternalPackages: ['@prisma/client', '.prisma/client'],
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  // Don't expose Next.js in the X-Powered-By response header (D4).
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  async headers() {
    // --- Content Security Policy (D4) ---
    // Strict-by-default policy. 'unsafe-inline' is required for scripts
    // and styles because Next.js injects inline <script> hydration data
    // and inline <style> tags at runtime. 'unsafe-eval' is deliberately
    // NOT included in production — that would defeat the CSP.
    //
    // In dev mode, React Refresh (HMR) needs `unsafe-eval` to transform
    // JSX on the fly. Without it, hydration silently fails and the page
    // is server-rendered-only (no interactivity, no useState updates).
    // We add `'unsafe-eval'` to script-src only when NODE_ENV !== 'production'.
    const isDev = process.env.NODE_ENV !== 'production'
    const scriptSrc = isDev
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
      : "script-src 'self' 'unsafe-inline'"
    const csp = [
      "default-src 'self'",
      scriptSrc,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      // In dev, allow HMR websocket + eval-based source maps.
      isDev ? "connect-src 'self' ws: w:" : "connect-src 'self'",
      "frame-ancestors https://*.space-z.ai https://space-z.ai",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join('; ')

    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
        { key: 'Content-Security-Policy', value: csp },
      ],
    }]
  },
}

export default withBundleAnalyzer(withNextIntl(nextConfig))
