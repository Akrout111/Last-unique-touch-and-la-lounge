import { getTranslations } from 'next-intl/server'
import YourBirthdayPageClient from './page-client'

export async function generateMetadata() {
  const t = await getTranslations()
  return {
    title: 'Your Birthday',
    description: t('brandSelector.birthday.desc'),
  }
}

export default function Page() {
  return <YourBirthdayPageClient />
}
