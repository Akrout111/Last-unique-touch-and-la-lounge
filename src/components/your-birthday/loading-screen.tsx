'use client'

import { useEffect, useRef, useState } from 'react'
import { translations } from './translations'

interface Props {
  onComplete: () => void
  locale: 'ar' | 'en'
}

export function BirthdayLoadingScreen({ onComplete, locale }: Props) {
  const t = translations[locale].loading
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)

  // Store onComplete in a ref so the interval effect can stay stable
  // (empty deps) and we avoid re-running the interval when the parent
  // passes a new callback identity on every render.
  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // Interval effect — runs once on mount. Increments progress.
  // Empty deps ensures we never restart the interval mid-flight.
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 2))
    }, 20)
    return () => clearInterval(interval)
  }, [])

  // Completion effect — watches progress and triggers the fade-out
  // + onComplete callback when the bar reaches 100%.
  useEffect(() => {
    if (progress < 100) return
    const hideTimer = setTimeout(() => setVisible(false), 300)
    const completeTimer = setTimeout(() => onCompleteRef.current(), 800)
    return () => {
      clearTimeout(hideTimer)
      clearTimeout(completeTimer)
    }
  }, [progress])

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#020204] transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="text-center">
        {/* Animated logo */}
        <div className="mb-8">
          <h1
            className="text-4xl md:text-6xl font-black tracking-tighter"
            style={{
              fontFamily: 'var(--font-birthday-headline), Orbitron, sans-serif',
              background: 'linear-gradient(135deg, #8B5CF6, #EC4899, #00F3FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Your Birthday
          </h1>
        </div>

        {/* Progress bar */}
        <div className="w-64 mx-auto">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-100"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #8B5CF6, #EC4899, #00F3FF)',
              }}
            />
          </div>
          <p
            className="text-xs text-white/40 mt-2 tracking-widest uppercase font-mono"
            style={{ fontFamily: 'var(--font-birthday-sub), Rajdhani, sans-serif' }}
          >
            {t.loading} {progress}%
          </p>
        </div>
      </div>
    </div>
  )
}
