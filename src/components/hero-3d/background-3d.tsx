'use client'

import { useRef, useState, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { shouldEnable3D } from '@/lib/device-capabilities'

const ITEM_COUNT = 18
const TUNNEL_LENGTH = 70
const SPEED = 3.5

const PALETTE = [
  '#f5f5dc', '#1b263b', '#6f4e37', '#0d0d0d',
  '#ffffff', '#8e1600', '#4a148c', '#d4af37',
]

function ModernChair({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 0.15, 1]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.6, -0.45]}>
        <boxGeometry args={[1, 1.2, 0.15]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.3} />
      </mesh>
      {[-0.4, 0.4].map((x) =>
        [-0.4, 0.4].map((z) => (
          <mesh key={`leg-${x}-${z}`} position={[x, -0.5, z]}>
            <cylinderGeometry args={[0.04, 0.02, 1, 16]} />
            <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.15} />
          </mesh>
        )),
      )}
    </group>
  )
}

function LuxurySofa({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.8, 0.4, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.6, -0.45]}>
        <boxGeometry args={[2.8, 0.8, 0.3]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh position={[-1.25, 0.4, 0.1]}>
        <boxGeometry args={[0.3, 0.6, 1.0]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh position={[1.25, 0.4, 0.1]}>
        <boxGeometry args={[0.3, 0.6, 1.0]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
      </mesh>
      {[-1.2, 1.2].map((x) =>
        [-0.4, 0.4].map((z) => (
          <mesh key={`sofa-leg-${x}-${z}`} position={[x, -0.3, z]}>
            <cylinderGeometry args={[0.06, 0.04, 0.2, 16]} />
            <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.15} />
          </mesh>
        )),
      )}
    </group>
  )
}

function RoundTable({ color }: { color: string }) {
  const topColor = color === '#0d0d0d' ? '#222222' : '#ffffff'
  return (
    <group>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.1, 48]} />
        <meshStandardMaterial color={topColor} roughness={0.1} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.15, 0.1, 0.8, 24]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.1, 48]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.15} />
      </mesh>
    </group>
  )
}

function FloorLamp({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.05, 24]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.15} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 2.4, 12]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.15} />
      </mesh>
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.6, 24, 1, true]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshBasicMaterial color="#ffeba1" />
      </mesh>
    </group>
  )
}

function Sideboard({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[2.4, 1, 0.8]} />
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.2} />
      </mesh>
      <mesh position={[0, 1.12, 0]}>
        <boxGeometry args={[2.45, 0.05, 0.85]} />
        <meshStandardMaterial color="#ffffff" roughness={0.08} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.6, 0.41]}>
        <boxGeometry args={[0.02, 0.9, 0.02]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.15} />
      </mesh>
      <mesh position={[-0.8, 0.6, 0.41]}>
        <boxGeometry args={[0.02, 0.9, 0.02]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.15} />
      </mesh>
      <mesh position={[0.8, 0.6, 0.41]}>
        <boxGeometry args={[0.02, 0.9, 0.02]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.15} />
      </mesh>
      {[-1.1, 1.1].map((x) =>
        [-0.3, 0.3].map((z) => (
          <mesh key={`sb-leg-${x}-${z}`} position={[x, 0.05, z]}>
            <cylinderGeometry args={[0.04, 0.02, 0.1, 12]} />
            <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.15} />
          </mesh>
        )),
      )}
    </group>
  )
}

function TunnelItem({ isMobile }: { isMobile: boolean }) {
  const meshRef = useRef<THREE.Group>(null)
  const data = useMemo(() => {
    const type = Math.floor(Math.random() * 5)
    const color = PALETTE[Math.floor(Math.random() * PALETTE.length)]
    const angle = Math.random() * Math.PI * 2
    const innerRadius = isMobile ? 2.5 : 5.5
    const radius = innerRadius + Math.random() * (isMobile ? 3.5 : 6)
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    const z = -(Math.random() * TUNNEL_LENGTH)
    const scale = (0.4 + Math.random() * 0.6) * (isMobile ? 0.6 : 1)
    const rotSpeedX = (Math.random() - 0.5) * 0.4
    const rotSpeedY = (Math.random() - 0.5) * 0.6
    const rotSpeedZ = (Math.random() - 0.5) * 0.4
    return { type, color, x, y, z, scale, rotSpeedX, rotSpeedY, rotSpeedZ }
  }, [isMobile])
  const initialRot = useMemo(
    () => [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number],
    [],
  )
  useFrame((state, delta) => {
    if (!meshRef.current) return
    meshRef.current.position.z += SPEED * delta
    meshRef.current.position.y = data.y + Math.sin(state.clock.elapsedTime * 1.5 + data.x) * 0.3
    meshRef.current.rotation.x += data.rotSpeedX * delta
    meshRef.current.rotation.y += data.rotSpeedY * delta
    meshRef.current.rotation.z += data.rotSpeedZ * delta
    if (meshRef.current.position.z > 5) meshRef.current.position.z -= TUNNEL_LENGTH
  })
  return (
    <group ref={meshRef} position={[data.x, data.y, data.z]} scale={data.scale} rotation={initialRot}>
      {data.type === 0 && <ModernChair color={data.color} />}
      {data.type === 1 && <LuxurySofa color={data.color} />}
      {data.type === 2 && <RoundTable color={data.color} />}
      {data.type === 3 && <FloorLamp color={data.color} />}
      {data.type === 4 && <Sideboard color={data.color} />}
    </group>
  )
}

