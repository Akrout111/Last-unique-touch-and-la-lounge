'use client'

/**
 * Hero3DBackground — La Lounge blueprint base + LUT furniture top + Birthday party bottom.
 *
 * Design (v19-build-H4):
 *   - ONE continuous MASTER blueprint base (La Lounge's `BlueprintGrid` + `EventArchitecture`
 *     pattern, modified): gridHelper + radial rings + radar sweep + crosshairs +
 *     scattered wireframe platforms/pillars/trusses/tables spanning the full scene.
 *     Uses a neutral mauve/gold palette (not pure La Lounge pink) so it reads as a
 *     "master plan" rather than a La Lounge event plan.
 *   - Dimension annotations (gold accent lines + end marks) at each card's Y position
 *     (LUT / LA_LOUNGE / BIRTHDAY) for an architectural measurement aesthetic.
 *   - 3D content is overlaid ON TOP of the continuous blueprint at each card's vertical
 *     position:
 *       • Top    (card 1 — LUT):       real 3D furniture meshes (chairs, tables, sofa)
 *       • Middle (card 2 — La Lounge): PURE blueprint (master architecture shows through —
 *                                      no separate La Lounge overlay; the master IS the base)
 *       • Bottom (card 3 — Birthday):  3D party objects (balloons, multi-tier cake, confetti)
 *   - Section Y positions are computed DYNAMICALLY from the actual card centers
 *     measured via getBoundingClientRect() — guarantees alignment on both
 *     mobile (390px) and desktop (1280px) viewports. Re-measured on resize,
 *     after window load, and via ResizeObserver.
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
import { PointMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { shouldEnable3D } from '@/lib/device-capabilities'
import { BRAND_COLORS } from '@/lib/brand-colors'

// === Tints for the master-plan blueprint (neutral with pink accents) ===
// Using a softer, more neutral palette than pure La Lounge pink so the
// background feels like a "master plan" rather than a La Lounge event plan.
const GRID_MAIN = '#E8D5E0' // soft mauve — main grid lines
const GRID_LIGHT = '#F5EBF0' // very light pink — fine grid lines
const GRID_ACCENT = '#D4A574' // gold — major grid lines (ties to LUT/birthday)
const RING_COLOR = '#C8A0B0' // muted pink — radial rings
const RADAR_COLOR = '#FFD1E8' // light pink — radar sweep

// Furniture tones
const WOOD = '#8B6F47'
const GOLD_TONE = '#D4A574'
const IVORY = '#F5F1E8'

type Vec3 = [number, number, number]

// ============================================================
// MASTER BLUEPRINT GRID — the continuous base (modified La Lounge style)
// ============================================================

function MasterBlueprintGrid() {
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
      {/* Fine grid (200 divisions) */}
      <gridHelper args={[300, 200, GRID_MAIN, GRID_LIGHT]} position={[0, 0, 0]} />
      {/* Major grid (20 divisions — gold accent lines) */}
      <gridHelper args={[300, 20, GRID_ACCENT, GRID_LIGHT]} position={[0, -0.01, 0]} />

      {/* Radial rings — centered at middle, span the whole scene */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={`radial_${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <ringGeometry args={[8 + i * 6, 8.06 + i * 6, 96]} />
          <meshBasicMaterial color={RING_COLOR} transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Radar sweep */}
      <mesh ref={radarRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[150, 64]} />
        <meshBasicMaterial color={RADAR_COLOR} transparent opacity={0.04} side={THREE.DoubleSide} />
      </mesh>

      {/* Crosshairs */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={`cross_${i}`} rotation={[0, (i * Math.PI) / 20, 0]}>
          <boxGeometry args={[300, 0.005, 0.03]} />
          <meshBasicMaterial color={GRID_MAIN} transparent opacity={0.2} />
        </mesh>
      ))}

      {/* Dimension annotations (architectural measurement marks) */}
      {[
        { y: 25, label: 'LUT' },
        { y: 0, label: 'LA_LOUNGE' },
        { y: -25, label: 'BIRTHDAY' },
      ].map((dim) => (
        <group key={`dim_${dim.label}`} position={[0, dim.y, 0]}>
          {/* Dimension line */}
          <mesh rotation={[0, 0, 0]}>
            <boxGeometry args={[40, 0.02, 0.02]} />
            <meshBasicMaterial color={GRID_ACCENT} transparent opacity={0.3} />
          </mesh>
          {/* End marks */}
          {[-20, 20].map((x) => (
            <mesh key={x} position={[x, 0, 0]}>
              <boxGeometry args={[0.3, 0.3, 0.3]} />
              <meshBasicMaterial color={GRID_ACCENT} transparent opacity={0.4} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

// ============================================================
// MASTER ARCHITECTURE — wireframe event structures (modified from La Lounge)
// Spread across the full background, not just one section.
// ============================================================

function MasterArchitecture() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.005
    }
  })

  const { elements, materials, geometries } = useMemo(() => {
    const items: ReactElement[] = []
    const geos: THREE.BufferGeometry[] = []
    const track = <T extends THREE.BufferGeometry>(geo: T): T => {
      geos.push(geo)
      return geo
    }

    // Materials — muted blueprint ink (not pure La Lounge pink)
    const matBold = new THREE.LineBasicMaterial({
      color: BRAND_COLORS.LA_LOUNGE,
      transparent: true,
      opacity: 0.7,
    })
    const matMain = new THREE.LineBasicMaterial({
      color: RING_COLOR,
      transparent: true,
      opacity: 0.6,
    })
    const matSub = new THREE.LineBasicMaterial({
      color: GRID_ACCENT,
      transparent: true,
      opacity: 0.4,
    })

    // Scattered architectural elements across the full background
    // (not concentrated in one section like La Lounge's stage)

    // Small platform outlines at 3 positions
    const platforms = [
      { x: 0, z: -20, y: 0, w: 12, d: 6 },
      { x: -15, z: 10, y: 0, w: 8, d: 4 },
      { x: 15, z: 10, y: 0, w: 8, d: 4 },
    ]
    platforms.forEach((p, i) => {
      const geo = track(new THREE.BoxGeometry(p.w, 0.4, p.d))
      items.push(
        <lineSegments
          key={`plat_${i}`}
          geometry={track(new THREE.EdgesGeometry(geo))}
          material={matMain}
          position={[p.x, p.y + 0.2, p.z]}
        />,
      )
    })

    // Vertical pillars at scattered positions
    const pillars: Array<[number, number]> = [
      [-20, -15],
      [20, -15],
      [-20, 15],
      [20, 15],
      [-10, -25],
      [10, -25],
      [-10, 25],
      [10, 25],
    ]
    pillars.forEach(([x, z], i) => {
      const geo = track(new THREE.BoxGeometry(0.5, 8, 0.5))
      items.push(
        <lineSegments
          key={`pil_${i}`}
          geometry={track(new THREE.EdgesGeometry(geo))}
          material={matSub}
          position={[x, 4, z]}
        />,
      )
    })

    // Horizontal truss lines connecting some pillars
    const trussPairs: Array<[[number, number], [number, number]]> = [
      [
        [-20, -15],
        [20, -15],
      ],
      [
        [-20, 15],
        [20, 15],
      ],
      [
        [-10, -25],
        [10, -25],
      ],
    ]
    trussPairs.forEach((pair, i) => {
      const w = Math.abs(pair[0][0] - pair[1][0])
      const cx = (pair[0][0] + pair[1][0]) / 2
      const cz = (pair[0][1] + pair[1][1]) / 2
      const geo = track(new THREE.BoxGeometry(w, 0.3, 0.3))
      items.push(
        <lineSegments
          key={`truss_${i}`}
          geometry={track(new THREE.EdgesGeometry(geo))}
          material={matBold}
          position={[cx, 8, cz]}
        />,
      )
    })

    // Small circular table outlines scattered
    const tables: Array<[number, number]> = [
      [-8, -5],
      [8, -5],
      [-8, 5],
      [8, 5],
      [0, 20],
    ]
    tables.forEach(([x, z], i) => {
      const geo = track(new THREE.CylinderGeometry(1, 1, 0.3, 16))
      items.push(
        <lineSegments
          key={`tab_${i}`}
          geometry={track(new THREE.EdgesGeometry(geo))}
          material={matSub}
          position={[x, 0.15, z]}
        />,
      )
    })

    // Floating technical nodes (elevation lines from ground)
    for (let k = 0; k < 30; k++) {
      const px = (Math.random() - 0.5) * 80
      const pz = (Math.random() - 0.5) * 80
      const py = 2 + Math.random() * 8
      // Elevation line from ground to node
      const lineGeo = track(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(px, 0, pz),
          new THREE.Vector3(px, py, pz),
        ]),
      )
      items.push(<primitive key={`elev_${k}`} object={new THREE.Line(lineGeo, matSub)} />)
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

  return <group ref={groupRef}>{elements}</group>
}

// ============================================================
// LUT FURNITURE — real 3D meshes (top section overlay)
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
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.2, 0.15, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0, 1.1, -0.5]}>
        <boxGeometry args={[1.2, 1.2, 0.15]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
      </mesh>
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
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.1, 32]} />
        <meshStandardMaterial color={IVORY} roughness={0.1} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1, 16]} />
        <meshStandardMaterial color={WOOD} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
        <meshStandardMaterial color={WOOD} roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.06, 0]}>
        <cylinderGeometry args={[1.55, 1.55, 0.02, 32]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
    </group>
  )
}

function FurnitureSofa({ position, color }: { position: Vec3; color: string }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[3, 0.6, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {/* Back */}
      <mesh position={[0, 1, -0.5]}>
        <boxGeometry args={[3, 0.8, 0.2]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {/* Arms */}
      <mesh position={[-1.5, 0.6, 0]}>
        <boxGeometry args={[0.3, 0.8, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      <mesh position={[1.5, 0.6, 0]}>
        <boxGeometry args={[0.3, 0.8, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
    </group>
  )
}

function LutFurniture({ y, scale }: { y: number; scale: number }) {
  // The group scale handles both object size AND horizontal spread.
  // On mobile (tighter card spacing) we pass a smaller scale (0.6) so the
  // furniture does not bleed into adjacent sections (the middle La Lounge
  // card sits between the LUT and Birthday overlays). Tall objects (the
  // floor lamp at 2.3 units tall) were removed so vertical extent stays
  // within the section; horizontal X positions were also tightened.
  return (
    <group position={[0, y, 0]} scale={scale}>
      <FurnitureChair position={[-4, 0, 0]} color={BRAND_COLORS.LUT} />
      <FurnitureChair position={[-1.5, 0, 1]} color={IVORY} />
      <FurnitureChair position={[4, 0, -1]} color={BRAND_COLORS.LUT} />
      <FurnitureTable position={[-3, 0, 2]} color={BRAND_COLORS.LUT} />
      <FurnitureTable position={[3, 0, 1]} color={BRAND_COLORS.LUT} />
      <FurnitureSofa position={[0, 0, -3]} color={BRAND_COLORS.LUT} />
    </group>
  )
}

// ============================================================
// BIRTHDAY PARTY — 3D party objects (bottom section overlay)
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
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Knot */}
      <mesh position={[0, -0.7, 0]}>
        <coneGeometry args={[0.1, 0.2, 8]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      {/* String */}
      <mesh position={[0, -1.3, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 1, 4]} />
        <meshBasicMaterial color={IVORY} />
      </mesh>
    </group>
  )
}

function BirthdayCake({ position }: { position: Vec3 }) {
  return (
    <group position={position} scale={1.2}>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[1.4, 1.4, 0.6, 32]} />
        <meshStandardMaterial color={IVORY} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[1, 1, 0.5, 32]} />
        <meshStandardMaterial color={BRAND_COLORS.YOUR_BIRTHDAY} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.4, 32]} />
        <meshStandardMaterial color={IVORY} roughness={0.5} />
      </mesh>
      {/* Candles */}
      {[-0.3, 0, 0.3].map((x, i) => (
        <group key={i} position={[x, 1.5, 0]}>
          <mesh>
            <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
            <meshStandardMaterial color={i === 1 ? BRAND_COLORS.LUT : BRAND_COLORS.LA_LOUNGE} />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <coneGeometry args={[0.06, 0.15, 8]} />
            <meshStandardMaterial
              color={BRAND_COLORS.YOUR_BIRTHDAY}
              emissive={BRAND_COLORS.YOUR_BIRTHDAY}
              emissiveIntensity={1}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Confetti({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30
      pos[i * 3 + 1] = Math.random() * 5
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
      <PointMaterial
        color={BRAND_COLORS.YOUR_BIRTHDAY}
        size={0.4}
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
      />
    </points>
  )
}

function BirthdayParty({ y, scale }: { y: number; scale: number }) {
  // The group scale handles both object size AND horizontal spread.
  // On mobile (tighter card spacing) we pass a smaller scale (0.6) so the
  // party objects do not bleed into adjacent sections (the middle La Lounge
  // card sits between the LUT and Birthday overlays). Tall party light
  // beams (6 units tall at y=4) were removed so vertical extent stays
  // within the section; balloon X positions were tightened and balloon
  // base Y positions lowered so they don't float as high.
  return (
    <group position={[0, y, 0]} scale={scale}>
      <Balloon position={[-4, 0.5, 0]} color={BRAND_COLORS.YOUR_BIRTHDAY} />
      <Balloon position={[-2, 1, 1]} color={BRAND_COLORS.LA_LOUNGE} />
      <Balloon position={[2, 0.8, -1]} color="#A855F7" />
      <Balloon position={[4, 1, 0]} color={BRAND_COLORS.YOUR_BIRTHDAY_LIGHT} />
      <BirthdayCake position={[0, 0, 2]} />
      <Confetti count={40} />
    </group>
  )
}

// ============================================================
// CAMERA RIG
// ============================================================

function CameraRig({
  sectionYs,
}: {
  sectionYs: { lut: number; lalounge: number; birthday: number }
}) {
  useFrame((state) => {
    const t = state.clock.elapsedTime
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
  const [inView, setInView] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [sectionYs, setSectionYs] = useState({ lut: 12, lalounge: 0, birthday: -12 })

  useEffect(() => {
    setEnabled(shouldEnable3D())
  }, [])

  // Responsive detection — on mobile (<768px) the cards are stacked closer
  // together, so the 3D furniture (top) and party objects (bottom) need a
  // smaller scale to avoid bleeding into the middle (La Lounge) section.
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const measure = () => {
      const cards = document.querySelectorAll('[role=button]')
      const section = document.querySelector('section')
      if (!cards.length || !section) return
      const sectionRect = section.getBoundingClientRect()
      const sectionH = sectionRect.height
      if (sectionH === 0) return

      const cardCenters = Array.from(cards).map((c) => {
        const r = (c as HTMLElement).getBoundingClientRect()
        return (r.top + r.bottom) / 2 - sectionRect.top
      })

      const visibleY = Math.tan((50 * Math.PI) / 180 / 2) * 50
      const toY = (frac: number) => (0.5 - frac) * 2 * visibleY

      if (cardCenters.length >= 3) {
        setSectionYs({
          lut: toY(cardCenters[0] / sectionH),
          lalounge: toY(cardCenters[1] / sectionH),
          birthday: toY(cardCenters[2] / sectionH),
        })
      }
    }

    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('load', measure)
    const timeoutId = setTimeout(measure, 500)
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

        {/* MASTER BLUEPRINT — one continuous base (La Lounge style, modified) */}
        <MasterBlueprintGrid />
        <MasterArchitecture />

        {/* LUT furniture overlay (top) — smaller on mobile to prevent overlap */}
        <LutFurniture y={sectionYs.lut} scale={isMobile ? 0.6 : 0.9} />

        {/* Birthday party overlay (bottom) — smaller on mobile to prevent overlap */}
        <BirthdayParty y={sectionYs.birthday} scale={isMobile ? 0.6 : 0.9} />
      </Canvas>
    </div>
  )
}
