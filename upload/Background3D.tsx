import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

const ITEM_COUNT = 55;
const TUNNEL_LENGTH = 70;
const SPEED = 4;

// Rich color palette representing luxury furniture themes
const PALETTE = [
  '#f5f5dc', // Cream / Beige
  '#1b263b', // Deep Navy
  '#6f4e37', // Polished Walnut
  '#0d0d0d', // Glossy Black
  '#ffffff', // Pearl White
  '#8e1600', // Deep Velvet Red
  '#4a148c', // Deep Purple
  '#d4af37', // Metallic Gold accent
];

// --- Procedural Furniture Models ---
// Using MeshPhysicalMaterial for a premium, glossy, real-world feel

function ModernChair({ color }: { color: string }) {
  return (
    <group>
      {/* Seat */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 0.15, 1]} />
        <meshPhysicalMaterial color={color} roughness={0.15} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.6, -0.45]}>
        <boxGeometry args={[1, 1.2, 0.15]} />
        <meshPhysicalMaterial color={color} roughness={0.15} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
      {/* Gold Legs */}
      {[-0.4, 0.4].map((x) => 
        [-0.4, 0.4].map((z) => (
          <mesh key={`leg-${x}-${z}`} position={[x, -0.5, z]}>
            <cylinderGeometry args={[0.04, 0.02, 1, 16]} />
            <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.15} />
          </mesh>
        ))
      )}
    </group>
  );
}

function LuxurySofa({ color }: { color: string }) {
  return (
    <group>
      {/* Main Seat */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.8, 0.4, 1.2]} />
        <meshPhysicalMaterial color={color} roughness={0.4} clearcoat={0.3} clearcoatRoughness={0.2} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.6, -0.45]}>
        <boxGeometry args={[2.8, 0.8, 0.3]} />
        <meshPhysicalMaterial color={color} roughness={0.4} clearcoat={0.3} clearcoatRoughness={0.2} />
      </mesh>
      {/* Armrests */}
      <mesh position={[-1.25, 0.4, 0.1]}>
        <boxGeometry args={[0.3, 0.6, 1.0]} />
        <meshPhysicalMaterial color={color} roughness={0.4} clearcoat={0.3} clearcoatRoughness={0.2} />
      </mesh>
      <mesh position={[1.25, 0.4, 0.1]}>
        <boxGeometry args={[0.3, 0.6, 1.0]} />
        <meshPhysicalMaterial color={color} roughness={0.4} clearcoat={0.3} clearcoatRoughness={0.2} />
      </mesh>
      {/* Legs */}
      {[-1.2, 1.2].map((x) => 
        [-0.4, 0.4].map((z) => (
          <mesh key={`sofa-leg-${x}-${z}`} position={[x, -0.3, z]}>
            <cylinderGeometry args={[0.06, 0.04, 0.2, 16]} />
            <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.15} />
          </mesh>
        ))
      )}
    </group>
  );
}

function RoundTable({ color }: { color: string }) {
  // Use marble/glass look for the top, gold for the base
  const topColor = color === '#0d0d0d' ? '#222222' : '#ffffff';
  return (
    <group>
      {/* Top */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.1, 64]} />
        {/* High transmission for a glass/polished marble look */}
        <meshPhysicalMaterial color={topColor} roughness={0.05} clearcoat={1} transmission={0.2} thickness={0.5} />
      </mesh>
      {/* Pillar */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.15, 0.1, 0.8, 32]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.15} />
      </mesh>
      {/* Base */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.1, 64]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.15} />
      </mesh>
    </group>
  );
}

function FloorLamp({ color }: { color: string }) {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.05, 32]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.15} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 2.4, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.15} />
      </mesh>
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.6, 32]} openEnded={true} />
        <meshPhysicalMaterial color={color} roughness={0.6} transmission={0.4} side={THREE.DoubleSide} />
      </mesh>
      {/* Light bulb simulation (Bloom will pick this up) */}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#ffeba1" />
      </mesh>
    </group>
  );
}

function Sideboard({ color }: { color: string }) {
  return (
    <group>
      {/* Main Body */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[2.4, 1, 0.8]} />
        <meshPhysicalMaterial color={color} roughness={0.2} clearcoat={1} clearcoatRoughness={0.15} />
      </mesh>
      {/* Top surface - marble/glass */}
      <mesh position={[0, 1.12, 0]}>
        <boxGeometry args={[2.45, 0.05, 0.85]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.05} clearcoat={1} clearcoatRoughness={0.02} />
      </mesh>
      {/* Gold Trim/Doors */}
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
      {/* Legs */}
      {[-1.1, 1.1].map((x) => 
        [-0.3, 0.3].map((z) => (
          <mesh key={`sb-leg-${x}-${z}`} position={[x, 0.05, z]}>
            <cylinderGeometry args={[0.04, 0.02, 0.1, 16]} />
            <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.15} />
          </mesh>
        ))
      )}
    </group>
  );
}

