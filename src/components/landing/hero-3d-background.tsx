'use client'

/**
 * Hero3DBackground — tri-section 3D background for the landing hero.
 *
 * One <Canvas> with three <group> children stacked vertically:
 *   - Section 1 (Y=+19): LUT        — real 3D furniture meshes (solid materials)
 *   - Section 2 (Y=  0): La Lounge  — blueprint wireframe (pink)
 *   - Section 3 (Y=-26): Birthday   — faded blueprint + party objects (gold)
 *
 * Section Y values are calibrated against the actual card centers on the
 * page (card 1 at NDC_Y=+0.457, card 2 at -0.086, card 3 at -0.628) using
 * the camera projection (z=90, fov=50 → visible Y = ±41.97). The camera
 * looks at the origin (La Lounge section); LUT and Birthday are offset
 * above/below to align with their cards. Only horizontal drift is applied —
 * vertical is pinned at y=0 for stable alignment.
 *
 * Performance:
 *   - shouldEnable3D() gating (returns null when WebGL / motion-reduce / low-end)
 *   - IntersectionObserver + frameloop toggle (no unmount → no WebGL context churn)
 *   - dpr clamped to [1, 1.5]
 *   - total object count kept well under 500
 */

import { useRef, useState, useEffect, useMemo, type ReactElement } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { shouldEnable3D } from '@/lib/device-capabilities'
import { BRAND_COLORS } from '@/lib/brand-colors'

// === Tint constants (derived from brand colors for blueprint aesthetics) ===
// Light pink tints for the La Lounge blueprint grid — closest Tailwind-equivalent
// shades needed for the subtle blueprint-grid aesthetic (can't be expressed with
// the bare brand hex alone without blowing out the grid lines).
const PINK_LIGHT = '#FFD1E8' // ≈ pink-200 — base grid cross-lines
const PINK_LIGHTER = '#FFEFF6' // ≈ pink-50  — base grid lines (lightest)
const PINK_SOFT = '#FFE0EF' // ≈ pink-100 — secondary grid lines
const PINK_MID = '#FFB3D9' // ≈ pink-300 — radial grid rings

// Faded gold/cream tints for the Birthday section's lighter blueprint grid.
const GOLD_FADED = '#F5E5B5'
const CREAM_LIGHT = '#FFF8E1'

// Furniture material tones (LUT section).
const WOOD = '#8B6F47'
const GOLD_TONE = '#D4A574'
const IVORY = '#F5F1E8'

type Vec3 = [number, number, number]

// ============================================================
// SECTION 1: LUT — Real 3D Furniture (solid meshes, top section)
// ============================================================

function FurnitureChair({ position, color }: { position: Vec3; color: string }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.position.y = position[1] + Math.sin(t * 0.8 + position[0]) * 0.3
    ref.current.rotation.y = Math.sin(t * 0.3 + position[2]) * 0.2
  })
  return (
    <group ref={ref} position={position}>
      {/* Seat */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 0.15, 1]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.6, -0.45]}>
        <boxGeometry args={[1, 1.1, 0.15]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Legs (gold) */}
      {[-0.4, 0.4].map((x) =>
        [-0.4, 0.4].map((z) => (
          <mesh key={`leg-${x}-${z}`} position={[x, -0.5, z]}>
            <cylinderGeometry args={[0.04, 0.04, 1, 8]} />
            <meshStandardMaterial color={GOLD_TONE} metalness={1} roughness={0.2} />
          </mesh>
        )),
      )}
    </group>
  )
}

