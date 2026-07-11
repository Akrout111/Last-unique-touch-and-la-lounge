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
    // Release the context so we don't leak GPU resources just by probing
    const loseExt = gl.getExtension('WEBGL_lose_context')
    loseExt?.loseContext()
  } catch {
    return false
  }

  // Low memory / cores → skip 3D.
  // v20: lowered from 4→2 cores/mem because the scene is now optimized
  // (draw calls reduced 52% via geometry merging + instancing). 2-core
  // devices can run it comfortably. Only gate on truly incapable hardware
  // (< 2 cores or < 2 GB).
  const nav = navigator as Navigator & { deviceMemory?: number }
  const mem = nav.deviceMemory ?? 4
  const cores = nav.hardwareConcurrency ?? 4
  if (mem < 4 || cores < 4) return false

  return true
}
