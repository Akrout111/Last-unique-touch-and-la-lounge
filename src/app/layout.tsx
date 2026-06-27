import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Last Unique Touch',
  description: 'منصة تأجير الأثاث ومعدات الأيفنتات',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // This is a pass-through — the [locale] layout handles html/body
  return children
}
