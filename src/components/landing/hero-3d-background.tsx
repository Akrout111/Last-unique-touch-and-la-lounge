'use client'

/**
 * Hero3DBackground — ONE unified blueprint with per-section 3D overlays.
 *
 * Design (v18-build-H3):
 *   - ONE continuous blueprint grid (gridHelper + radial rings + radar) spans
 *     the ENTIRE hero background, covering all three card areas.
 *   - 3D content is overlaid at each card's vertical position:
 *       • Top    (card 1 — LUT):       real 3D furniture meshes (solid materials)
 *       • Middle (card 2 — La Lounge): wireframe event architecture (stage, trusses, booths)
 *       • Bottom (card 3 — Birthday):  3D party objects (balloons, cake, confetti)
 *   - Section Y positions are computed DYNAMICALLY from the actual card centers
 *     measured via getBoundingClientRect() — guarantees alignment on both
 *     mobile (390px) and desktop (1280px) viewports. Re-measured on resize
 *     and after window load.
 *
 * Performance:
 *   - shouldEnable3D() gating (returns null on low-end / reduced-motion / no WebGL)
 *   - IntersectionObserver + frameloop toggle (no unmount → no WebGL context churn)
 *   - dpr clamped to [1, 1.5]
 *   - geometries + materials memoized & disposed on unmount
 *   - alpha:true so the CSS fallback (gradient/grid/orbs) shows through for depth
 */

import { useRef, useState, useEffect, useMemo, type ReactElement } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { shouldEnable3D } from '@/lib/device-capabilities'
import { BRAND_COLORS } from '@/lib/brand-colors'

// === Brand tints (light pinks for the unified blueprint grid) ===
const PINK_LIGHT = '#FFD1E8' // ≈ pink-200 — base grid cross-lines
const PINK_LIGHTER = '#FFEFF6' // ≈ pink-50 — base grid lines (lightest)
const PINK_SOFT = '#FFE0EF' // ≈ pink-100 — secondary grid lines
const PINK_MID = '#FFB3D9' // ≈ pink-300 — radial grid rings

// Furniture material tones (LUT section).
const WOOD = '#8B6F47'
const GOLD_TONE = '#D4A574'
const IVORY = '#F5F1E8'

type Vec3 = [number, number, number]

// ============================================================
// UNIFIED BLUEPRINT GRID — one continuous grid covering everything
// ============================================================

function UnifiedBlueprintGrid() {
  const gridRef = useRef<THREE.Group>(null)
  const radarRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.rotation.y = state.clock.elapsedTime * 0.008
    }
    if (radarRef.current) {
      radarRef.current.rotation.z = -state.clock.elapsedTime * 0.3
    }
  })

  return (
    <group ref={gridRef}>
      {/* Main grid — LARGE, covers entire scene (300 units across, 150 divisions) */}
      <gridHelper args={[300, 150, PINK_LIGHT, PINK_LIGHTER]} position={[0, 0, 0]} />
      {/* Secondary grid — denser major lines */}
      <gridHelper
        args={[300, 30, BRAND_COLORS.LA_LOUNGE_LIGHT, PINK_SOFT]}
        position={[0, -0.01, 0]}
      />

      {/* Radial rings centered on each card area (visual continuity between sections) */}
      {([26, 0, -26] as const).map((y) => (
        <group key={`rings_${y}`} position={[0, y, 0]}>
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh key={`ring_${y}_${i}`} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[4 + i * 4, 4.04 + i * 4, 64]} />
              <meshBasicMaterial
                color={PINK_MID}
                transparent
                opacity={0.2}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Radar sweep (centered on the middle section) */}
      <mesh ref={radarRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[150, 64]} />
        <meshBasicMaterial
          color={BRAND_COLORS.LA_LOUNGE_LIGHT}
          transparent
          opacity={0.03}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Crosshair lines spanning the full height (architectural plan vibe) */}
      {Array.from({ length: 16 }).map((_, i) => (
        <mesh key={`cross_${i}`} rotation={[0, (i * Math.PI) / 16, 0]}>
          <boxGeometry args={[300, 0.005, 0.03]} />
          <meshBasicMaterial color={PINK_LIGHT} transparent opacity={0.15} />
        </mesh>
      ))}
    </group>
  )
}

// ============================================================
// LUT FURNITURE — real 3D meshes, positioned at card 1 Y
// ============================================================

