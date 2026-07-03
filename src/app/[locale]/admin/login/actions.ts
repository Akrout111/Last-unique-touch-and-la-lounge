'use server'

import { login, logout } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { rateLimit } from '@/lib/rate-limiter'

/** 5 login attempts per minute per IP — brute-force protection. */
const LOGIN_MAX = 5
const LOGIN_WINDOW_MS = 60 * 1000

async function getClientIp(): Promise<string> {
  const h = await headers()
  return (
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    h.get('x-real-ip') ||
    'unknown'
  )
}

export async function loginAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const ip = await getClientIp()
  const { allowed } = rateLimit(`login:${ip}`, LOGIN_MAX, LOGIN_WINDOW_MS)
  if (!allowed) {
    return { success: false, error: 'rate_limited' }
  }

  const password = formData.get('password') as string
  if (!password) return { success: false, error: 'missing_password' }

  const success = await login(password)
  if (!success) return { success: false, error: 'invalid_password' }

  revalidatePath('/admin')
  return { success: true }
}

export async function logoutAction(): Promise<void> {
  await logout()
  revalidatePath('/admin')
}
