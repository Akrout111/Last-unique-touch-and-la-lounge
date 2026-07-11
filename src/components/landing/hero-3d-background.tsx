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
 *   - (v22 Phase A) Top-down pitched camera (~60° from horizontal): camera elevated at
 *     y=camDist*sin(60°) (desktop 45 / mobile 28), depth=camDist*cos(60°) (desktop 26 /
 *     mobile 16), looking DOWN at centerZ on the floor (y=0). Sections migrated Y→Z
 *     (LUT=-Z top, Birthday=+Z bottom). Gold spine rotated [π/2,0,0] to lie flat along
 *     Z (was vertical — invisible from top-down). Lighting rewritten: overhead warm key
 *     + cool side fill + ambient base + 2 section-accent pointLights at sectionZs.
 *     Old rim light at [0,-5,-10] (below floor) REMOVED — invisible from top-down.
 *   - 3D content is overlaid ON TOP of the continuous blueprint at each card's Z position:
 *       • Top    (card 1 — LUT):       real 3D furniture meshes (chairs, tables, sofa)
 *       • Middle (card 2 — La Lounge): PURE blueprint (master architecture shows through —
 *                                      no separate La Lounge overlay; the master IS the base)
 *       • Bottom (card 3 — Birthday):  3D party objects (balloons, multi-tier cake, confetti)
 *   - Section Z positions are computed DYNAMICALLY from the actual card centers
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
      {/* Fine grid (v23-build-B3 — 60 divisions = cleaner 5-unit cells; was 200
          in v22 which was too dense/ugly. gridHelper is a single draw call
          regardless of division count.) */}
      <gridHelper args={[300, 60, GRID_MAIN, GRID_LIGHT]} position={[0, 0, 0]} />
      {/* Major grid (30 gold accent divisions — unchanged) */}
      <gridHelper args={[300, 30, GRID_ACCENT, GRID_LIGHT]} position={[0, -0.01, 0]} />

      {/* Radial rings (v23-build-B3 — 6 rings, fewer & more elegant; was 12) */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={`radial_${i}`} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[8 + i * 6, 8.06 + i * 6, 96]} />
          <meshBasicMaterial color={RING_COLOR} transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Radar sweep */}
      <mesh ref={radarRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[150, 64]} />
        <meshBasicMaterial color={RADAR_COLOR} transparent opacity={0.04} side={THREE.DoubleSide} />
      </mesh>

      {/* Crosshairs (v23-build-B3 — 8 lines, every 22.5°, cleaner; was 16 at
          11.25°. Opacity 0.15→0.12 so the fewer lines read visible yet calm.) */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`cross_${i}`} rotation={[0, (i * Math.PI) / 8, 0]}>
          <boxGeometry args={[300, 0.005, 0.03]} />
          <meshBasicMaterial color={GRID_MAIN} transparent opacity={0.12} />
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