function FurnitureChair({ position, color }: { position: Vec3; color: string }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.position.y = position[1] + Math.sin(t * 0.8 + position[0]) * 0.2
    ref.current.rotation.y = Math.sin(t * 0.3 + position[2]) * 0.15
  })
  return (
    <group ref={ref} position={position}>
      {/* Seat */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.2, 0.15, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 1.1, -0.5]}>
        <boxGeometry args={[1.2, 1.2, 0.15]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Legs (gold) */}
      {(
        [
          [-0.5, -0.5],
          [0.5, -0.5],
          [-0.5, 0.5],
          [0.5, 0.5],
        ] as Array<[number, number]>
      ).map(([x, z], i) => (
        <mesh key={i} position={[x, 0, z]}>
          <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
          <meshStandardMaterial color={GOLD_TONE} metalness={1} roughness={0.2} />
        </mesh>
      ))}
    </group>
  )
}

function FurnitureTable({ position, color }: { position: Vec3; color: string }) {
  return (
    <group position={position}>
      {/* Top (ivory) */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.1, 32]} />
        <meshStandardMaterial color={IVORY} roughness={0.1} metalness={0.3} />
      </mesh>
      {/* Pole (wood) */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1, 16]} />
        <meshStandardMaterial color={WOOD} roughness={0.5} />
      </mesh>
      {/* Base (wood) */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
        <meshStandardMaterial color={WOOD} roughness={0.5} />
      </mesh>
      {/* Tablecloth accent (brand red) */}
      <mesh position={[0, 1.06, 0]}>
        <cylinderGeometry args={[1.55, 1.55, 0.02, 32]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0} />
      </mesh>
    </group>
  )
}

function LutFurniture({ y }: { y: number }) {
  return (
    <group position={[0, y, 0]}>
      <FurnitureChair position={[-5, 0, 0]} color={BRAND_COLORS.LUT} />
      <FurnitureChair position={[-2, 0, 1]} color={IVORY} />
      <FurnitureChair position={[4, 0, -1]} color={BRAND_COLORS.LUT} />
      <FurnitureTable position={[-3.5, 0, 2]} color={BRAND_COLORS.LUT} />
      <FurnitureTable position={[3, 0, 1]} color={BRAND_COLORS.LUT} />
    </group>
  )
}

// ============================================================
// LA LOUNGE ARCHITECTURE — wireframe event blueprint, positioned at card 2 Y
// ============================================================

