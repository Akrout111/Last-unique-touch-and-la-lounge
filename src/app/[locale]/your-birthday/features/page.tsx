import { getTranslations } from 'next-intl/server'
import BirthdayFeaturesView from '@/components/your-birthday/features-view'

export async function generateMetadata() {
  const t = await getTranslations()
  return {
    title: t('brandSelector.birthday.name'),
    description: t('brandSelector.birthday.desc'),
  }
}

export default function BirthdayFeaturesPage() {
  return <BirthdayFeaturesView />
}
