import { isAuthenticated } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { LoginPageView } from '@/components/admin/login-page-view'

export default async function LoginAdminPage() {
  const authed = await isAuthenticated()
  if (authed) redirect('/admin')

  return <LoginPageView />
}