function FloorLamp({ position }: { position: Vec3 }) {
  // v23-build-B3 — Re-added (was removed in v19-fix-H6). A simple brass
  // floor lamp: weighted base + thin stem + open ivory shade with a warm
  // emissive tint so it reads as a lit accent from the top-down camera.
  return (
    <group position={position}>
      {/* Base — weighted brass disc */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.2, 16]} />
        <meshStandardMaterial color={GOLD_TONE} metalness={0.95} roughness={0.15} />
      </mesh>
      {/* Stem — thin brass rod */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 2.8, 8]} />
        <meshStandardMaterial color={GOLD_TONE} metalness={0.95} roughness={0.15} />
      </mesh>
      {/* Shade — open ivory cone with warm emissive glow */}
      <mesh position={[0, 2.9, 0]}>
        <coneGeometry args={[0.4, 0.5, 16, 1, true]} />
        <meshStandardMaterial color={IVORY} roughness={0.8} emissive="#FFE4B5" emissiveIntensity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function LutFurniture({ z, scale }: { z: number; scale: number }) {
  // v23-build-B3 — Expanded conversation vignette (6→10 pieces) centered
  // at X=0 on Z=sectionZs.lut so the group sits directly behind card 1.
  // Pieces: 1 rug + 1 sofa + 6 chairs + 2 tables + 1 floor lamp = 11 meshes
  // (rug counted separately as a floor decal). Group scale handles object
  // size + horizontal spread; on mobile we pass a smaller scale so the
  // vignette does not bleed into adjacent sections.
  // v22 Phase A — Y=0.5 lift: chair-leg bottoms sit at local Y=-0.5; lifting the
  // outer group to world Y=0.5 puts the leg bottoms at world Y=0 so they rest
  // ON the blueprint floor (no longer buried beneath).
  const deg = Math.PI / 180
  return (
    <group position={[0, 0.5, z]} scale={scale}>
      {/* Rug under the furniture (flat on floor) */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 8]} />
        <meshStandardMaterial color="#3D1F1F" roughness={0.9} />
      </mesh>
      {/* Sofa — center-back */}
      <FurnitureSofa position={[0, 0, -3]} color={BRAND_COLORS.LUT} />
      {/* Flanking chairs */}
      <FurnitureChair position={[-3, 0, -1]} color={BRAND_COLORS.LUT} rotation={[0, 25 * deg, 0]} />
      <FurnitureChair position={[3, 0, -1]} color={BRAND_COLORS.LUT} rotation={[0, -25 * deg, 0]} />
      {/* Coffee table — center */}
      <FurnitureTable position={[0, 0, 0]} color={BRAND_COLORS.LUT} />
      {/* Front chairs facing sofa */}
      <FurnitureChair position={[-2.5, 0, 2]} color={BRAND_COLORS.LUT} rotation={[0, 180 * deg, 0]} />
      <FurnitureChair position={[2.5, 0, 2]} color={BRAND_COLORS.LUT} rotation={[0, 180 * deg, 0]} />
      {/* NEW: 2 more chairs on the sides */}
      <FurnitureChair position={[-4, 0, 1]} color={IVORY} rotation={[0, 90 * deg, 0]} />
      <FurnitureChair position={[4, 0, 1]} color={IVORY} rotation={[0, -90 * deg, 0]} />
      {/* NEW: Side table */}
      <FurnitureTable position={[-4.5, 0, -2]} color={BRAND_COLORS.LUT} />
      {/* NEW: Floor lamp */}
      <FloorLamp position={[4.5, 0, -2]} />
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
      // B9 — Z-bounds tightened ±10 → ±4 so confetti does not bleed into the
      // La Lounge card's Z band on mobile (section spacing only ~5.4 units).
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8
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

function GiftBox({ position, color }: { position: Vec3; color: string }) {
  // v23-build-B3 — Wrapped present: colored box + ivory lid + gold ribbon
  // (vertical + horizontal bands) + a small gold torus bow on top.
  return (
    <group position={position}>
      {/* Box */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1, 0.8, 1]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
      </mesh>
      {/* Lid */}
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[1.1, 0.15, 1.1]} />
        <meshStandardMaterial color={IVORY} roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Ribbon vertical */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.15, 0.8, 1.01]} />
        <meshStandardMaterial color={GOLD_TONE} metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Ribbon horizontal */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.01, 0.8, 0.15]} />
        <meshStandardMaterial color={GOLD_TONE} metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Bow */}
      <mesh position={[0, 1, 0]}>
        <torusGeometry args={[0.2, 0.06, 8, 16]} />
        <meshStandardMaterial color={GOLD_TONE} metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  )
}

function Banner() {
  // v23-build-B3 — A curved garland arching over the party scene: a thin
  // tube following a sin-arched Catmull-Rom spline from x=-6 to x=+6 at
  // y=3..4.5, z=-1 (behind the cake). Slight emissive tint so it reads as
  // a lit bunting from the top-down camera.
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= 20; i++) {
      const t = i / 20
      const x = -6 + t * 12
      const y = 3 + Math.sin(t * Math.PI) * 1.5
      pts.push(new THREE.Vector3(x, y, -1))
    }
    return pts
  }, [])
  return (
    <mesh>
      <tubeGeometry args={[new THREE.CatmullRomCurve3(points), 50, 0.05, 8, false]} />
      <meshStandardMaterial color={BRAND_COLORS.YOUR_BIRTHDAY} emissive={BRAND_COLORS.YOUR_BIRTHDAY} emissiveIntensity={0.2} roughness={0.4} />
    </mesh>
  )
}