function FurnitureTable({ position, color }: { position: Vec3; color: string }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.position.y = position[1] + Math.sin(t * 0.5 + position[0]) * 0.2
  })
  return (
    <group ref={ref} position={position}>
      {/* Top (ivory) */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.1, 32]} />
        <meshStandardMaterial color={IVORY} roughness={0.1} metalness={0.3} />
      </mesh>
      {/* Pole (gold) */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.8, 16]} />
        <meshStandardMaterial color={GOLD_TONE} metalness={1} roughness={0.2} />
      </mesh>
      {/* Base (gold) */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.1, 32]} />
        <meshStandardMaterial color={GOLD_TONE} metalness={1} roughness={0.2} />
      </mesh>
      {/* Tablecloth accent (brand red) */}
      <mesh position={[0, 0.86, 0]}>
        <cylinderGeometry args={[1.25, 1.25, 0.02, 32]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0} />
      </mesh>
    </group>
  )
}

function FurnitureLamp({ position }: { position: Vec3 }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.3
  })
  return (
    <group ref={ref} position={position}>
      {/* Base (gold) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.05, 16]} />
        <meshStandardMaterial color={GOLD_TONE} metalness={1} roughness={0.2} />
      </mesh>
      {/* Pole (gold) */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 2.4, 8]} />
        <meshStandardMaterial color={GOLD_TONE} metalness={1} roughness={0.2} />
      </mesh>
      {/* Shade (brand red) */}
      <mesh position={[0, 2.2, 0]}>
        <coneGeometry args={[0.4, 0.6, 24, 1, true]} />
        <meshStandardMaterial
          color={BRAND_COLORS.LUT}
          roughness={0.4}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Bulb (glow) */}
      <mesh position={[0, 2.1, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#FFE9A8" />
      </mesh>
      <pointLight
        position={[0, 2.1, 0]}
        intensity={0.5}
        color={BRAND_COLORS.LUT_LIGHT}
        distance={6}
      />
    </group>
  )
}

function FurnitureSofa({ position, color }: { position: Vec3; color: string }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.position.y = position[1] + Math.sin(t * 0.4 + position[0] * 0.5) * 0.15
  })
  return (
    <group ref={ref} position={position}>
      {/* Seat */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.8, 0.4, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.6, -0.45]}>
        <boxGeometry args={[2.8, 0.8, 0.3]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
      </mesh>
      {/* Arms (wood) */}
      <mesh position={[-1.25, 0.4, 0.1]}>
        <boxGeometry args={[0.3, 0.6, 1.0]} />
        <meshStandardMaterial color={WOOD} roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh position={[1.25, 0.4, 0.1]}>
        <boxGeometry args={[0.3, 0.6, 1.0]} />
        <meshStandardMaterial color={WOOD} roughness={0.5} metalness={0.1} />
      </mesh>
      {/* Legs (gold) */}
      {[-1.2, 1.2].map((x) =>
        [-0.4, 0.4].map((z) => (
          <mesh key={`sofa-leg-${x}-${z}`} position={[x, -0.3, z]}>
            <cylinderGeometry args={[0.06, 0.04, 0.2, 8]} />
            <meshStandardMaterial color={GOLD_TONE} metalness={1} roughness={0.2} />
          </mesh>
        )),
      )}
    </group>
  )
}

function LutFurnitureSection() {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })
  return (
    <group ref={groupRef}>
      <FurnitureChair position={[-7, 0, -2]} color={BRAND_COLORS.LUT} />
      <FurnitureChair position={[-4, 1, 0]} color={IVORY} />
      <FurnitureChair position={[6, -1, -1]} color={BRAND_COLORS.LUT} />
      <FurnitureTable position={[-5.5, 0, 2]} color={BRAND_COLORS.LUT} />
      <FurnitureTable position={[4, 0.5, 1]} color={BRAND_COLORS.LUT} />
      <FurnitureLamp position={[8, -1, 0]} />
      <FurnitureSofa position={[0, 0, -3]} color={BRAND_COLORS.LUT} />
    </group>
  )
}

// ============================================================
// SECTION 2: La Lounge — Blueprint Wireframe (middle section)
// ============================================================

