export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink">
      {/* Branded loading spinner — matches the dark hero theme.
          Was: plain white screen with "..." which looked like a broken page. */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          {/* Spinning gold ring */}
          <div className="absolute inset-0 rounded-full border-2 border-gold/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold animate-spin" />
        </div>
        <div className="eyebrow text-gold/60 text-xs tracking-[0.3em]">
          Last Unique Touch
        </div>
      </div>
    </div>
  )
}