function BirthdayParty({ z, scale }: { z: number; scale: number }) {
  // v23-build-B3 — Expanded party scene (5→10 objects) centered at X=0 on
  // Z=sectionZs.birthday so the group sits directly behind card 3.
  // Pieces: 6 balloons + 1 cake + 2 gift boxes + 1 banner + confetti.
  // The group scale handles both object size AND horizontal spread.
  // On mobile (tighter card spacing) we pass a smaller scale so the party
  // objects do not bleed into adjacent sections (the middle La Lounge card
  // sits between the LUT and Birthday overlays).
  // v22 Phase A — no Y lift: cake base already at local Y=0.3, so the group
  // sits directly on the floor at world Y=0.
  return (
    <group position={[0, 0, z]} scale={scale}>
      {/* Balloons (6 — was 4) */}
      <Balloon position={[-5, 0.5, 0]} color={BRAND_COLORS.YOUR_BIRTHDAY} />
      <Balloon position={[-3, 1, 1]} color={BRAND_COLORS.LA_LOUNGE} />
      <Balloon position={[-1, 0.8, -1]} color={BRAND_COLORS.LA_LOUNGE_LIGHT} />
      <Balloon position={[1, 1.2, 0]} color={BRAND_COLORS.YOUR_BIRTHDAY_LIGHT} />
      <Balloon position={[3, 0.6, 1]} color={BRAND_COLORS.YOUR_BIRTHDAY} />
      <Balloon position={[5, 1, -1]} color={BRAND_COLORS.LA_LOUNGE} />
      {/* Cake — center */}
      <BirthdayCake position={[0, 0, 2]} />
      {/* NEW: Gift boxes (2) */}
      <GiftBox position={[-4, 0, 2]} color={BRAND_COLORS.LUT} />
      <GiftBox position={[4, 0, 2]} color={BRAND_COLORS.LA_LOUNGE} />
      {/* NEW: Banner/garland arch */}
      <Banner />
      {/* Confetti (count 80) */}
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
  sectionZs,
  isMobile,
}: {
  sectionZs: { lut: number; lalounge: number; birthday: number }
  isMobile: boolean
}) {
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const centerZ = (sectionZs.lut + sectionZs.birthday) / 2

    // v22 Phase A — Pitched top-down camera (~60° from horizontal).
    // Desktop: camDist=52 → height=45 (sin60°*52), depth=26 (cos60°*52).
    // Mobile:  camDist=32 → height=28, depth=16.
    // Reads as a flat blueprint floor (per user's core goal) while preserving
    // furniture front-face legibility (a pure 90° top-down would force a full
    // furniture redesign per M2/T4). sin(2*60°)=0.866 → 87% Z-to-screen
    // sensitivity (good — sin peaks at 45°, drops to 0 at 0°/90°).
    const camDist = isMobile ? 32 : 52
    const pitch = Math.PI / 3 // 60°
    const height = camDist * Math.sin(pitch)
    const depth = camDist * Math.cos(pitch)

    // Subtle horizontal drift (museum turntable feel). Same 0.02 freq as v20;
    // mobile amplitude 1.5→1.0 to stay inside the narrower 42° FOV.
    const driftX = Math.sin(t * 0.02) * (isMobile ? 1 : 1.5)

    state.camera.position.x = driftX
    state.camera.position.y = height
    state.camera.position.z = centerZ + depth

    // Look at the center of the 3 sections (on the floor, Y=0).
    state.camera.lookAt(0, 0, centerZ)

    // FOV sync — R3F's `camera` prop is initial-only, so the mobile 42°
    // value never reaches the actual camera without this per-frame guard.
    // Avoids per-frame matrix updates once converged.
    const cam = state.camera
    if (cam instanceof THREE.PerspectiveCamera) {
      const targetFov = isMobile ? 42 : 50
      if (Math.abs(cam.fov - targetFov) > 0.1) {
        cam.fov = targetFov
        cam.updateProjectionMatrix()
      }
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
  // Mirrors the IntersectionObserver's latest isIntersecting value so the
  // mobile scroll-pause can avoid resuming the render loop after the user
  // has scrolled past the hero (IO won't re-fire false on every scroll tick).
  const inViewRef = useRef(true)
  const [sectionZs, setSectionZs] = useState({ lut: -10, lalounge: 0, birthday: 10 })

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

      // v22 Phase A → v23-fix-F3 — Z mapping (SIGN-FLIPPED vs old toY so LUT
      // sits at -Z).
      // Card 1 (top, frac~0.36) → negative Z (far, appears at top via perspective).
      // Card 3 (bottom, frac~0.74) → positive Z (near, appears at bottom).
      // visibleZ depends on camera pitch — at 60° pitch, ground-projected
      // visible Z ≈ camDist / sin(pitch) * tan(fov/2).
      //
      // v23-fix-F3: Bumped scale factor 0.4 → 0.7. With 0.4 the LUT/Birthday
      // objects only spanned ±~4.3 units of Z while the camera sees ~28 units,
      // so they bunched together near screen center instead of spreading to
      // sit behind their cards. Card fracs span 0.36→0.74 (range 0.38); 0.7
      // widens the Z range so each object lands visually behind its card on
      // both desktop and mobile, while still avoiding the extreme near/far
      // edges of the FOV cone (which would distort the furniture/party props).
      const camDist = isMobile ? 32 : 52
      const pitch = Math.PI / 3
      const visibleZ =
        (camDist / Math.sin(pitch)) *
        Math.tan(((isMobile ? 42 : 50) * Math.PI) / 180 / 2)
      const toZ = (frac: number) => (frac - 0.5) * 2 * visibleZ * 0.7 // 0.7 = widened for card alignment

      if (cardCenters.length >= 3) {
        setSectionZs({
          lut: toZ(cardCenters[0] / sectionH),
          lalounge: toZ(cardCenters[1] / sectionH),
          birthday: toZ(cardCenters[2] / sectionH),
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
          inViewRef.current = entry.isIntersecting
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
      scrollTimeout = window.setTimeout(() => {
        // Only resume if the hero is actually in view — otherwise the IO
        // may not re-fire false (no threshold crossing) and we'd wake the
        // render loop while the hero is off-screen.
        if (inViewRef.current) setInView(true)
      }, 150)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(scrollTimeout)
    }
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
        camera={{ position: [0, isMobile ? 28 : 45, isMobile ? 16 : 26], fov: isMobile ? 42 : 50 }}
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
        {/* B6 — Fog pushed outward (35,95 → 60,180) so the elevated camera
            (B1 Phase A: y≈45 desktop / 28 mobile) does not fog the foreground
            sections. Keeps all 3 sections crisp; fades only the distant grid. */}
        <fog attach="fog" args={['#1a1410', 60, 180]} />

        {/* v22 Phase A — Top-down-friendly lighting: overhead warm key + cool fill +
            ambient base + 2 section-accent pointLights. Old rim light at [0,-5,-10]
            (below floor) REMOVED — invisible from top-down. Old accent pointLights
            at fixed Z=+5/+2 are repositioned to follow sectionZs.lut / .birthday.
            Lights stay in world space (outside SceneGroup) for consistent framing
            as the scene drifts. */}
        {/* Overhead key light (sun from above) */}
        <directionalLight position={[0, 30, 5]} intensity={1.2} color="#FFE4B5" />
        {/* Cool fill from the side */}
        <directionalLight position={[-15, 20, 10]} intensity={0.4} color="#B0C4DE" />
        {/* Ambient base */}
        <ambientLight intensity={0.3} />
        {/* Warm focal accent over LUT section */}
        <pointLight position={[0, 5, sectionZs.lut]} intensity={0.8} color="#D4A574" distance={20} />
        {/* Warm focal accent over Birthday section */}
        <pointLight position={[0, 5, sectionZs.birthday]} intensity={0.6} color={BRAND_COLORS.YOUR_BIRTHDAY} distance={15} />

        <CameraRig sectionZs={sectionZs} isMobile={isMobile} />

        {/* B.6 — Unified parent rotation wraps the whole scene so it drifts
            together as one composition (~0.17°/sec). Lights + camera stay
            outside so the cinematic framing is preserved. */}
        <SceneGroup>
          {/* MASTER BLUEPRINT — one continuous base (La Lounge style, modified) */}
          <MasterBlueprintGrid />
          <MasterArchitecture />

          {/* LUT furniture overlay (top, -Z) — smaller on mobile to prevent overlap */}
          <LutFurniture z={sectionZs.lut} scale={isMobile ? 0.5 : 0.9} />

          {/* Birthday party overlay (bottom, +Z) — smaller on mobile to prevent overlap */}
          <BirthdayParty z={sectionZs.birthday} scale={isMobile ? 0.5 : 0.9} />

          {/* v22 Phase A — Gold spine rotated to lie flat along Z. rotation=[π/2,0,0]
              reorients the cylinder's default +Y axis to world Z, so it reads as a
              horizontal "gold road" connecting the 3 sections (was a vertical
              cylinder — invisible as a dot under the top-down camera). Y=0.02
              prevents z-fighting with the grid at Y=0. Span 60 covers the desktop
              ±11 Z-spread + margin; mobile ±6 spread + margin. Opacity 0.6 keeps
              it detectable against the dark warm background. */}
          <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
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
