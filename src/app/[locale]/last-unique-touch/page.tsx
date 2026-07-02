import { getTranslations } from 'next-intl/server'
import LastUniqueTouchView from '@/components/last-unique-touch/last-unique-touch-view'

export async function generateMetadata() {
  const t = await getTranslations()
  return {
    title: t('brandSelector.lut.name'),
    description: t('brandSelector.lut.desc'),
  }
}

export default function LastUniqueTouchPage() {
  return <LastUniqueTouchView />
}
