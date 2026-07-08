import { cookies } from 'next/headers'
import { createHmac, timingSafeEqual } from 'crypto'

const SESSION_COOKIE = 'lut_admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

// Dev-only secret. Used ONLY when SESSION_SECRET is not set and NODE_ENV !== 'production'.
// In production, a missing SESSION_SECRET causes the module to throw at load time.
const DEV_ONLY_SESSION_SECRET = 'dev-insecure-session-secret-do-not-use-in-prod'

/**
 * Resolve the session secret used to sign/verify admin session tokens.
 *
 * - Production: SESSION_SECRET MUST be set, otherwise we throw (fail-closed).
 * - Development: SESSION_SECRET is preferred; if absent, fall back to a
 *   dev-only secret and emit a loud warning.
 */
function getSessionSecret(): string {
  const isProduction = process.env.NODE_ENV === 'production'
  const envSecret = process.env.SESSION_SECRET

  if (envSecret && envSecret.length >= 32) {
    return envSecret
  }

  if (isProduction) {
    throw new Error(
      'SESSION_SECRET must be set to a string of at least 32 characters in production.'
    )
  }

  // Development fallback
  if (!envSecret) {
    console.warn(
      '[auth] WARNING: SESSION_SECRET is not set. Using dev-only insecure secret. ' +
        'Do NOT use in production. Set SESSION_SECRET in your environment.'
    )
    return DEV_ONLY_SESSION_SECRET
  }

  // envSecret provided but too short in dev — warn but allow.
  console.warn(
    `[auth] WARNING: SESSION_SECRET is shorter than 32 chars (got ${envSecret.length}). ` +
      'This is acceptable in development only.'
  )
  return envSecret
}

/**
 * Resolve the configured admin password.
 *
 * - Production: ADMIN_PASSWORD MUST be set, otherwise we throw (fail-closed).
 * - Development: ADMIN_PASSWORD is preferred; if absent, fall back to a
 *   dev-only password ("dev") and emit a loud warning.
 */
function getAdminPassword(): string {
  const isProduction = process.env.NODE_ENV === 'production'
  const envPassword = process.env.ADMIN_PASSWORD

  if (envPassword) {
    return envPassword
  }

  if (isProduction) {
    throw new Error('ADMIN_PASSWORD must be set in production.')
  }

  console.warn(
    '[auth] WARNING: ADMIN_PASSWORD is not set. Using dev-only password "dev". ' +
      'Do NOT use in production. Set ADMIN_PASSWORD in your environment.'
  )
  return 'dev'
}

/**
 * Constant-time string comparison to prevent timing attacks on passwords.
 * Returns true iff the two strings are byte-equal.
 */
function safeEqualStrings(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, 'utf8')
  const bBuf = Buffer.from(b, 'utf8')
  if (aBuf.length !== bBuf.length) {
    // Still perform a comparison to keep timing roughly constant.
    timingSafeEqual(aBuf, aBuf)
    return false
  }
  return timingSafeEqual(aBuf, bBuf)
}

function createSessionToken(): string {
  const secret = getSessionSecret()
  const timestamp = Date.now().toString()
  const signature = createHmac('sha256', secret).update(timestamp).digest('hex')
  return `${timestamp}.${signature}`
}

function verifySessionToken(token: string): boolean {
  if (!token || !token.includes('.')) return false
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [timestamp, signature] = parts

  let secret: string
  try {
    secret = getSessionSecret()
  } catch {
    // If the secret cannot be resolved (e.g. misconfigured production env),
    // fail closed — no token is considered valid.
    return false
  }

  const expectedSignature = createHmac('sha256', secret).update(timestamp).digest('hex')

  // Constant-time comparison of the signature.
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
  if (age > SESSION_MAX_AGE * 1000) return false

  return true
}

export async function login(password: string): Promise<boolean> {
  const isProduction = process.env.NODE_ENV === 'production'

  let adminPassword: string
  try {
    adminPassword = getAdminPassword()
  } catch {
    // Fail closed in production if ADMIN_PASSWORD is not set.
    return false
  }

  // Constant-time password comparison.
  if (!safeEqualStrings(password, adminPassword)) return false

  // V13 Group B: Wrap cookie creation in try/catch so a cookie-setting
  // failure (e.g. in edge/preview environments where cookies() may throw)
  // returns false instead of crashing the server action.
  try {
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, createSessionToken(), {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    })
    return true
  } catch (error) {
    console.error('[auth] Failed to create session:', error)
    return false
  }
}

export async function logout(): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(SESSION_COOKIE)
  } catch (error) {
    console.error('[auth] Failed to delete session cookie:', error)
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return false
  return verifySessionToken(token)
}

/**
 * Redirects to login if not authenticated.
 * Use in Server Components.
 */
export async function requireAuth(): Promise<void> {
  const authed = await isAuthenticated()
  if (!authed) {
    const { redirect } = await import('next/navigation')
    redirect('/admin/login')
  }
}
