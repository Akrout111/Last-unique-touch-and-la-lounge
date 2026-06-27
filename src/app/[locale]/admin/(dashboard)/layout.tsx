import { requireAuth } from '@/lib/auth'
import { AdminShell } from '@/components/admin/admin-shell'

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAuth()
  return <AdminShell>{children}</AdminShell>
}
