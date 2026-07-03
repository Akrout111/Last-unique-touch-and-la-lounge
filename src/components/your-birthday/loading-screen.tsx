'use client'

import { useEffect, useState } from 'react'
import { translations } from './translations'

interface Props {
  onComplete: () => void
  locale: 'ar' | 'en'
}

export function BirthdayLoadingScreen({ onComplete, locale }: Props) {
  const t = translations[locale].loading
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setVisible(false)
            setTimeout(onComplete, 500)
          }, 300)
          return 100
        }
        return prev + 2
      })
    }, 20)
    return () => clearInterval(interval)
  }, [onComplete])

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
