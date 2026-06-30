'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import { HeroCanvas } from './hero-canvas'
import { shouldEnable3D } from '@/lib/device-capabilities'

interface Hero3DSectionProps {
  cardRefs: React.RefObject<HTMLElement | null>[]
  children: ReactNode
}

export function Hero3DSection({ cardRefs, children }: Hero3DSectionProps) {
  const [modelsVisible, setModelsVisible] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [inView, setInView] = useState(true)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setEnabled(shouldEnable3D())
  }, [])

  useEffect(() => {
    if (!enabled) return
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
    const t = setTimeout(() => setModelsVisible(true), isMobile ? 1000 : 1500)
    return () => clearTimeout(t)
  }, [enabled])

  useEffect(() => {
    if (!enabled || !sectionRef.current) return
    const el = sectionRef.current
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [enabled])

  return (
    // ⚠️ الحاوي الرئيسي — relative ليحتوي كل شيء
    <div ref={sectionRef} className="relative w-full h-full">
      {/* 1. البطاقات (children) — z-10 (في القاع بصرياً) */}
      <div className="relative z-10 w-full h-full">{children}</div>

      {/* 2. Canvas — absolute, z-20, pointer-events-none (فوق البطاقات بصرياً، لكن يسمح بالنقر) */}
      {enabled && inView && (
        <div className="absolute inset-0 z-20 pointer-events-none" aria-hidden="true">
          <HeroCanvas modelsVisible={modelsVisible} cardRefs={cardRefs} />
        </div>
      )}
    </div>
  )
}
