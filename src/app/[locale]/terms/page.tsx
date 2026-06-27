import { getTranslations, getLocale } from 'next-intl/server'
import { LegalPageWrapper } from '@/components/legal/page-header'
import { LegalContent } from '@/components/legal/legal-content'
import { getContent } from '@/lib/content'

export default async function TermsPage() {
  const t = await getTranslations()
  const locale = await getLocale()
  const content = await getContent(locale, 'terms')

  return (
    <LegalPageWrapper
      title={t('terms.title')}
      subtitle={t('terms.subtitle')}
      lastUpdated={t('terms.lastUpdated')}
    >
      <LegalContent content={content} />
    </LegalPageWrapper>
  )
}