// --- Infinite Tunnel Logic ---

function TunnelItem({ isMobile }: { isMobile: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
  
  // Randomize initial properties
  const data = useMemo(() => {
    const type = Math.floor(Math.random() * 5); // 5 furniture items
    const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    
    // Distribute objects along the walls of a tunnel, leaving the center open for the content
    const angle = Math.random() * Math.PI * 2;
    // Inner radius keeps objects away from the center text/cards
    const innerRadius = isMobile ? 2.5 : 5.5;
    const radius = innerRadius + Math.random() * (isMobile ? 3.5 : 6); 
    
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const z = -(Math.random() * TUNNEL_LENGTH);
    
    const scale = (0.4 + Math.random() * 0.6) * (isMobile ? 0.6 : 1);
    
    const rotSpeedX = (Math.random() - 0.5) * 0.4;
    const rotSpeedY = (Math.random() - 0.5) * 0.6;
    const rotSpeedZ = (Math.random() - 0.5) * 0.4;

    return { type, color, x, y, z, scale, rotSpeedX, rotSpeedY, rotSpeedZ };
  }, [isMobile]);

  // Initial random rotation
  const initialRot = useMemo(() => [
    Math.random() * Math.PI, 
    Math.random() * Math.PI, 
    Math.random() * Math.PI
  ] as [number, number, number], []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Move towards camera
    meshRef.current.position.z += SPEED * delta;
    
    // Add floating sine wave motion
    meshRef.current.position.y = data.y + Math.sin(state.clock.elapsedTime * 1.5 + data.x) * 0.3;
    
    // Rotate elegantly
    meshRef.current.rotation.x += data.rotSpeedX * delta;
    meshRef.current.rotation.y += data.rotSpeedY * delta;
    meshRef.current.rotation.z += data.rotSpeedZ * delta;

    // Reset position when passing camera
    if (meshRef.current.position.z > 5) {
      meshRef.current.position.z -= TUNNEL_LENGTH;
    }
  });

  return (
    <group ref={meshRef} position={[data.x, data.y, data.z]} scale={data.scale} rotation={initialRot}>
      {data.type === 0 && <ModernChair color={data.color} />}
      {data.type === 1 && <LuxurySofa color={data.color} />}
      {data.type === 2 && <RoundTable color={data.color} />}
      {data.type === 3 && <FloorLamp color={data.color} />}
      {data.type === 4 && <Sideboard color={data.color} />}
    </group>
  );
}

function InfiniteTunnel({ isMobile }: { isMobile: boolean }) {
  const items = useMemo(() => new Array(ITEM_COUNT).fill(0), []);

  return (
    <group>
      {items.map((_, i) => (
        <TunnelItem key={i} isMobile={isMobile} />
      ))}
      
      {/* Ambient dust/sparkles that drift slowly */}
      <Sparkles 
        count={isMobile ? 120 : 250} 
        scale={[20, 20, TUNNEL_LENGTH]} 
        position={[0, 0, -TUNNEL_LENGTH / 2]}
        size={isMobile ? 1.5 : 2.5} 
        speed={0.4} 
        opacity={0.3} 
        color="#d4af37" 
      />
    </group>
  );
}

function CameraRig() {
  useFrame((state) => {
    // Smoothly track mouse pointer with subtle parallax
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.pointer.x * 1.5, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.pointer.y * 1.5, 0.05);
    state.camera.lookAt(0, 0, -20);
  });
  return null;
}

export default function Background3D() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full -z-10 pointer-events-none bg-[#030303]">
      <Canvas camera={{ position: [0, 0, 0], fov: 45 }}>
        {/* Dark cinematic background */}
        <color attach="background" args={['#030303']} />
        
        {/* Dense fog for mysterious depth */}
        <fog attach="fog" args={['#030303', 15, TUNNEL_LENGTH - 10]} />
        
        {/* Cinematic Lighting Setup */}
        <ambientLight intensity={0.1} />
        
        {/* Key Light: Warm & Dramatic */}
        <spotLight position={[15, 10, 5]} angle={0.4} penumbra={1} intensity={5} color="#ffedd6" />
        
        {/* Fill Light: Cool Cinematic Blue/Cyan */}
        <directionalLight position={[-10, -5, -5]} intensity={1.5} color="#4f6d8f" />
        
        {/* Rim / Backlight: Gold for premium edges */}
        <spotLight position={[0, -5, -25]} angle={0.6} penumbra={0.8} intensity={8} color="#d4af37" />
        <spotLight position={[-5, 5, -20]} angle={0.5} penumbra={1} intensity={6} color="#8e1600" />
        
        <InfiniteTunnel isMobile={isMobile} />
        <CameraRig />
        
        <Environment preset="studio" />
        
        {/* Post-processing effects for premium look */}
        <EffectComposer disableNormalPass multisampling={4}>
          <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.2} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

