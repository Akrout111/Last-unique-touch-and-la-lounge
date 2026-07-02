import { useTranslations } from 'next-intl'

export default function Loading() {
  const t = useTranslations()

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink">
      {/* Branded loading spinner — matches the dark hero theme.
          Was: plain white screen with "..." which looked like a broken page. */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          {/* Spinning brand ring */}
          <div className="absolute inset-0 rounded-full border-2 border-brand/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand animate-spin" />
        </div>
        <div className="eyebrow text-brand/60 text-xs tracking-[0.3em]">
          Last Unique Touch
        </div>
        <p className="text-brand/60 text-sm" role="status" aria-live="polite">
          {t('common.loading')}
        </p>
      </div>
    </div>
  )
}
