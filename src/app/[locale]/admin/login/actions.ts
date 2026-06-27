'use server'

import { login, logout } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function loginAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
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
