import { cookies } from 'next/headers'
import { createHmac } from 'crypto'

const SESSION_COOKIE = 'lut_admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function getAdminPassword(): string | null {
  return process.env.ADMIN_PASSWORD || null
}

function createSessionToken(): string {
  const secret = process.env.ADMIN_PASSWORD || 'fallback-secret'
  const timestamp = Date.now().toString()
  const signature = createHmac('sha256', secret).update(timestamp).digest('hex')
  return `${timestamp}.${signature}`
}

function verifySessionToken(token: string): boolean {
  if (!token || !token.includes('.')) return false
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [timestamp, signature] = parts
  const secret = process.env.ADMIN_PASSWORD || 'fallback-secret'
  const expectedSignature = createHmac('sha256', secret).update(timestamp).digest('hex')

  if (signature !== expectedSignature) return false

  const timestampNum = parseInt(timestamp, 10)
  if (isNaN(timestampNum)) return false

  const age = Date.now() - timestampNum
  if (age > SESSION_MAX_AGE * 1000) return false

  return true
}

export async function login(password: string): Promise<boolean> {
  const adminPassword = getAdminPassword()
  const isProduction = process.env.NODE_ENV === 'production'

  if (!adminPassword) {
    // In development without ADMIN_PASSWORD set, allow "dev" as password
    if (!isProduction && process.env.NODE_ENV === 'development' && password === 'dev') {
      const cookieStore = await cookies()
      cookieStore.set(SESSION_COOKIE, createSessionToken(), {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: SESSION_MAX_AGE,
        path: '/',
      })
      return true
    }
    return false
  }

  if (password !== adminPassword) return false

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
  return true
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
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