function LaLoungeArchitecture({ y }: { y: number }) {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.01
    }
  })

  // Memoize geometries + materials and dispose them on unmount (R3F does not
  // auto-dispose geometries passed via the `geometry={...}` prop).
  const { elements, materials, geometries } = useMemo(() => {
    const items: ReactElement[] = []
    const geos: THREE.BufferGeometry[] = []
    const track = <T extends THREE.BufferGeometry>(geo: T): T => {
      geos.push(geo)
      return geo
    }

    const matBold = new THREE.LineBasicMaterial({
      color: BRAND_COLORS.LA_LOUNGE,
      transparent: true,
      opacity: 0.9,
    })
    const matMain = new THREE.LineBasicMaterial({
      color: BRAND_COLORS.LA_LOUNGE,
      transparent: true,
      opacity: 0.7,
    })
    const matSub = new THREE.LineBasicMaterial({
      color: BRAND_COLORS.LA_LOUNGE_LIGHT,
      transparent: true,
      opacity: 0.5,
    })

    // Stage platform
    const stageGeo = track(new THREE.BoxGeometry(16, 0.8, 8))
    items.push(
      <lineSegments
        key="stage"
        geometry={track(new THREE.EdgesGeometry(stageGeo))}
        material={matBold}
        position={[0, 0.4, 0]}
      />,
    )

    // LED screen
    const screenGeo = track(new THREE.BoxGeometry(14, 6, 0.3))
    items.push(
      <lineSegments
        key="screen"
        geometry={track(new THREE.EdgesGeometry(screenGeo))}
        material={matBold}
        position={[0, 4, -3.5]}
      />,
    )

    // Truss pillars (4 corners)
    for (const [x, z] of [
      [-10, -5],
      [10, -5],
      [-10, 5],
      [10, 5],
    ] as Array<[number, number]>) {
      const pillarGeo = track(new THREE.BoxGeometry(0.6, 10, 0.6))
      items.push(
        <lineSegments
          key={`pil_${x}_${z}`}
          geometry={track(new THREE.EdgesGeometry(pillarGeo))}
          material={matMain}
          position={[x, 5, z]}
        />,
      )
    }

    // Seating booths (semi-circular tori)
    for (const side of [-1, 1] as const) {
      const boothGeo = track(new THREE.TorusGeometry(2.5, 0.8, 8, 16, Math.PI))
      items.push(
        <lineSegments
          key={`booth_${side}`}
          geometry={track(new THREE.EdgesGeometry(boothGeo))}
          material={matMain}
          position={[side * 6, 0.5, 3]}
          rotation={[Math.PI / 2, 0, side > 0 ? Math.PI / 2 : -Math.PI / 2]}
        />,
      )
    }

    // Tables + chairs (4 clusters)
    for (const [tx, tz] of [
      [-4, -2],
      [4, -2],
      [-4, 4],
      [4, 4],
    ] as Array<[number, number]>) {
      const tGeo = track(new THREE.CylinderGeometry(1.2, 1.2, 0.5, 16))
      items.push(
        <lineSegments
          key={`tab_${tx}_${tz}`}
          geometry={track(new THREE.EdgesGeometry(tGeo))}
          material={matSub}
          position={[tx, 0.25, tz]}
        />,
      )
      for (let c = 0; c < 4; c++) {
        const angle = (c / 4) * Math.PI * 2
        const cGeo = track(new THREE.BoxGeometry(0.5, 0.8, 0.5))
        items.push(
          <lineSegments
            key={`chair_${tx}_${tz}_${c}`}
            geometry={track(new THREE.EdgesGeometry(cGeo))}
            material={matSub}
            position={[tx + Math.cos(angle) * 2, 0.4, tz + Math.sin(angle) * 2]}
          />,
        )
      }
    }

    return {
      elements: items,
      materials: { matBold, matMain, matSub },
      geometries: geos,
    }
  }, [])

  useEffect(() => {
    return () => {
      materials.matBold.dispose()
      materials.matMain.dispose()
      materials.matSub.dispose()
      geometries.forEach((g) => g.dispose())
    }
  }, [materials, geometries])

  return (
    <group ref={groupRef} position={[0, y, 0]}>
      {elements}
      {/* Center dance floor rings */}
      {[3, 5, 7].map((r, i) => (
        <mesh key={`dring_${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
          <ringGeometry args={[r, r + 0.15, 64]} />
          <meshBasicMaterial
            color={BRAND_COLORS.LA_LOUNGE}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

// ============================================================
// BIRTHDAY PARTY OBJECTS — 3D meshes, positioned at card 3 Y
// ============================================================

function Balloon({ position, color }: { position: Vec3; color: string }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.position.y = position[1] + Math.sin(t * 0.5 + position[0]) * 0.5
    ref.current.position.x = position[0] + Math.cos(t * 0.3 + position[2]) * 0.2
  })
  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </mesh>
      {/* String */}
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 1, 4]} />
        <meshBasicMaterial color={IVORY} />
      </mesh>
    </group>
  )
}

function BirthdayCake({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      {/* Bottom tier */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.6, 32]} />
        <meshStandardMaterial color={IVORY} roughness={0.5} />
      </mesh>
      {/* Middle tier */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.5, 32]} />
        <meshStandardMaterial color={BRAND_COLORS.YOUR_BIRTHDAY} roughness={0.4} />
      </mesh>
      {/* Top tier */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.4, 32]} />
        <meshStandardMaterial color={IVORY} roughness={0.5} />
      </mesh>
      {/* Candle */}
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
        <meshStandardMaterial color={BRAND_COLORS.LUT} />
      </mesh>
      {/* Flame */}
      <mesh position={[0, 1.85, 0]}>
        <coneGeometry args={[0.08, 0.2, 8]} />
        <meshStandardMaterial
          color={BRAND_COLORS.YOUR_BIRTHDAY}
          emissive={BRAND_COLORS.YOUR_BIRTHDAY}
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  )
}

function Confetti({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30
      pos[i * 3 + 1] = Math.random() * 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return pos
  }, [count])

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.5
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={BRAND_COLORS.YOUR_BIRTHDAY}
        size={0.3}
        sizeAttenuation
        transparent
        opacity={0.7}
      />
    </points>
  )
}

function BirthdayParty({ y }: { y: number }) {
  return (
    <group position={[0, y, 0]}>
      <Balloon position={[-5, 1, 0]} color={BRAND_COLORS.YOUR_BIRTHDAY} />
      <Balloon position={[-2, 2, 1]} color={BRAND_COLORS.LA_LOUNGE} />
      <Balloon position={[2, 1.5, -1]} color="#A855F7" />
      <Balloon position={[5, 2, 0]} color={BRAND_COLORS.YOUR_BIRTHDAY_LIGHT} />
      <BirthdayCake position={[0, 0, 2]} />
      <Confetti count={30} />
      {/* Party light beams */}
      {[-6, 6].map((x, i) => (
        <mesh
          key={`light_${i}`}
          position={[x, 4, -3]}
          rotation={[0.3, x > 0 ? -0.3 : 0.3, 0]}
        >
          <coneGeometry args={[1.5, 6, 8, 1, true]} />
          <meshBasicMaterial
            color={i === 0 ? BRAND_COLORS.YOUR_BIRTHDAY : BRAND_COLORS.LA_LOUNGE}
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

// ============================================================
// CAMERA RIG — follows the vertical center of the three sections
// ============================================================

function CameraRig({
  sectionYs,
}: {
  sectionYs: { lut: number; lalounge: number; birthday: number }
}) {
  useFrame((state) => {
    const t = state.clock.elapsedTime
    // Camera follows the vertical midpoint between LUT and Birthday sections
    // so all three sections remain in view at once.
    const centerY = (sectionYs.lut + sectionYs.birthday) / 2
    state.camera.position.x = Math.sin(t * 0.04) * 3
    state.camera.position.y = centerY
    state.camera.position.z = 50
    state.camera.lookAt(0, centerY, 0)
  })
  return null
}

// ============================================================
// MAIN EXPORT
// ============================================================

export function Hero3DBackground() {
  const [enabled, setEnabled] = useState(false)
  // Keep the Canvas mounted at all times (never unmount via inView) —
  // toggling frameloop instead prevents WebGL context-loss cycles.
  const [inView, setInView] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const [sectionYs, setSectionYs] = useState({
    lut: 12,
    lalounge: 0,
    birthday: -12,
  })

  useEffect(() => {
    setEnabled(shouldEnable3D())
  }, [])

  // Measure actual card positions and compute 3D Y offsets that align
  // the 3D sections with their respective cards on both mobile + desktop.
  useEffect(() => {
    const measure = () => {
      const cards = document.querySelectorAll('[role=button]')
      const section = document.querySelector('section')
      if (!cards.length || !section) return
      const sectionRect = section.getBoundingClientRect()
      const sectionH = sectionRect.height
      if (sectionH === 0) return

      // Card centers as fraction of section height (0 = top, 1 = bottom)
      const cardCenters = Array.from(cards).map((c) => {
        const r = (c as HTMLElement).getBoundingClientRect()
        return (r.top + r.bottom) / 2 - sectionRect.top
      })

      // Map to 3D Y. Camera at z=50, fov=50 → visible Y = ±tan(25°)*50 ≈ ±23.3
      // We want card 1 (top) → positive Y, card 3 (bottom) → negative Y.
      // Convert fraction (0..1) to Y: fraction 0.5 → Y=0, 0.0 → Y=+23, 1.0 → Y=-23
      const visibleY = Math.tan((50 * Math.PI) / 180 / 2) * 50
      const toY = (frac: number) => (0.5 - frac) * 2 * visibleY

      // Only update if we have at least 3 cards measured
      if (cardCenters.length >= 3) {
        setSectionYs({
          lut: toY(cardCenters[0] / sectionH),
          lalounge: toY(cardCenters[1] / sectionH),
          birthday: toY(cardCenters[2] / sectionH),
        })
      }
    }

    measure()
    // Re-measure on resize + after fonts/images load
    window.addEventListener('resize', measure)
    window.addEventListener('load', measure)
    const timeoutId = setTimeout(measure, 500) // after hydration
    // ResizeObserver catches layout shifts that the resize event misses
    // (e.g. fonts loading, images loading, dynamic content).
    const ro = new ResizeObserver(() => measure())
    const section = document.querySelector('section')
    if (section) ro.observe(section)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('load', measure)
      clearTimeout(timeoutId)
      ro.disconnect()
    }
  }, [])

  useEffect(() => {
    const node = containerRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setInView(entry.isIntersecting)
        }
      },
      { threshold: 0.05 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  if (!enabled) return null

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
    >
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        camera={{ position: [0, 0, 50], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true,
          stencil: false,
          depth: true,
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (e) => e.preventDefault())
        }}
      >
        <fog attach="fog" args={['#0a0a0a', 30, 100]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} intensity={1} />
        <directionalLight position={[-10, -5, -5]} intensity={0.3} color="#FFD1E8" />

        <CameraRig sectionYs={sectionYs} />

        {/* UNIFIED blueprint grid — one continuous grid covering everything */}
        <UnifiedBlueprintGrid />

        {/* 3D overlays at each card's Y position */}
        <group scale={1.5}>
          <LutFurniture y={sectionYs.lut} />
        </group>
        <LaLoungeArchitecture y={sectionYs.lalounge} />
        <group scale={1.5}>
          <BirthdayParty y={sectionYs.birthday} />
        </group>
      </Canvas>
    </div>
  )
}