function LaLoungeBlueprintSection() {
  const gridGroup = useRef<THREE.Group>(null)
  const radarRef = useRef<THREE.Mesh>(null)
  const centerRingsRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (gridGroup.current) {
      gridGroup.current.rotation.y = state.clock.elapsedTime * 0.01
    }
    if (radarRef.current) {
      radarRef.current.rotation.z = -state.clock.elapsedTime * 0.4
    }
    if (centerRingsRef.current) {
      centerRingsRef.current.children.forEach((ring, idx) => {
        ring.rotation.z = state.clock.elapsedTime * 0.2 * (idx % 2 === 0 ? 1 : -1)
      })
    }
  })

  // NOTE: geometries + materials are returned from useMemo (stable references
  // with [] deps) so the cleanup effect can dispose them on unmount without
  // needing to mutate a ref during render (which would trip react-hooks/refs).
  const { elements, materials, geometries } = useMemo(() => {
    const items: ReactElement[] = []
    const geometries: THREE.BufferGeometry[] = []

    // Track a geometry so it can be disposed on unmount (R3F does not
    // auto-dispose geometries passed via the `geometry={...}` prop).
    const track = <T extends THREE.BufferGeometry>(geo: T): T => {
      geometries.push(geo)
      return geo
    }

    // Blueprint-ink materials (varying opacity for depth).
    const matBold = new THREE.LineBasicMaterial({
      color: BRAND_COLORS.LA_LOUNGE,
      transparent: true,
      opacity: 0.95,
    })
    const matMain = new THREE.LineBasicMaterial({
      color: BRAND_COLORS.LA_LOUNGE,
      transparent: true,
      opacity: 0.8,
    })
    const matSub = new THREE.LineBasicMaterial({
      color: BRAND_COLORS.LA_LOUNGE,
      transparent: true,
      opacity: 0.5,
    })
    const matAccent = new THREE.LineBasicMaterial({
      color: BRAND_COLORS.LA_LOUNGE_LIGHT,
      transparent: true,
      opacity: 0.9,
    })

    const addBox = (
      w: number,
      h: number,
      d: number,
      x: number,
      y: number,
      z: number,
      mat: THREE.LineBasicMaterial,
      key: string,
    ) => {
      const geo = track(new THREE.BoxGeometry(w, h, d))
      items.push(
        <lineSegments
          key={key}
          geometry={track(new THREE.EdgesGeometry(geo))}
          material={mat}
          position={[x, y, z]}
        />,
      )
    }

    // --- Stage outline (back of scene) ---
    addBox(20, 1.5, 12, 0, 0.75, -10, matBold, 'stage')
    addBox(18, 8, 0.5, 0, 5, -16, matBold, 'screen')

    // --- Truss pillars (4 corners) + horizontal trusses ---
    const pillarPositions: Array<[number, number]> = [
      [-12, -8],
      [12, -8],
      [-12, 8],
      [12, 8],
    ]
    pillarPositions.forEach(([x, z], i) => {
      addBox(0.6, 12, 0.6, x, 6, z, matBold, `pil_${i}`)
      for (let y = 2; y < 12; y += 3) {
        addBox(0.1, 0.1, 0.1, x, y, z, matSub, `brace_${i}_${y}`)
      }
    })
    addBox(26, 0.6, 0.6, 0, 12, -8, matBold, 'htruss1')
    addBox(26, 0.6, 0.6, 0, 12, 8, matBold, 'htruss2')

    // --- Seating booths (2) ---
    for (const side of [-1, 1]) {
      const boothGeo = track(new THREE.TorusGeometry(2.5, 0.8, 8, 16, Math.PI))
      items.push(
        <lineSegments
          key={`booth_${side}`}
          geometry={track(new THREE.EdgesGeometry(boothGeo))}
          material={matMain}
          position={[side * 8, 0.5, 5]}
          rotation={[Math.PI / 2, 0, side === 1 ? Math.PI / 2 : -Math.PI / 2]}
        />,
      )
      const tableGeo = track(new THREE.CylinderGeometry(1, 1, 0.5, 16))
      items.push(
        <lineSegments
          key={`tab_${side}`}
          geometry={track(new THREE.EdgesGeometry(tableGeo))}
          material={matAccent}
          position={[side * 8 + side, 0.25, 5]}
        />,
      )
    }

    // --- Bar (front) + stools ---
    addBox(14, 0.6, 1.5, 0, 0.5, 12, matBold, 'bar')
    for (let sx = -6; sx <= 6; sx += 2) {
      const stoolGeo = track(new THREE.CylinderGeometry(0.3, 0.3, 0.6, 8))
      items.push(
        <lineSegments
          key={`stool_${sx}`}
          geometry={track(new THREE.EdgesGeometry(stoolGeo))}
          material={matAccent}
          position={[sx, 0.3, 10.5]}
        />,
      )
    }

    return {
      elements: items,
      materials: { matBold, matMain, matSub, matAccent },
      geometries,
    }
  }, [])

  useEffect(() => {
    return () => {
      materials.matBold.dispose()
      materials.matMain.dispose()
      materials.matSub.dispose()
      materials.matAccent.dispose()
      geometries.forEach((g) => g.dispose())
    }
  }, [materials, geometries])

  return (
    <group ref={gridGroup}>
      {/* Floor grids (two layers for blueprint density) */}
      <gridHelper args={[120, 120, PINK_LIGHT, PINK_LIGHTER]} position={[0, 0, 0]} />
      <gridHelper
        args={[120, 12, BRAND_COLORS.LA_LOUNGE_LIGHT, PINK_SOFT]}
        position={[0, -0.01, 0]}
      />

      {/* Radial rings (architectural focus) */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`radial_${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <ringGeometry args={[4 + i * 4, 4.05 + i * 4, 64]} />
          <meshBasicMaterial
            color={PINK_MID}
            transparent
            opacity={0.25}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Radar sweep */}
      <mesh ref={radarRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[60, 64]} />
        <meshBasicMaterial
          color={BRAND_COLORS.LA_LOUNGE_LIGHT}
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Event architecture (stage, trusses, booths, bar) */}
      {elements}

      {/* Animated center rings (dance floor focal point) */}
      <group position={[0, 0.1, 0]} ref={centerRingsRef}>
        {[6, 9, 12].map((r, i) => (
          <mesh key={`cring_${i}`} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[r, r + 0.15, 64]} />
            <meshBasicMaterial
              color={BRAND_COLORS.LA_LOUNGE}
              transparent
              opacity={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}

// ============================================================
// SECTION 3: Birthday — Faded Blueprint + Party Objects (bottom)
// ============================================================

function BirthdayBalloon({ position, color }: { position: Vec3; color: string }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.position.y = position[1] + Math.sin(t * 0.6 + position[0]) * 0.5
    ref.current.position.x = position[0] + Math.cos(t * 0.4 + position[2]) * 0.2
  })
  return (
    <group ref={ref} position={position}>
      {/* Balloon body */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.6, 24, 24]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.3} />
      </mesh>
      {/* Knot */}
      <mesh position={[0, -0.6, 0]}>
        <coneGeometry args={[0.08, 0.15, 8]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      {/* String */}
      <mesh position={[0, -1.4, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 1.5, 4]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.4} />
      </mesh>
    </group>
  )
}

function BirthdayCake({ position }: { position: Vec3 }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })
  return (
    <group ref={ref} position={position}>
      {/* Bottom tier (ivory) */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.6, 32]} />
        <meshStandardMaterial color={IVORY} roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Middle tier (gold) */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[1.1, 1.1, 0.5, 32]} />
        <meshStandardMaterial color={BRAND_COLORS.YOUR_BIRTHDAY} roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Top tier (ivory) */}
      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.4, 32]} />
        <meshStandardMaterial color={IVORY} roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Decorative gold band */}
      <mesh position={[0, 0.6, 0]}>
        <torusGeometry args={[1.5, 0.05, 8, 32]} />
        <meshStandardMaterial color={BRAND_COLORS.YOUR_BIRTHDAY} metalness={1} roughness={0.2} />
      </mesh>
      {/* Candle (pink) */}
      <mesh position={[0, 1.7, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color={BRAND_COLORS.LA_LOUNGE} roughness={0.5} />
      </mesh>
      {/* Flame */}
      <mesh position={[0, 1.95, 0]}>
        <coneGeometry args={[0.08, 0.2, 8]} />
        <meshBasicMaterial color={BRAND_COLORS.YOUR_BIRTHDAY_LIGHT} />
      </mesh>
      <pointLight
        position={[0, 1.95, 0]}
        intensity={0.8}
        color={BRAND_COLORS.YOUR_BIRTHDAY_LIGHT}
        distance={5}
      />
    </group>
  )
}

function PartyLight({
  position,
  rotation,
  color,
}: {
  position: Vec3
  rotation: Vec3
  color: string
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <coneGeometry args={[3, 8, 16, 1, true]} />
      <meshBasicMaterial color={color} transparent opacity={0.15} side={THREE.DoubleSide} />
    </mesh>
  )
}

interface ConfettiPiece {
  pos: Vec3
  color: string
  rotSpeed: Vec3
  scale: number
}

function Confetti({ count }: { count: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const pieces = useMemo<ConfettiPiece[]>(() => {
    const colors = [
      BRAND_COLORS.YOUR_BIRTHDAY,
      BRAND_COLORS.LA_LOUNGE,
      '#A855F7',
      IVORY,
      BRAND_COLORS.YOUR_BIRTHDAY_LIGHT,
    ]
    return Array.from({ length: count }).map(() => ({
      pos: [
        (Math.random() - 0.5) * 20,
        Math.random() * 8 - 2,
        (Math.random() - 0.5) * 12,
      ] as Vec3,
      color: colors[Math.floor(Math.random() * colors.length)] as string,
      rotSpeed: [
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
      ] as Vec3,
      scale: 0.1 + Math.random() * 0.15,
    }))
  }, [count])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.children.forEach((child, i) => {
      const piece = pieces[i]
      if (!piece) return
      child.rotation.x += piece.rotSpeed[0] * delta
      child.rotation.y += piece.rotSpeed[1] * delta
      child.rotation.z += piece.rotSpeed[2] * delta
      // Gentle drift downward, wrap around when it falls below the section.
      child.position.y -= delta * 0.3
      if (child.position.y < -5) child.position.y = 5
    })
  })

  return (
    <group ref={groupRef}>
      {pieces.map((p, i) => (
        <mesh key={i} position={p.pos} scale={p.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={p.color} metalness={0.4} roughness={0.3} />
        </mesh>
      ))}
    </group>
  )
}

function BirthdayPartySection() {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.015
    }
  })

  const balloonColors = [
    BRAND_COLORS.YOUR_BIRTHDAY,
    BRAND_COLORS.LA_LOUNGE,
    '#A855F7',
    IVORY,
    BRAND_COLORS.YOUR_BIRTHDAY_LIGHT,
  ]

  return (
    <group ref={groupRef}>
      {/* Faded grid (lighter than La Lounge — gold/cream tints) */}
      <gridHelper args={[100, 50, GOLD_FADED, CREAM_LIGHT]} position={[0, 0, 0]} />

      {/* Balloons (6) */}
      <BirthdayBalloon position={[-6, 1, -2]} color={balloonColors[0]} />
      <BirthdayBalloon position={[-3, 2, 1]} color={balloonColors[1]} />
      <BirthdayBalloon position={[0, 0, -1]} color={balloonColors[2]} />
      <BirthdayBalloon position={[3, 2, 0]} color={balloonColors[3]} />
      <BirthdayBalloon position={[6, 1, -2]} color={balloonColors[4]} />
      <BirthdayBalloon position={[2, -1, 2]} color={balloonColors[0]} />

      {/* Birthday cake (center) */}
      <BirthdayCake position={[0, 0, 4]} />

      {/* Party light beams (4) */}
      <PartyLight
        position={[-8, 5, -3]}
        rotation={[0.3, 0.3, 0]}
        color={BRAND_COLORS.YOUR_BIRTHDAY}
      />
      <PartyLight
        position={[8, 5, -3]}
        rotation={[0.3, -0.3, 0]}
        color={BRAND_COLORS.LA_LOUNGE}
      />
      <PartyLight position={[-4, 5, -5]} rotation={[0.3, 0.6, 0]} color="#A855F7" />
      <PartyLight
        position={[4, 5, -5]}
        rotation={[0.3, -0.6, 0]}
        color={BRAND_COLORS.YOUR_BIRTHDAY_LIGHT}
      />

      {/* Confetti */}
      <Confetti count={24} />
    </group>
  )
}

// ============================================================
// CAMERA RIG — subtle drift, all three sections in view
// ============================================================

function CameraRig() {
  // Hoist the mobile check to a ref (avoids per-frame layout reflow).
  const isMobileRef = useRef(typeof window !== 'undefined' ? window.innerWidth < 768 : false)
  useEffect(() => {
    const onResize = () => {
      isMobileRef.current = window.innerWidth < 768
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const m = isMobileRef.current ? 0.85 : 1.0
    // Subtle horizontal drift only; Y is pinned at 0 so each section stays
    // aligned with its page card. Camera at z=90 with fov=50 sees ~±42
    // vertical units; sections at Y=+19 / 0 / -26 each project to the
    // vertical center of their respective card (cards are not symmetrically
    // placed in the viewport, hence the asymmetric Y values).
    state.camera.position.x = Math.sin(t * 0.05) * (4 * m)
    state.camera.position.y = 0
    state.camera.position.z = 90
    state.camera.lookAt(0, 0, 0)
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

  useEffect(() => {
    setEnabled(shouldEnable3D())
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
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-ink"
    >
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        camera={{ position: [0, 0, 90], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
          depth: true,
          preserveDrawingBuffer: false,
        }}
        onCreated={({ gl }) => {
          // Mark context loss as handled so R3F can attempt recovery
          // instead of crashing when the GPU yanks the context.
          gl.domElement.addEventListener('webglcontextlost', (e) => e.preventDefault())
        }}
      >
        <color attach="background" args={['#0a0a0a']} />
        <fog attach="fog" args={['#0a0a0a', 60, 160]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 20, 5]} intensity={0.8} />
        <directionalLight position={[-10, -10, -5]} intensity={0.4} color="#FFD1E8" />
        <CameraRig />
        {/* Section 1 — TOP — LUT real furniture.
            Y=+19 projects to NDC_Y=+0.453 → pixel ~355 (card 1 center is at pixel 352).
            Scaled ×3 so the furniture is large enough to read at z=90 distance
            and spans roughly 70% of card 1's width (chairs at pixel X≈324–1018). */}
        <group position={[0, 19, 0]} scale={3}>
          <LutFurnitureSection />
        </group>
        {/* Section 2 — MIDDLE — La Lounge blueprint.
            Y=0 projects to NDC_Y=0 → pixel 648.5 (card 2 center is at pixel 704).
            NOT scaled — keeps the trusses (local Y=12) from extending above
            NDC +0.286 (pixel ~463), which would bleed into card 1's area. */}
        <group position={[0, 0, 0]}>
          <LaLoungeBlueprintSection />
        </group>
        {/* Section 3 — BOTTOM — Birthday party.
            Y=-26 projects to NDC_Y=-0.619 → pixel ~1050 (card 3 center is at pixel 1056).
            Scaled ×3 so the party objects are large enough to read at z=90 distance. */}
        <group position={[0, -26, 0]} scale={3}>
          <BirthdayPartySection />
        </group>
      </Canvas>
    </div>
  )
}
