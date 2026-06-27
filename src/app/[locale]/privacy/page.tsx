import { getTranslations, getLocale } from 'next-intl/server'
import { LegalPageWrapper } from '@/components/legal/page-header'
import { LegalContent } from '@/components/legal/legal-content'
import { getContent } from '@/lib/content'

export default async function PrivacyPage() {
  const t = await getTranslations()
  const locale = await getLocale()
  const content = await getContent(locale, 'privacy')

  return (
    <LegalPageWrapper
      title={t('privacy.title')}
      subtitle={t('privacy.subtitle')}
      lastUpdated={t('privacy.lastUpdated')}
    >
      <LegalContent content={content} />
    </LegalPageWrapper>
  )
}
