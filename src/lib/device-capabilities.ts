'use client'

/**
 * Detects whether the current device/browser can comfortably run the 3D hero.
 * Returns false for: reduced-motion preference, no WebGL, very low-end devices.
 */
export function shouldEnable3D(): boolean {
  if (typeof window === 'undefined') return false

  // Respect reduced-motion preference
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    return false
  }

  // Require WebGL
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    if (!gl) return false
  } catch {
    return false
  }

  // Low memory / cores → skip 3D
  const nav = navigator as Navigator & { deviceMemory?: number }
  const mem = nav.deviceMemory ?? 4
  const cores = nav.hardwareConcurrency ?? 4
  if (mem < 4 || cores < 4) return false

  return true
}

/** Mobile device check (used to tune DPR and model scale). */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth <= 768
}
