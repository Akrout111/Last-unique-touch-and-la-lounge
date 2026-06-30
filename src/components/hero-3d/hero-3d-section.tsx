'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import { HeroCanvas } from './hero-canvas'
import { shouldEnable3D } from '@/lib/device-capabilities'

interface Hero3DSectionProps {
  /** Refs to the 3 brand card elements, used by models for DOM-tracked positioning */
  cardRefs: React.RefObject<HTMLElement | null>[]
  children: ReactNode
}

/**
 * Wraps the hero. Renders the 3D canvas (waves + product models) as an
 * absolute overlay with pointer-events:none, so the brand cards underneath
 * stay fully clickable. The models only become visible after the card
 * entrance animation completes, so the pop-in animation lines up with the
 * cards settling into place.
 */
export function Hero3DSection({ cardRefs, children }: Hero3DSectionProps) {
  const [modelsVisible, setModelsVisible] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [inView, setInView] = useState(true)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Detect 3D capability on mount (client-only)
  useEffect(() => {
    setEnabled(shouldEnable3D())
  }, [])

  // Reveal models after the card entrance animation finishes
  // (cards animate in with delay up to ~0.9s + 0.9s duration ≈ 1.8s)
  // Faster on mobile so users see the models sooner
  useEffect(() => {
    if (!enabled) return
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
    const t = setTimeout(() => setModelsVisible(true), isMobile ? 1000 : 1500)
    return () => clearTimeout(t)
  }, [enabled])

  // Pause rendering when the hero is scrolled out of view (saves GPU)
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
    <div ref={sectionRef} className="relative w-full">
      {children}
      {enabled && inView && (
        <HeroCanvas modelsVisible={modelsVisible} cardRefs={cardRefs} />
      )}
    </div>
  )
}