function InfiniteTunnel({ isMobile }: { isMobile: boolean }) {
  const items = useMemo(() => new Array(ITEM_COUNT).fill(0), [])
  return (
    <group>
      {items.map((_, i) => (<TunnelItem key={i} isMobile={isMobile} />))}
      <Sparkles count={isMobile ? 40 : 60} scale={[20, 20, TUNNEL_LENGTH]} position={[0, 0, -TUNNEL_LENGTH / 2]} size={isMobile ? 1.5 : 2.5} speed={0.4} opacity={0.3} color="#d4af37" />
    </group>
  )
}

function CameraRig() {
  // Jitter fix: deadzone + double-smoothing to eliminate light flicker
  const targetX = useRef(0)
  const targetY = useRef(0)
  useFrame((state) => {
    const px = state.pointer.x
    const py = state.pointer.y
    const DEADZONE = 0.05
    const deadX = Math.abs(px) < DEADZONE ? 0 : px
    const deadY = Math.abs(py) < DEADZONE ? 0 : py
    targetX.current = THREE.MathUtils.lerp(targetX.current, deadX * 1.0, 0.08)
    targetY.current = THREE.MathUtils.lerp(targetY.current, deadY * 1.0, 0.08)
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX.current, 0.1)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY.current, 0.1)
    state.camera.lookAt(0, 0, -20)
  })
  return null
}

interface Background3DProps {
  active?: boolean
}

export function Background3D({ active = true }: Background3DProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [inView, setInView] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setEnabled(shouldEnable3D())
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!enabled || !containerRef.current) return
    const el = containerRef.current
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 })
    io.observe(el)
    return () => io.disconnect()
  }, [enabled])

  if (!enabled || !active) return null

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {inView && (
        <Canvas
          camera={{ position: [0, 0, 0], fov: 45 }}
          style={{ pointerEvents: 'none' }}
          // Lower DPR cap for the background — it's behind cards so doesn't need
          // to be razor-sharp. This cuts GPU fill rate by ~60%.
          dpr={[1, isMobile ? 1 : 1.5]}
          frameloop="always"
          gl={{
            antialias: false, // Tunnel is blurry/dark anyway — MSAA not needed
            powerPreference: 'high-performance',
            alpha: false,
            stencil: false,
            depth: true,
          }}
        >
          <color attach="background" args={['#050505']} />
          <fog attach="fog" args={['#050505', 25, 75]} />
          {/* Simplified lighting — fewer lights = fewer shader passes + no overlighting.
              Was: ambient(0.35) + spotLight(8) + spotLight(12) + spotLight(9) + directional(2.5) + pointLight(3) = ~35 intensity
              Now: ambient(0.5) + directional(3) + directional(2) + pointLight(4) = ~9.5 intensity
              Plus Bloom is removed (was amplifying the lamp glow into harsh flare on mobile). */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 8, 5]} intensity={3} color="#ffedd6" />
          <directionalLight position={[-8, -4, -8]} intensity={2} color="#4f6d8f" />
          <pointLight position={[0, 0, 5]} intensity={4} color="#d4af37" distance={25} />
          <InfiniteTunnel isMobile={isMobile} />
          <CameraRig />
          <Environment preset="studio" />
          {/* Bloom removed — it was the #1 GPU bottleneck AND caused the
              "too bright/harsh light" symptom on mobile by amplifying the
              lamp bulb glow into a full-screen flare. The lamp bulbs still
              glow via meshBasicMaterial, just without the bloom halo. */}
        </Canvas>
      )}
    </div>
  )
}
