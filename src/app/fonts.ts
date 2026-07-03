import { Inter, Tajawal, Cormorant_Garamond, DM_Mono, Orbitron, Rajdhani, Cairo } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const tajawal = Tajawal({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-tajawal',
  weight: ['300', '400', '500', '700', '900'],
})

export const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

export const dmMono = DM_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500'],
})

export const orbitron = Orbitron({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-birthday-headline',
  weight: ['400', '700', '900'],
})

export const rajdhani = Rajdhani({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-birthday-sub',
  weight: ['400', '500', '700'],
})

export const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-birthday-arabic',
  weight: ['400', '700', '900'],
})
