'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface ParallaxImageProps {
  children: ReactNode
  className?: string
  offset?: number
}

export function ParallaxImage({
  children,
  className = '',
  offset = 100,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [-offset / 2, offset / 2])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y, scale }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  )
}
