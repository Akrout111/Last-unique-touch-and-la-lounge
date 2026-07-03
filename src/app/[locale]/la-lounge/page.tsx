import { getTranslations } from 'next-intl/server'
import LaLoungeView from '@/components/la-lounge/la-lounge-view'

export async function generateMetadata() {
  const t = await getTranslations()
  return {
    title: t('brandSelector.lalounge.name'),
    description: t('brandSelector.lalounge.desc'),
  }
}

export default function LaLoungePage() {
  return <LaLoungeView />
}
