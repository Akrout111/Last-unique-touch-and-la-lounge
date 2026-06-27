import { getTranslations, getLocale } from 'next-intl/server'
import { LegalPageWrapper } from '@/components/legal/page-header'
import { LegalContent } from '@/components/legal/legal-content'
import { getContent } from '@/lib/content'

export default async function RefundPage() {
  const t = await getTranslations()
  const locale = await getLocale()
  const content = await getContent(locale, 'refund')

  return (
    <LegalPageWrapper
      title={t('refund.title')}
      subtitle={t('refund.subtitle')}
      lastUpdated={t('refund.lastUpdated')}
    >
      <LegalContent content={content} />
    </LegalPageWrapper>
  )
}
