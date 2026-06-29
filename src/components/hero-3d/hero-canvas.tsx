'use client'

import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, AdaptiveEvents, Preload, Environment } from '@react-three/drei'
import { Suspense, useEffect, useState } from 'react'
import { Model3D } from './model-3d'
import { WaveLines, Particles } from './wave-content'
import { shouldEnable3D } from '@/lib/device-capabilities'
import * as THREE from 'three'
import { PerfMonitor } from './perf-monitor'

interface HeroCanvasProps {
  modelsVisible: boolean
  cardRefs: React.RefObject<HTMLElement | null>[]
}

export function HeroCanvas({ modelsVisible, cardRefs }: HeroCanvasProps) {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleVisibility = () => setIsVisible(!document.hidden)
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  if (!mounted || !shouldEnable3D()) return null

  return (
    <div
      className="fixed inset-0 z-30"
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    >
      {isVisible && (
        <Canvas
          camera={{ position: [0, 0, 8], fov: 35, near: 0.1, far: 100 }}
          // ⚠️ Higher DPR for sharper models
          dpr={[1, typeof window !== 'undefined' && window.innerWidth > 768 ? 2 : 1.5]}
          frameloop="always"
          shadows // ⚠️ Enable shadows globally
          gl={{
            antialias: true, // ⚠️ Smoother edges
            powerPreference: 'high-performance',
            alpha: true,
            stencil: false,
            depth: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.1,
          }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping
            gl.toneMappingExposure = 1.1
          }}
          style={{ background: 'transparent', pointerEvents: 'none' }}
        >
          {/* === Professional 3-point lighting === */}
          {/* Key light (main) */}
          <directionalLight
            position={[5, 8, 5]}
            intensity={1.2}
            color="#FFFFFF"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={20}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          {/* Fill light (softens shadows) */}
          <directionalLight
            position={[-5, 3, 5]}
            intensity={0.4}
            color="#D4A574"
          />
          {/* Rim light (backlight for separation) */}
          <directionalLight
            position={[0, 2, -5]}
            intensity={0.6}
            color="#E62129"
          />
          {/* Soft ambient base */}
          <ambientLight intensity={0.3} />

          {/* === Environment for realistic reflections === */}
          <Environment preset="studio" background={false} />

          {/* Wave background (very subtle) */}
          <WaveLines />
          <Particles />

          <Suspense fallback={null}>
            {/* LUT — chair and table — TOP-LEFT corner inside card */}
            <Model3D
              url="/models/The_chair_and_the_table_compressed.glb"
              cardRef={cardRefs[0]}
              rotation={[0, -Math.PI / 6, 0]}
              scale={0.6}
              phaseOffset={0}
              visible={modelsVisible}
              corner="top-left"
            />
            {/* La Lounge — sofa — TOP-RIGHT corner inside card */}
            <Model3D
              url="/models/The_unfinished_sofa_compressed.glb"
              cardRef={cardRefs[1]}
              rotation={[0, Math.PI / 6, 0]}
              scale={0.55}
              phaseOffset={1}
              visible={modelsVisible}
              corner="top-right"
            />
            {/* Your Birthday — dance floor — TOP-RIGHT corner inside card */}
            <Model3D
              url="/models/the_dance_floor_and_the_light_holder_compressed.glb"
              cardRef={cardRefs[2]}
              rotation={[0, Math.PI / 4, 0]}
              scale={0.5}
              phaseOffset={2}
              visible={modelsVisible}
              corner="top-right"
            />
          </Suspense>

          <AdaptiveDpr pixelated={false} />
          <AdaptiveEvents />
          <Preload all />
          <PerfMonitor />
        </Canvas>
      )}
    </div>
  )
}
