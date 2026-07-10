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
 *   - (v20 Phase A) Dimension annotations REMOVED — luxury = restraint (off-screen per T2).
 *   - (v20 Phase A) Warm fog #1a1410; slow camera drift (½ speed, ½ amplitude); mobile
 *     camera closer (z=38/fov=42); grid density reduced (80 div / 3 rings / 4 crosshairs);
 *     ~60% fewer architecture draw calls; mobile scroll-pause + 150ms debounce.
 *   - (v20 Phase C) Desktop-only 12° camera tilt (y=centerY+6, lookAt centerY-4) reveals
 *     grid as a receding plane (mobile keeps flat view per A.2); 120 warm dust motes
 *     drifting upward for atmosphere; glossy mylar balloons (metalness 0.2, roughness
 *     0.2); denser confetti (count 40→80, size 0.4→0.35); 4 pink triangular La Lounge
 *     zone markers at central-platform corners.
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
      {/* Fine grid (80 divisions — luxury = restraint, per A.3) */}
      <gridHelper args={[300, 80, GRID_MAIN, GRID_LIGHT]} position={[0, 0, 0]} />
      {/* Major grid (20 divisions — gold accent lines) */}
      <gridHelper args={[300, 20, GRID_ACCENT, GRID_LIGHT]} position={[0, -0.01, 0]} />

      {/* Radial rings — 3 key rings (radii 8, 20, 32) per A.3 */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh key={`radial_${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <ringGeometry args={[8 + i * 12, 8.06 + i * 12, 96]} />
          <meshBasicMaterial color={RING_COLOR} transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Radar sweep */}
      <mesh ref={radarRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[150, 64]} />
        <meshBasicMaterial color={RADAR_COLOR} transparent opacity={0.04} side={THREE.DoubleSide} />
      </mesh>

      {/* Crosshairs — 4 cardinal directions (0°, 90°, 180°, 270°) per A.3 */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={`cross_${i}`} rotation={[0, (i * Math.PI) / 2, 0]}>
          <boxGeometry args={[300, 0.005, 0.03]} />
          <meshBasicMaterial color={GRID_MAIN} transparent opacity={0.2} />
        </mesh>
      ))}

      {/* Dimension annotations removed (A.3 — luxury = restraint; were off-screen per T2) */}
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
    // A.4: reduced from 3 → 2 platforms (fewer draw calls, minimal visual change)
    const platforms = [
      { x: 0, z: -20, y: 0, w: 12, d: 6 },
      { x: -15, z: 10, y: 0, w: 8, d: 4 },
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
    // A.4: reduced from 8 → 4 corner pillars (mid-edge pillars removed)
    const pillars: Array<[number, number]> = [
      [-20, -15],
      [20, -15],
      [-20, 15],
      [20, 15],
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
    // A.4: reduced from 3 → 2 truss beams (kept the 2 full-width front/back edges)
    const trussPairs: Array<[[number, number], [number, number]]> = [
      [
        [-20, -15],
        [20, -15],
      ],
      [
        [-20, 15],
        [20, 15],
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
    // A.4: reduced from 5 → 3 tables (kept 2 front + 1 back-center for balance)
    const tables: Array<[number, number]> = [
      [-8, -5],
      [8, -5],
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
    // A.4: reduced from 30 → 10 elevation lines
    for (let k = 0; k < 10; k++) {
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

  return (
    <group ref={groupRef}>
      {elements}
      {/* C.3 — La Lounge zone markers: 4 small pink triangles at the corners
          of the central platform (x=±8, z=±4) marking the La Lounge zone.
          Laid flat via rotation [-π/2, 0, 0] so they read as floor decals. */}
      {(
        [
          [-8, -4],
          [8, -4],
          [-8, 4],
          [8, 4],
        ] as Array<[number, number]>
      ).map(([x, z], i) => (
        <mesh
          key={`ll_marker_${i}`}
          position={[x, 0.1, z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <coneGeometry args={[0.5, 0.1, 4]} />
          <meshBasicMaterial color={BRAND_COLORS.LA_LOUNGE} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  )
}

// ============================================================
// LUT FURNITURE — real 3D meshes (top section overlay)
// ============================================================

function FurnitureChair({
  position,
  color,
  rotation = [0, 0, 0] as Vec3,
}: {
  position: Vec3
  color: string
  rotation?: Vec3
}) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    // Float is relative to the outer (base-positioned, base-rotated) group
    // so the conversation-vignette arrangement is preserved.
    ref.current.position.y = Math.sin(t * 0.8 + position[0]) * 0.2
    ref.current.rotation.y = Math.sin(t * 0.3 + position[2]) * 0.15
  })
  return (
    <group position={position} rotation={rotation}>
      <group ref={ref}>
        {/* Seat — velvet upholstery (B.2): matte, no metallic sheen */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1.2, 0.15, 1.2]} />
          <meshStandardMaterial color={color} roughness={0.85} metalness={0.0} />
        </mesh>
        {/* Backrest — velvet */}
        <mesh position={[0, 1.1, -0.5]}>
          <boxGeometry args={[1.2, 1.2, 0.15]} />
          <meshStandardMaterial color={color} roughness={0.85} metalness={0.0} />
        </mesh>
        {/* Brass legs — polished gold (B.2) */}
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
            <meshStandardMaterial color={GOLD_TONE} metalness={0.95} roughness={0.15} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function FurnitureTable({ position, color }: { position: Vec3; color: string }) {
  return (
    <group position={position}>
      {/* Ivory top — lacquered feel (B.2): slight clearcoat via higher metalness */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.1, 32]} />
        <meshStandardMaterial color={IVORY} roughness={0.1} metalness={0.4} />
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
      {/* Base — velvet upholstery (B.2) */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[3, 0.6, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.85} metalness={0.0} />
      </mesh>
      {/* Back — velvet */}
      <mesh position={[0, 1, -0.5]}>
        <boxGeometry args={[3, 0.8, 0.2]} />
        <meshStandardMaterial color={color} roughness={0.85} metalness={0.0} />
      </mesh>
      {/* Arms — velvet */}
      <mesh position={[-1.5, 0.6, 0]}>
        <boxGeometry args={[0.3, 0.8, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.85} metalness={0.0} />
      </mesh>
      <mesh position={[1.5, 0.6, 0]}>
        <boxGeometry args={[0.3, 0.8, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.85} metalness={0.0} />
      </mesh>
    </group>
  )
}

function LutFurniture({ y, scale }: { y: number; scale: number }) {
  // B.5 — Conversation vignette: sofa center-back, 2 flanking chairs angled
  // ±25° toward center, 1 coffee table front-center, 2 front chairs rotated
  // 180° to face the sofa. Removed the 2 pedestal tables (replaced by the
  // single coffee table). Group scale handles object size + horizontal
  // spread; on mobile we pass a smaller scale (0.6) so the vignette does
  // not bleed into adjacent sections.
  const deg = Math.PI / 180
  return (
    <group position={[0, y, 0]} scale={scale}>
      {/* Sofa — center-back */}
      <FurnitureSofa position={[0, 0, -3]} color={BRAND_COLORS.LUT} />
      {/* Flanking chairs — angled ±25° toward center */}
      <FurnitureChair position={[-3, 0, -1]} color={BRAND_COLORS.LUT} rotation={[0, 25 * deg, 0]} />
      <FurnitureChair position={[3, 0, -1]} color={BRAND_COLORS.LUT} rotation={[0, -25 * deg, 0]} />
      {/* Coffee table — front-center (replaces the 2 pedestal tables) */}
      <FurnitureTable position={[0, 0, 1]} color={BRAND_COLORS.LUT} />
      {/* Front chairs — rotated 180° to face the sofa */}
      <FurnitureChair position={[-2.5, 0, 2]} color={BRAND_COLORS.LUT} rotation={[0, 180 * deg, 0]} />
      <FurnitureChair position={[2.5, 0, 2]} color={BRAND_COLORS.LUT} rotation={[0, 180 * deg, 0]} />
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
        {/* C.3 — Glossy mylar/foil: metalness 0.1→0.2, roughness 0.3→0.2 */}
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.2} />
      </mesh>
      {/* Knot */}
      <mesh position={[0, -0.7, 0]}>
        <coneGeometry args={[0.1, 0.2, 8]} />
        {/* Knot matches balloon gloss per C.3 */}
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.2} />
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
  // B.4 — Candle flames flicker via useFrame. We track all 3 flame meshes
  // in a ref array and oscillate their emissiveIntensity with two
  // superimposed sine waves (8 Hz + 13 Hz) for a naturalistic flicker.
  // Each flame gets a small phase offset so they don't pulse in unison.
  const flameRefs = useRef<THREE.Mesh[]>([])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    flameRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      const offset = i * 0.6
      const flicker = 0.6 + Math.sin(t * 8 + offset) * 0.2 + Math.sin(t * 13 + offset) * 0.15
      ;(mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = flicker
    })
  })

  return (
    <group position={position} scale={1.2}>
      {/* Bottom tier */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[1.4, 1.4, 0.6, 32]} />
        <meshStandardMaterial color={IVORY} roughness={0.5} />
      </mesh>
      {/* Middle tier */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[1, 1, 0.5, 32]} />
        <meshStandardMaterial color={BRAND_COLORS.YOUR_BIRTHDAY} roughness={0.4} />
      </mesh>
      {/* Top tier */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.4, 32]} />
        <meshStandardMaterial color={IVORY} roughness={0.5} />
      </mesh>

      {/* B.4 — Gold leaf rings between tiers (emissive gold) */}
      <mesh position={[0, 0.55, 0]}>
        <torusGeometry args={[1.2, 0.04, 8, 32]} />
        <meshStandardMaterial
          color={GOLD_TONE}
          metalness={1}
          roughness={0.15}
          emissive={BRAND_COLORS.YOUR_BIRTHDAY}
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        <torusGeometry args={[0.85, 0.03, 8, 32]} />
        <meshStandardMaterial
          color={GOLD_TONE}
          metalness={1}
          roughness={0.15}
          emissive={BRAND_COLORS.YOUR_BIRTHDAY}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Candles — flames tracked via flameRefs for flicker */}
      {[-0.3, 0, 0.3].map((x, i) => (
        <group key={i} position={[x, 1.5, 0]}>
          <mesh>
            <cylinderGeometry args={[0.05, 0.05, 0.3, 8]} />
            <meshStandardMaterial color={i === 1 ? BRAND_COLORS.LUT : BRAND_COLORS.LA_LOUNGE} />
          </mesh>
          <mesh
            ref={(m) => {
              if (m) flameRefs.current[i] = m
            }}
            position={[0, 0.25, 0]}
          >
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
      {/* C.3 — Denser, smaller confetti: count 40→80, size 0.4→0.35 */}
      <PointMaterial
        color={BRAND_COLORS.YOUR_BIRTHDAY}
        size={0.35}
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
      />
    </points>
  )
}

// ============================================================
// DUST MOTES — atmospheric warm particles drifting upward (C.2)
// 120 tiny warm points across the whole scene; placed inside SceneGroup
// so they rotate with the composition. Pairs with B.1 warm point lights.
// ============================================================

function DustMotes() {
  const ref = useRef<THREE.Points>(null)
  const count = 120
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30
    }
    return pos
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    const livePositions = ref.current.geometry.attributes.position.array as Float32Array
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      // Slow upward drift
      livePositions[i * 3 + 1] += 0.01
      // Reset to bottom when too high
      if (livePositions[i * 3 + 1] > 20) livePositions[i * 3 + 1] = -20
    }
    ref.current.geometry.attributes.position.needsUpdate = true
    ref.current.rotation.y = t * 0.01
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#D4A574"
        size={0.12}
        sizeAttenuation
        transparent
        opacity={0.30}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
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
      {/* B.4 — was #A855F7 (off-brand purple); now pink to keep the {red, pink, gold} triad */}
      <Balloon position={[2, 0.8, -1]} color={BRAND_COLORS.LA_LOUNGE_LIGHT} />
      <Balloon position={[4, 1, 0]} color={BRAND_COLORS.YOUR_BIRTHDAY_LIGHT} />
      <BirthdayCake position={[0, 0, 2]} />
      {/* C.3 — Denser confetti: count 40→80 */}
      <Confetti count={80} />
    </group>
  )
}

// ============================================================
// SCENE ROTATOR — unified slow parent rotation (B.6)
// Wraps the entire scene (grid + architecture + overlays + spine)
// so the whole composition drifts together as one piece.
// ============================================================

function SceneGroup({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!ref.current) return
    // Very slow drift (~0.17°/sec) — adds cinematic life without
    // competing with the inner rotations of MasterBlueprintGrid /
    // MasterArchitecture (which compound on top of this baseline).
    ref.current.rotation.y = state.clock.elapsedTime * 0.003
  })
  return <group ref={ref}>{children}</group>
}

// ============================================================
// CAMERA RIG
// ============================================================

function CameraRig({
  sectionYs,
  isMobile,
}: {
  sectionYs: { lut: number; lalounge: number; birthday: number }
  isMobile: boolean
}) {
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const centerY = (sectionYs.lut + sectionYs.birthday) / 2
    // F.2 / A.1: sync FOV each frame — R3F's `camera` prop is initial-only,
    // so the mobile 42° value never reaches the actual camera without this.
    // Guard avoids per-frame matrix updates once converged. The default R3F
    // camera is a PerspectiveCamera, but state.camera is typed as the union
    // Camera, so we narrow with isPerspectiveCamera before touching `fov`.
    const cam = state.camera
    if (cam instanceof THREE.PerspectiveCamera) {
      const targetFov = isMobile ? 42 : 50
      if (Math.abs(cam.fov - targetFov) > 0.1) {
        cam.fov = targetFov
        cam.updateProjectionMatrix()
      }
    }
    // A.2: half-speed drift (0.04→0.02) + half amplitude (3→1.5) for museum elegance.
    state.camera.position.x = Math.sin(t * 0.02) * 1.5
    // A.2: mobile camera closer (z=38 vs 50) so objects appear ~60% larger (T5).
    state.camera.position.z = isMobile ? 38 : 50
    if (isMobile) {
      // Mobile keeps the flat view (A.2) — closer camera already makes objects bigger.
      state.camera.position.y = centerY
      state.camera.lookAt(0, centerY, 0)
    } else {
      // C.1 — Desktop-only ~12° downward tilt: raise camera 6 above center and
      // look 4 below center. Reveals the grid as a receding plane (per T2),
      // creates natural leading lines converging on card centers. Mobile is
      // exempt per T5 (closer flat camera already makes silhouettes legible).
      state.camera.position.y = centerY + 6
      state.camera.lookAt(0, centerY - 4, 0)
    }
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

      // A.2: visibleY must match the actual camera — on mobile the camera is closer
      // (z=38, fov=42) so the visible Y range is smaller; otherwise overlays misalign.
      const camFov = isMobile ? 42 : 50
      const camZ = isMobile ? 38 : 50
      const visibleY = Math.tan((camFov * Math.PI) / 180 / 2) * camZ
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
  }, [isMobile])

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

  // A.5: Mobile scroll-pause — during active scroll, set inView=false to pause the
  // 3D render loop (rAF competes with the scroll compositor on mid-tier phones).
  // Resumes after 150ms of no scrolling. Desktop is unaffected (early return).
  useEffect(() => {
    if (!isMobile) return
    let scrollTimeout: number
    const onScroll = () => {
      setInView(false)
      clearTimeout(scrollTimeout)
      scrollTimeout = window.setTimeout(() => setInView(true), 150)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isMobile])

  if (!enabled) return null

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
    >
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        camera={{ position: [0, 0, isMobile ? 38 : 50], fov: isMobile ? 42 : 50 }}
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
        <fog attach="fog" args={['#1a1410', 35, 95]} />

        {/* B.1 — Midnight Luxury palette: 3-point cinematic lighting + warm focal accents.
            Lights stay in world space (outside SceneGroup) so the key/fill/rim setup
            is consistent as the scene drifts. */}
        <ambientLight intensity={0.3} />
        {/* Warm key light (Moleskin noon sun) */}
        <directionalLight position={[8, 15, 8]} intensity={0.9} color="#FFE4B5" />
        {/* Cool fill light (open shade) */}
        <directionalLight position={[-8, 5, -5]} intensity={0.3} color="#B0C4DE" />
        {/* Rim light (back separation) */}
        <directionalLight position={[0, -5, -10]} intensity={0.2} color="#FFD1E8" />
        {/* Warm focal accent — behind LUT sofa (F.5: 0.6→0.8 for unambiguous candlelit tone) */}
        <pointLight position={[0, 3, 5]} intensity={0.8} color="#D4A574" distance={15} />
        {/* Warm focal accent — on birthday cake (F.5: 0.4→0.6) */}
        <pointLight position={[0, 2, 2]} intensity={0.6} color="#F5B914" distance={8} />

        <CameraRig sectionYs={sectionYs} isMobile={isMobile} />

        {/* B.6 — Unified parent rotation wraps the whole scene so it drifts
            together as one composition (~0.17°/sec). Lights + camera stay
            outside so the cinematic framing is preserved. */}
        <SceneGroup>
          {/* MASTER BLUEPRINT — one continuous base (La Lounge style, modified) */}
          <MasterBlueprintGrid />
          <MasterArchitecture />

          {/* LUT furniture overlay (top) — smaller on mobile to prevent overlap */}
          <LutFurniture y={sectionYs.lut} scale={isMobile ? 0.6 : 0.9} />

          {/* Birthday party overlay (bottom) — smaller on mobile to prevent overlap */}
          <BirthdayParty y={sectionYs.birthday} scale={isMobile ? 0.6 : 0.9} />

          {/* B.5 — Gold spine: thin cylinder spanning all 3 sections for visual
              continuity. Lives in the main Canvas (inside SceneGroup, not inside
              any section group) so it spans the full composition.
              F.1/A.1: rotation prop REMOVED — a cylinderGeometry's default axis
              is +Y (vertical), which is what we want for a vertical connector.
              The prior rotation={[π/2, 0, 0]} was laying it along Z (depth),
              making it invisible as a vertical spine.
              F.3/A.2: opacity 0.28→0.6 and radius 0.04→0.07 to make the spine
              actually detectable against the dark warm background. */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 60, 8]} />
            <meshBasicMaterial color={GOLD_TONE} transparent opacity={0.6} />
          </mesh>

          {/* C.2 — Atmospheric dust motes: 120 warm points drifting slowly
              upward. Lives inside SceneGroup so it rotates with the scene. */}
          <DustMotes />
        </SceneGroup>
      </Canvas>
    </div>
  )
}
