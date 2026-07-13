'use client'

import { shouldEnable3D } from '@/lib/device-capabilities'
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ═════════════════════════════════════════════════════════════════
// PALETTE & CONFIG
// ═════════════════════════════════════════════════════════════════
const PALETTE = {
  DEEP_PLUM: 0x0d0609,
  GRID_MAIN: 0xE8D5E0, GRID_LIGHT: 0xF0E6EB, GRID_ACCENT: 0xC9A96E, GRID_PULSE: 0xFFD1E8,
  RING_COLOR: 0xB890A0, VELVET_PLUM: 0x6B3A5A, VELVET_GOLD: 0x8B6F47,
  IVORY_LACQUER: 0xF8F4EC, BRASS_POLISHED: 0xC9A96E,
  MYLAR_PINK: 0xE8A4C8, MYLAR_GOLD: 0xF0D878,
  LUT: 0x6B3A5A, LA_LOUNGE: 0xC9A96E, YOUR_BIRTHDAY: 0xFFD1E8,
  WARM_KEY: 0xFFF0DD, COOL_FILL: 0xC8D8E8, AMBIENT_BASE: 0xE8D8E0, CRYSTAL_RIM: 0xFF88CC,
  NEON_CYAN: 0x00FFFF, NEON_MAGENTA: 0xFF00FF, NEON_YELLOW: 0xFFFF00
};

type Vec3 = [number, number, number];

// ═════════════════════════════════════════════════════════════════
// SHADERS
// ═════════════════════════════════════════════════════════════════
const gridVertexShader = `
  varying vec2 vUv; varying vec3 vWorldPos;
  void main() { vUv = uv; vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const gridFragmentShader = `
  uniform float uTime; uniform vec3 uColorMain; uniform vec3 uColorAccent; uniform vec3 uColorLight; uniform vec3 uColorPulse;
  uniform float uFadeStart; uniform float uFadeEnd;
  varying vec2 vUv; varying vec3 vWorldPos;
  float gridLine(vec2 coord, float width) { vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord); float line = min(grid.x, grid.y); return 1.0 - min(line, 1.0); }
  void main() {
    float dist = length(vWorldPos.xz); 
    float fade = 1.0 - smoothstep(uFadeStart, uFadeEnd, dist); 
    float fine = gridLine(vUv * 60.0, 1.0) * 0.1; 
    float major = gridLine(vUv * 12.0, 1.0) * 0.35; 
    float accent = gridLine(vUv * 6.0, 1.0) * 0.5;
    float pulse = sin(dist * 0.15 - uTime * 0.8) * 0.5 + 0.5;
    float ring = smoothstep(0.02, 0.0, abs(fract(dist * 0.08 - uTime * 0.12) - 0.5) * 2.0) * pulse * 0.3;
    float flow = smoothstep(0.02, 0.0, abs(fract(vUv.y * 40.0 + uTime * 0.05) - 0.5) * 2.0) * 0.05;
    vec3 color = mix(uColorLight, uColorMain, fine + major); color = mix(color, uColorAccent, accent); color = mix(color, uColorPulse, ring); color += uColorAccent * flow;
    float alpha = (fine + major * 0.6 + accent * 0.4 + ring + flow) * fade;
    gl_FragColor = vec4(color, alpha * 0.8);
  }
`;

const holoVertexShader = `
  varying vec2 vUv; varying vec3 vNormal; varying vec3 vViewPosition;
  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;
const holoFragmentShader = `
  uniform float uTime; uniform vec3 uColor; 
  varying vec2 vUv; varying vec3 vNormal; varying vec3 vViewPosition;
  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - dot(normal, viewDir), 2.0);
    float scanline = sin(vUv.y * 150.0 + uTime * 15.0) * 0.15 + 0.85;
    float flicker = sin(uTime * 40.0) * 0.05 + 0.95;
    float alpha = (fresnel * 0.8 + 0.2) * scanline * flicker;
    gl_FragColor = vec4(uColor * fresnel * 1.0, alpha * 0.4); 
  }
`;

const screenFragmentShader = `
  varying vec2 vUv; uniform float uTime;
  void main() {
    float wave = sin(vUv.x * 30.0 + uTime * 10.0) * 0.5 + 0.5;
    float grid = step(0.9, mod(vUv.y * 20.0, 1.0));
    vec3 col = vec3(0.0, 1.0, 1.0) * wave + vec3(1.0, 0.0, 1.0) * grid;
    gl_FragColor = vec4(col, 0.6);
  }
`;

// ═════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═════════════════════════════════════════════════════════════════
const VelvetMaterial = ({ color }: { color: number }) => (
  <meshPhysicalMaterial 
    color={color} 
    roughness={0.8} 
    metalness={0}
    sheen={1.0} 
    sheenRoughness={0.2} 
    sheenColor={new THREE.Color(color).multiplyScalar(1.5)} 
  />
);

const BrassMaterial = () => (
  <meshStandardMaterial color={PALETTE.BRASS_POLISHED} metalness={1.0} roughness={0.15} />
);

const IvoryMaterial = () => (
  <meshStandardMaterial color={PALETTE.IVORY_LACQUER} roughness={0.1} metalness={0.5} />
);

const GlassMaterial = () => (
  <meshPhysicalMaterial 
    color={0xffffff} transmission={1.0} thickness={1.0} roughness={0.01} 
    ior={1.5} clearcoat={1.0} transparent opacity={0.25} 
  />
);

const WoodMaterial = () => (
  <meshStandardMaterial color={PALETTE.VELVET_GOLD} roughness={0.4} metalness={0.3} />
);

const BlackLacquerMaterial = () => (
  <meshStandardMaterial color={0x050505} roughness={0.1} metalness={0.5} />
);

const DarkMetalMaterial = () => (
  <meshStandardMaterial color={0x0a0a0a} metalness={1.0} roughness={0.2} />
);

const MylarMaterial = ({ color }: { color: number }) => (
  <meshStandardMaterial color={color} roughness={0.1} metalness={0.6} />
);

// ═════════════════════════════════════════════════════════════════
// FURNITURE COMPONENTS
// ═════════════════════════════════════════════════════════════════
const Chair = ({ position, color, rotation = [0,0,0] }: { position: Vec3, color: number, rotation?: Vec3 }) => (
  <group position={position} rotation={rotation}>
    <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.2, 0.2, 1.2]} />
      <VelvetMaterial color={color} />
    </mesh>
    <mesh position={[0, 1.1, -0.5]} castShadow>
      <boxGeometry args={[1.2, 1.2, 0.15]} />
      <VelvetMaterial color={color} />
    </mesh>
    {([[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]] as [number, number][]).map(([x, z], i) => (
      <mesh key={i} position={[x, 0, z]} castShadow>
        <cylinderGeometry args={[0.05, 0.04, 1, 16]} />
        <BrassMaterial />
      </mesh>
    ))}
  </group>
);

const Table = ({ position, isGlass = false }: { position: Vec3, isGlass?: boolean }) => (
  <group position={position}>
    <mesh position={[0, 1, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[1.6, 1.6, 0.12, 64]} />
      {isGlass ? <GlassMaterial /> : <IvoryMaterial />}
    </mesh>
    <mesh position={[0, 0.5, 0]} castShadow>
      <cylinderGeometry args={[0.1, 0.15, 1, 32]} />
      <WoodMaterial />
    </mesh>
    <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[1.0, 1.0, 0.12, 64]} />
      <WoodMaterial />
    </mesh>
    <mesh position={[0, 1.07, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1.65, 0.03, 16, 96]} />
      <BrassMaterial />
    </mesh>
  </group>
);

const Sofa = ({ position, color }: { position: Vec3, color: number }) => (
  <group position={position}>
    <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
      <boxGeometry args={[3.2, 0.7, 1.3]} />
      <VelvetMaterial color={color} />
    </mesh>
    <mesh position={[0, 1.1, -0.5]} castShadow>
      <boxGeometry args={[3.2, 0.9, 0.25]} />
      <VelvetMaterial color={color} />
    </mesh>
    <mesh position={[-1.6, 0.65, 0]} castShadow>
      <boxGeometry args={[0.35, 0.9, 1.3]} />
      <VelvetMaterial color={color} />
    </mesh>
    <mesh position={[1.6, 0.65, 0]} castShadow>
      <boxGeometry args={[0.35, 0.9, 1.3]} />
      <VelvetMaterial color={color} />
    </mesh>
    <mesh position={[-1, 0.9, 0.2]} rotation={[0, 0, 0.1]} castShadow>
      <boxGeometry args={[0.8, 0.4, 0.4]} />
      <VelvetMaterial color={PALETTE.YOUR_BIRTHDAY} />
    </mesh>
    <mesh position={[1, 0.9, 0.2]} rotation={[0, 0, -0.1]} castShadow>
      <boxGeometry args={[0.8, 0.4, 0.4]} />
      <VelvetMaterial color={PALETTE.LA_LOUNGE} />
    </mesh>
  </group>
);

const Lamp = ({ position }: { position: Vec3 }) => (
  <group position={position}>
    <mesh position={[0, 0.1, 0]} castShadow>
      <cylinderGeometry args={[0.35, 0.45, 0.2, 32]} />
      <BrassMaterial />
    </mesh>
    <mesh position={[0, 1.5, 0]}>
      <cylinderGeometry args={[0.035, 0.035, 2.8, 16]} />
      <BrassMaterial />
    </mesh>
    <mesh position={[0, 2.9, 0]}>
      <coneGeometry args={[0.45, 0.6, 32, 1, true]} />
      <meshStandardMaterial color={PALETTE.IVORY_LACQUER} roughness={0.6} emissive={0xFFE4B5} emissiveIntensity={1.0} side={THREE.DoubleSide} transparent opacity={0.9} />
    </mesh>
    <mesh position={[0, 2.7, 0]}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshBasicMaterial color={0xFFF8E7} />
    </mesh>
    <pointLight position={[0, 2.7, 0]} intensity={2.0} distance={8} decay={2} color={0xFFE4B5} />
  </group>
);

const CoffeeTableTray = () => (
  <group>
    <mesh position={[0, 1.1, 0]} castShadow>
      <boxGeometry args={[1.2, 0.05, 0.8]} />
      <meshStandardMaterial color={PALETTE.BRASS_POLISHED} metalness={1} roughness={0.2} />
    </mesh>
    <mesh position={[-0.3, 1.18, 0]} rotation={[0, 0.2, 0]} castShadow>
      <boxGeometry args={[0.4, 0.1, 0.6]} />
      <meshStandardMaterial color={PALETTE.LUT} roughness={0.7} />
    </mesh>
    <mesh position={[-0.35, 1.26, 0.05]} rotation={[0, 0.3, 0]} castShadow>
      <boxGeometry args={[0.4, 0.08, 0.6]} />
      <meshStandardMaterial color={PALETTE.LA_LOUNGE} roughness={0.7} />
    </mesh>
    <mesh position={[0.3, 1.32, 0]}>
      <cylinderGeometry args={[0.15, 0.1, 0.4, 16]} />
      <meshPhysicalMaterial color={0xffffff} roughness={0.1} transmission={0.5} transparent opacity={0.5} />
    </mesh>
    {Array.from({ length: 3 }).map((_, i) => (
      <mesh key={i} position={[0.3 + (Math.random()-0.5)*0.1, 1.55 + (Math.random()-0.5)*0.05, (Math.random()-0.5)*0.1]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color={PALETTE.YOUR_BIRTHDAY} emissive={PALETTE.YOUR_BIRTHDAY} emissiveIntensity={0.2} />
      </mesh>
    ))}
  </group>
);

const Plant = () => (
  <group position={[7, 0, 2]}>
    <mesh position={[0, 0.3, 0]} castShadow>
      <cylinderGeometry args={[0.5, 0.4, 0.6, 16]} />
      <BrassMaterial />
    </mesh>
    <mesh position={[0, 0.58, 0]}>
      <cylinderGeometry args={[0.48, 0.48, 0.05, 16]} />
      <meshStandardMaterial color={0x111111} />
    </mesh>
    {Array.from({ length: 5 }).map((_, i) => (
      <group key={i}>
        <mesh position={[0, 1.2, 0]} rotation={[0, 0, (Math.random()-0.5)*0.5]} >
          <cylinderGeometry args={[0.03, 0.05, 1.5 + Math.random()*0.5, 8]} />
          <meshStandardMaterial color={0x2d4a2d} roughness={0.8} />
        </mesh>
        {Array.from({ length: 3 }).map((_, j) => (
          <mesh key={j} position={[Math.cos(i)*0.5, 1.8 + Math.random()*0.3, Math.sin(i)*0.5]} scale={[1, 0.1, 0.6]} rotation={[Math.random(), Math.random(), Math.random()]}>
            <sphereGeometry args={[0.4, 8, 8]} />
            <meshStandardMaterial color={0x4a8a4a} roughness={0.8} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    ))}
  </group>
);

const LutFurniture = ({ z, scale }: { z: number, scale: number }) => (
  <group position={[0, 0, z]} scale={scale}>
    <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[18, 16]} />
      <meshStandardMaterial color={0x2D1818} roughness={0.95} side={THREE.DoubleSide} />
    </mesh>
    <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[8.8, 9.0, 96]} />
      <meshBasicMaterial color={PALETTE.BRASS_POLISHED} transparent opacity={0.8} side={THREE.DoubleSide} />
    </mesh>
    <Sofa position={[0, 0, -5]} color={PALETTE.LUT} />
    <Table position={[0, 0, -1]} isGlass />
    <CoffeeTableTray />
    <Chair position={[-3, 0, 2]} color={PALETTE.LUT} rotation={[0, Math.PI * 25 / 180, 0]} />
    <Chair position={[3, 0, 2]} color={PALETTE.LUT} rotation={[0, -Math.PI * 25 / 180, 0]} />
    <Chair position={[-5.5, 0, -1]} color={PALETTE.IVORY_LACQUER} rotation={[0, Math.PI / 2, 0]} />
    <Chair position={[5.5, 0, -1]} color={PALETTE.IVORY_LACQUER} rotation={[0, -Math.PI / 2, 0]} />
    <Table position={[-5.5, 0, -3]} />
    <mesh position={[-5.5, 1.35, -3]} castShadow>
      <cylinderGeometry args={[0.4, 0.3, 0.6, 32]} />
      <BrassMaterial />
    </mesh>
    {Array.from({ length: 8 }).map((_, i) => (
      <mesh key={i} position={[-5.5 + (Math.random()-0.5)*0.4, 1.6 + (Math.random()-0.5)*0.1, -3 + (Math.random()-0.5)*0.4]} rotation={[Math.random(), Math.random(), Math.random()]}>
        <boxGeometry args={[0.12, 0.12, 0.12]} />
        <GlassMaterial />
      </mesh>
    ))}
    <Table position={[5.5, 0, -3]} />
    <Lamp position={[5.5, 0, -3]} />
    <Plant />
  </group>
);

// ═════════════════════════════════════════════════════════════════
// LIGHTING STANDS & PARTY ELEMENTS
// ═════════════════════════════════════════════════════════════════
const LightingStand = ({ position, lightColor }: { position: Vec3, lightColor: number }) => (
  <group position={position}>
    {Array.from({ length: 3 }).map((_, i) => {
      const angle = (i / 3) * Math.PI * 2;
      return (
        <mesh key={i} position={[Math.cos(angle) * 0.5, 1.25, Math.sin(angle) * 0.5]} rotation={[Math.cos(angle) * 0.2, 0, -Math.sin(angle) * 0.2]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 2.5, 8]} />
          <DarkMetalMaterial />
        </mesh>
      );
    })}
    <mesh position={[0, 4.25, 0]} castShadow>
      <cylinderGeometry args={[0.06, 0.06, 3.5, 16]} />
      <DarkMetalMaterial />
    </mesh>
    <group position={[0, 6.0, 0]} rotation={[Math.PI / 4, 0, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.35, 0.4, 0.6, 32]} />
        <DarkMetalMaterial />
      </mesh>
      <mesh position={[0, -0.31, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 32]} />
        <meshBasicMaterial color={lightColor} />
      </mesh>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.1, 0.8, 0.1]} />
        <DarkMetalMaterial />
      </mesh>
      <mesh position={[0, -3.0, 0]}>
        <coneGeometry args={[2.5, 6, 32, 1, true]} />
        <shaderMaterial 
          uniforms={{ uColor: { value: new THREE.Color(lightColor) } }}
          vertexShader={`varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
          fragmentShader={`uniform vec3 uColor; varying vec2 vUv; void main() { float alpha = pow(1.0 - vUv.y, 2.5) * 0.3; gl_FragColor = vec4(uColor, alpha); }`}
          transparent blending={THREE.AdditiveBlending} side={THREE.DoubleSide} depthWrite={false}
        />
      </mesh>
    </group>
    <pointLight position={[0, 5.5, 0]} intensity={1.5} distance={10} decay={2} color={lightColor} />
  </group>
);

const NeonHeart = ({ position }: { position: Vec3 }) => {
  const shape = useMemo(() => {
    const x = 0, y = 0;
    const heartShape = new THREE.Shape();
    heartShape.moveTo(x + 0.5, y + 0.5);
    heartShape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
    heartShape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
    heartShape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9);
    heartShape.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
    heartShape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1.0, y);
    heartShape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);
    return heartShape;
  }, []);
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]} scale={[0.6, -0.6, 0.6]}>
        <extrudeGeometry args={[shape, { depth: 0.1, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 }]} />
        <meshStandardMaterial color={PALETTE.NEON_MAGENTA} emissive={PALETTE.NEON_MAGENTA} emissiveIntensity={2.0} />
      </mesh>
      <pointLight position={[0, 1.5, 1]} intensity={2.0} distance={10} decay={2} color={PALETTE.NEON_MAGENTA} />
    </group>
  );
};

const LEDDanceFloor = ({ position }: { position: Vec3 }) => {
  const tiles = useMemo(() => {
    const colors = [PALETTE.NEON_CYAN, PALETTE.NEON_MAGENTA, PALETTE.NEON_YELLOW, 0x000000];
    return Array.from({ length: 16 }).map((_, i) => {
      const size = 4;
      const x = (i % size) - size/2 + 0.5;
      const z = Math.floor(i / size) - size/2 + 0.5;
      const c = colors[Math.floor(Math.random()*colors.length)];
      return { x, z, c };
    });
  }, []);

  const tilesRef = useRef<THREE.Mesh[]>([]);
  useFrame(() => {
    tilesRef.current.forEach((tile) => {
      if (tile && Math.random() > 0.95) {
        const mat = tile.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = Math.random() * 1.5;
      }
    });
  });

  return (
    <group position={position}>
      {tiles.map((tile, i) => (
        <mesh 
          key={i} 
          ref={el => { if (el) tilesRef.current[i] = el; }} 
          position={[tile.x, 0.05, tile.z]}
        >
          <boxGeometry args={[0.9, 0.1, 0.9]} />
          <meshStandardMaterial 
            color={0x111111} 
            emissive={tile.c} 
            emissiveIntensity={tile.c === 0x000000 ? 0 : 0.8} 
            metalness={0.5} 
            roughness={0.2} 
          />
        </mesh>
      ))}
    </group>
  );
};

const PartySpeaker = ({ position, ringColor }: { position: Vec3, ringColor: number }) => (
  <group position={position}>
    {Array.from({ length: 3 }).map((_, i) => {
      const angle = (i / 3) * Math.PI * 2;
      return (
        <mesh key={i} position={[Math.cos(angle) * 0.5, 1.25, Math.sin(angle) * 0.5]} rotation={[Math.cos(angle) * 0.2, 0, -Math.sin(angle) * 0.2]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 2.5, 8]} />
          <DarkMetalMaterial />
        </mesh>
      );
    })}
    <mesh position={[0, 2.5, 0]}>
      <cylinderGeometry args={[0.05, 0.05, 2.5, 12]} />
      <DarkMetalMaterial />
    </mesh>
    <mesh position={[0, 4.5, 0]} castShadow>
      <boxGeometry args={[1.0, 1.5, 0.8]} />
      <BlackLacquerMaterial />
    </mesh>
    <mesh position={[0, 4.3, 0.41]} rotation={[Math.PI/2, 0, 0]}>
      <cylinderGeometry args={[0.35, 0.35, 0.05, 32]} />
      <meshStandardMaterial color={0x111111} roughness={0.8} />
    </mesh>
    <mesh position={[0, 5.1, 0.41]} rotation={[Math.PI/2, 0, 0]}>
      <cylinderGeometry args={[0.12, 0.12, 0.05, 16]} />
      <meshStandardMaterial color={0x111111} roughness={0.8} />
    </mesh>
    <mesh position={[0, 4.3, 0.42]}>
      <torusGeometry args={[0.35, 0.02, 8, 32]} />
      <meshBasicMaterial color={ringColor} />
    </mesh>
  </group>
);

const DJBooth = ({ position }: { position: Vec3 }) => (
  <group position={position}>
    <mesh position={[0, 0.6, 0]} castShadow>
      <boxGeometry args={[3.5, 1.2, 1.2]} />
      <BlackLacquerMaterial />
    </mesh>
    <mesh position={[0, 0.8, 0.61]}>
      <boxGeometry args={[3.4, 0.08, 0.02]} />
      <meshBasicMaterial color={PALETTE.NEON_YELLOW} />
    </mesh>
    <mesh position={[-1.0, 1.25, 0]}>
      <cylinderGeometry args={[0.35, 0.35, 0.05, 32]} />
      <DarkMetalMaterial />
    </mesh>
    <mesh position={[1.0, 1.25, 0]}>
      <cylinderGeometry args={[0.35, 0.35, 0.05, 32]} />
      <DarkMetalMaterial />
    </mesh>
    <mesh position={[0, 1.26, 0]}>
      <boxGeometry args={[0.8, 0.08, 0.6]} />
      <DarkMetalMaterial />
    </mesh>
    {Array.from({ length: 3 }).map((_, i) => (
      <group key={i}>
        <mesh position={[(i-1) * 0.2, 1.32, -0.1]}>
          <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
          <BrassMaterial />
        </mesh>
        <mesh position={[(i-1) * 0.2, 1.32, 0.1]}>
          <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
          <BrassMaterial />
        </mesh>
      </group>
    ))}
  </group>
);

const MicStand = ({ position }: { position: Vec3 }) => (
  <group position={position}>
    <mesh position={[0, 1.25, 0]}>
      <cylinderGeometry args={[0.03, 0.03, 2.5, 8]} />
      <BrassMaterial />
    </mesh>
    <mesh position={[0, 0.05, 0]} castShadow>
      <cylinderGeometry args={[0.4, 0.5, 0.1, 16]} />
      <BrassMaterial />
    </mesh>
    <mesh position={[0, 2.7, 0]}>
      <cylinderGeometry args={[0.1, 0.12, 0.35, 16]} />
      <meshStandardMaterial color={0x222222} metalness={0.8} roughness={0.4} />
    </mesh>
    <mesh position={[0, 2.95, 0]}>
      <sphereGeometry args={[0.13, 16, 16]} />
      <meshStandardMaterial color={0x888888} metalness={1} roughness={0.3} wireframe />
    </mesh>
  </group>
);

const Balloon = ({ position, color }: { position: Vec3, color: number }) => {
  const ref = useRef<THREE.Group>(null);
  const baseY = position[1];
  const baseX = position[0];
  const baseZ = position[2];

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.position.y = baseY + Math.sin(t * 0.35 + baseX * 0.8) * 0.12 + Math.sin(t * 0.6 + baseZ) * 0.05;
      ref.current.rotation.z = Math.sin(t * 0.2 + baseZ) * 0.04;
      ref.current.rotation.x = Math.sin(t * 0.15 + baseX) * 0.03;
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh scale={[1, 1.15, 1]} castShadow>
        <sphereGeometry args={[0.7, 32, 32]} />
        <MylarMaterial color={color} />
      </mesh>
      <mesh position={[0, -0.85, 0]}>
        <coneGeometry args={[0.1, 0.2, 16]} />
        <MylarMaterial color={color} />
      </mesh>
      <mesh position={[0, -1.4, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 1, 8]} />
        <meshBasicMaterial color={PALETTE.IVORY_LACQUER} />
      </mesh>
    </group>
  );
};

const PartyHat = ({ position, color }: { position: Vec3, color: number }) => (
  <group position={position}>
    <mesh position={[0, 0.35, 0]} castShadow>
      <coneGeometry args={[0.3, 0.7, 16]} />
      <VelvetMaterial color={color} />
    </mesh>
    <mesh position={[0, 0.75, 0]}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <BrassMaterial />
    </mesh>
  </group>
);

const ChampagneFlute = ({ position }: { position: Vec3 }) => (
  <group position={position}>
    <mesh position={[0, 0.2, 0]}>
      <cylinderGeometry args={[0.12, 0.05, 0.4, 16]} />
      <GlassMaterial />
    </mesh>
    <mesh position={[0, -0.1, 0]}>
      <cylinderGeometry args={[0.01, 0.01, 0.3, 8]} />
      <GlassMaterial />
    </mesh>
    <mesh position={[0, -0.26, 0]}>
      <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
      <GlassMaterial />
    </mesh>
    <mesh position={[0, 0.25, 0]}>
      <cylinderGeometry args={[0.11, 0.07, 0.25, 16]} />
      <meshStandardMaterial color={0xFFD700} transparent opacity={0.8} />
    </mesh>
  </group>
);

const BalloonArch = () => {
  const archColors = [PALETTE.NEON_MAGENTA, PALETTE.NEON_CYAN, PALETTE.NEON_YELLOW, PALETTE.YOUR_BIRTHDAY, PALETTE.MYLAR_GOLD];
  const points = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4, 0, 0),
      new THREE.Vector3(-3, 3, 0),
      new THREE.Vector3(0, 4.5, 0),
      new THREE.Vector3(3, 3, 0),
      new THREE.Vector3(4, 0, 0)
    ]);
    return curve.getPoints(30);
  }, []);

  return (
    <group>
      {points.map((p, i) => {
        const c = archColors[i % archColors.length];
        return <Balloon key={i} position={[p.x, p.y, p.z]} color={c} />;
      })}
    </group>
  );
};

const Bunting = ({ p1, p2 }: { p1: Vec3, p2: Vec3 }) => {
  const colors = [PALETTE.NEON_MAGENTA, PALETTE.NEON_CYAN, PALETTE.NEON_YELLOW, PALETTE.MYLAR_GOLD, 0x00FF00];
  const points = useMemo(() => {
    const pts = [];
    const segments = 10;
    for(let i=0; i<=segments; i++) {
      const t = i/segments;
      const x = THREE.MathUtils.lerp(p1[0], p2[0], t);
      const y = THREE.MathUtils.lerp(p1[1], p2[1], t) - Math.sin(t * Math.PI) * 1.0;
      const z = THREE.MathUtils.lerp(p1[2], p2[2], t);
      pts.push(new THREE.Vector3(x, y, z));
    }
    return pts;
  }, [p1, p2]);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 20, 0.02, 8, false]} />
        <meshStandardMaterial color={0xffffff} />
      </mesh>
      {points.slice(0, -1).map((p, i) => (
        <mesh key={i} position={[p.x, p.y - 0.2, p.z]} rotation={[Math.PI, 0, Math.random() * 0.2 - 0.1]}>
          <coneGeometry args={[0.2, 0.4, 4]} />
          <meshStandardMaterial color={colors[i % colors.length]} emissive={colors[i % colors.length]} emissiveIntensity={0.5} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
};

const Cake = ({ position }: { position: Vec3 }) => {
  const flamesRef = useRef<THREE.MeshStandardMaterial[]>([]);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    flamesRef.current.forEach((mat, i) => {
      if (mat) {
        const offset = i * 0.9;
        mat.emissiveIntensity = 1.5 + Math.sin(t * 9 + offset) * 0.2 + Math.sin(t * 14 + offset * 1.3) * 0.15 + Math.sin(t * 21 + offset * 0.7) * 0.05;
      }
    });
  });

  return (
    <group position={position} scale={1.2}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[1.4, 1.4, 0.6, 64]} />
        <IvoryMaterial />
      </mesh>
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[1, 1, 0.5, 64]} />
        <meshStandardMaterial color={PALETTE.YOUR_BIRTHDAY} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.7, 0.7, 0.4, 64]} />
        <IvoryMaterial />
      </mesh>
      <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.4, 0.08, 12, 64]} />
        <IvoryMaterial />
      </mesh>
      <mesh position={[0, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.0, 0.06, 12, 64]} />
        <IvoryMaterial />
      </mesh>
      <mesh position={[0, 1.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.7, 0.05, 12, 64]} />
        <IvoryMaterial />
      </mesh>
      <mesh position={[0, 0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.03, 16, 96]} />
        <meshStandardMaterial color={PALETTE.BRASS_POLISHED} metalness={1.0} roughness={0.05} />
      </mesh>
      {[-0.3, 0, 0.3].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 1.65, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.3, 16]} />
            <meshStandardMaterial color={i === 1 ? PALETTE.LUT : PALETTE.LA_LOUNGE} roughness={0.3} />
          </mesh>
          <mesh position={[x, 1.9, 0]}>
            <coneGeometry args={[0.06, 0.15, 12]} />
            <meshStandardMaterial 
              ref={el => { if (el) flamesRef.current[i] = el; }} 
              color={PALETTE.YOUR_BIRTHDAY} 
              emissive={PALETTE.YOUR_BIRTHDAY} 
              emissiveIntensity={2.0} 
            />
          </mesh>
          <pointLight position={[x, 1.9, 0]} intensity={1.0} distance={4} decay={2} color={0xFFD580} />
        </group>
      ))}
    </group>
  );
};

const Gift = ({ position, color }: { position: Vec3, color: number }) => (
  <group position={position}>
    <mesh position={[0, 0.4, 0]} castShadow>
      <boxGeometry args={[1, 0.8, 1]} />
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
    </mesh>
    <mesh position={[0, 0.85, 0]} castShadow>
      <boxGeometry args={[1.1, 0.15, 1.1]} />
      <IvoryMaterial />
    </mesh>
    <mesh position={[0, 0.4, 0]}>
      <boxGeometry args={[0.15, 0.8, 1.01]} />
      <BrassMaterial />
    </mesh>
    <mesh position={[0, 0.4, 0]}>
      <boxGeometry args={[1.01, 0.8, 0.15]} />
      <BrassMaterial />
    </mesh>
    <mesh position={[0, 1.0, 0]}>
      <torusGeometry args={[0.22, 0.07, 16, 32]} />
      <BrassMaterial />
    </mesh>
  </group>
);

const BirthdayParty = ({ z, scale }: { z: number, scale: number }) => {
  const confetti = useMemo(() => {
    const pCount = 150;
    const posArr = new Float32Array(pCount * 3);
    const colArr = new Float32Array(pCount * 3);
    const palette = [new THREE.Color(PALETTE.YOUR_BIRTHDAY), new THREE.Color(PALETTE.LA_LOUNGE), new THREE.Color(PALETTE.BRASS_POLISHED), new THREE.Color(PALETTE.MYLAR_PINK), new THREE.Color(PALETTE.NEON_CYAN), new THREE.Color(PALETTE.NEON_MAGENTA), new THREE.Color(PALETTE.NEON_YELLOW)];
    for (let i = 0; i < pCount; i++) {
      posArr[i*3] = (Math.random() - 0.5) * 24; posArr[i*3+1] = Math.random() * 6; posArr[i*3+2] = (Math.random() - 0.5) * 6;
      const c = palette[Math.floor(Math.random() * palette.length)]; colArr[i*3] = c.r; colArr[i*3+1] = c.g; colArr[i*3+2] = c.b;
    }
    return { posArr, colArr };
  }, []);

  return (
    <group position={[0, 0, z]} scale={scale}>
      <LEDDanceFloor position={[0, 0, 2]} />
      <Balloon position={[-5, 0.5, 0]} color={PALETTE.NEON_MAGENTA} />
      <Balloon position={[-3, 1, 1]} color={PALETTE.NEON_CYAN} />
      <Balloon position={[-1, 0.8, -1]} color={PALETTE.NEON_YELLOW} />
      <Balloon position={[1, 1.2, 0]} color={PALETTE.YOUR_BIRTHDAY} />
      <Balloon position={[3, 0.6, 1]} color={PALETTE.NEON_CYAN} />
      <Balloon position={[5, 1, -1]} color={PALETTE.NEON_MAGENTA} />
      <BalloonArch />
      <NeonHeart position={[0, 1.5, -1.5]} />
      <DJBooth position={[0, 0, -1]} />
      <PartySpeaker position={[-6.5, 0, -1]} ringColor={PALETTE.NEON_MAGENTA} />
      <PartySpeaker position={[6.5, 0, -1]} ringColor={PALETTE.NEON_CYAN} />
      <PartySpeaker position={[0, 0, -5]} ringColor={PALETTE.NEON_YELLOW} />
      <MicStand position={[3, 0, 2.5]} />
      <Cake position={[0, 0.1, 2]} />
      <group position={[-4, 0, 3.5]}>
        <Gift position={[0,0,0]} color={PALETTE.NEON_CYAN} />
        <PartyHat position={[0, 0.95, 0]} color={PALETTE.NEON_MAGENTA} />
      </group>
      <group position={[4, 0, 3.5]}>
        <Gift position={[0,0,0]} color={PALETTE.NEON_MAGENTA} />
        <PartyHat position={[0, 0.95, 0]} color={PALETTE.NEON_CYAN} />
      </group>
      <group position={[0, 0, 4.5]}>
        <Gift position={[0,0,0]} color={PALETTE.NEON_YELLOW} />
        <PartyHat position={[0, 0.95, 0]} color={PALETTE.YOUR_BIRTHDAY} />
      </group>
      <LightingStand position={[-5, 0, 5]} lightColor={PALETTE.NEON_CYAN} />
      <LightingStand position={[5, 0, 5]} lightColor={PALETTE.NEON_MAGENTA} />
      <LightingStand position={[0, 0, 6.5]} lightColor={PALETTE.NEON_YELLOW} />
      <Bunting p1={[-5, 6, 5]} p2={[5, 6, 5]} />
      <Bunting p1={[-5, 6, 5]} p2={[0, 6, 6.5]} />
      <Bunting p1={[5, 6, 5]} p2={[0, 6, 6.5]} />
      <group position={[0, 0, 7.5]} scale={0.7}>
        <Table position={[0,0,0]} />
        <ChampagneFlute position={[-0.3, 1, 0]} />
        <ChampagneFlute position={[0.3, 1, 0]} />
      </group>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[confetti.posArr, 3]} />
          <bufferAttribute attach="attributes-color" args={[confetti.colArr, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.3} sizeAttenuation transparent opacity={0.8} depthWrite={false} vertexColors blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
};

// ═════════════════════════════════════════════════════════════════
// CENTER BLUEPRINT SCENE
// ═════════════════════════════════════════════════════════════════
const CenterBlueprints = ({ position }: { position: Vec3 }) => {
  const groupRef = useRef<THREE.Group>(null);
  const holoMatRef = useRef<THREE.ShaderMaterial>(null);
  const screenMatRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (holoMatRef.current) holoMatRef.current.uniforms.uTime.value = t;
    if (screenMatRef.current) screenMatRef.current.uniforms.uTime.value = t;
    if (groupRef.current) groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.3 + t * 0.05;
  });

  const bpMatBold = useMemo(() => new THREE.LineBasicMaterial({ color: PALETTE.LA_LOUNGE, transparent: true, opacity: 0.9 }), []);
  const bpMatMain = useMemo(() => new THREE.LineBasicMaterial({ color: PALETTE.RING_COLOR, transparent: true, opacity: 0.7 }), []);
  const bpMatSub = useMemo(() => new THREE.LineBasicMaterial({ color: PALETTE.GRID_ACCENT, transparent: true, opacity: 0.5 }), []);

  return (
    <group ref={groupRef} position={position}>
      {/* Ceiling Truss */}
      <lineSegments geometry={new THREE.EdgesGeometry(new THREE.TorusGeometry(6, 0.1, 4, 64))} material={bpMatBold} position={[0, 7, 0]} rotation={[Math.PI / 2, 0, 0]} />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const pts = [new THREE.Vector3(0, 7, 0), new THREE.Vector3(Math.cos(angle) * 6, 7, Math.sin(angle) * 6)];
        return <lineSegments key={i} geometry={new THREE.BufferGeometry().setFromPoints(pts)} material={bpMatSub} />;
      })}

      {/* Bistro Lights */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <lineSegments key={i} geometry={new THREE.EdgesGeometry(new THREE.SphereGeometry(0.1, 4, 4))} material={bpMatSub} position={[Math.cos(angle) * 5.5, 6.5, Math.sin(angle) * 5.5]} />
        );
      })}

      {/* Disco Ball */}
      <lineSegments geometry={new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.8, 1))} material={bpMatBold} position={[0, 5.5, 0]} />
      <mesh position={[0, 5.5, 0]}>
        <icosahedronGeometry args={[0.8, 1]} />
        <shaderMaterial 
          ref={holoMatRef}
          uniforms={{ uTime: { value: 0 }, uColor: { value: new THREE.Color(PALETTE.GRID_PULSE) } }}
          vertexShader={holoVertexShader}
          fragmentShader={holoFragmentShader}
          transparent blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide}
        />
      </mesh>

      {/* Par Cans */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <group key={i} position={[Math.cos(angle) * 5.5, 6.8, Math.sin(angle) * 5.5]} rotation={[Math.PI / 2, 0, 0]}>
            <lineSegments geometry={new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.15, 0.15, 0.3, 8))} material={bpMatMain} />
          </group>
        );
      })}

      {/* Holo Screens */}
      {Array.from({ length: 3 }).map((_, i) => {
        const angle = (i / 3) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 2, 1.8, Math.sin(angle) * 2]} rotation={[0, -angle + Math.PI/2, 0]}>
            <planeGeometry args={[1.5, 1]} />
            <shaderMaterial 
              ref={screenMatRef}
              uniforms={{ uTime: { value: 0 } }}
              vertexShader={`varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`}
              fragmentShader={screenFragmentShader}
              transparent side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}

      {/* Pillars */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <lineSegments key={i} geometry={new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.15, 0.15, 7, 8))} material={bpMatMain} position={[Math.cos(angle) * 6, 3.5, Math.sin(angle) * 6]} />
        );
      })}

      {/* Dance Floors */}
      <lineSegments geometry={new THREE.EdgesGeometry(new THREE.CylinderGeometry(3.5, 3.5, 0.1, 64))} material={bpMatMain} position={[0, 0.05, 0]} />
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[3.5, 3.5, 0.1, 64]} />
        <shaderMaterial 
          uniforms={{ uTime: { value: 0 }, uColor: { value: new THREE.Color(PALETTE.GRID_PULSE) } }}
          vertexShader={holoVertexShader}
          fragmentShader={holoFragmentShader}
          transparent blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide}
        />
      </mesh>
      <lineSegments geometry={new THREE.EdgesGeometry(new THREE.CylinderGeometry(2.5, 2.5, 0.1, 64))} material={bpMatBold} position={[0, 0.15, 0]} />
      <lineSegments geometry={new THREE.EdgesGeometry(new THREE.CylinderGeometry(1.5, 1.5, 0.1, 64))} material={bpMatSub} position={[0, 0.25, 0]} />

      {/* Banquet Table */}
      <lineSegments geometry={new THREE.EdgesGeometry(new THREE.TorusGeometry(4.5, 0.1, 2, 64))} material={bpMatBold} position={[0, 1, 0]} rotation={[Math.PI / 2, 0, 0]} />

      {/* Table Details */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const px = Math.cos(angle) * 4.5;
        const pz = Math.sin(angle) * 4.5;
        return (
          <group key={i} position={[px, 0, pz]}>
            <lineSegments geometry={new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.4, 0.4, 0.02, 16))} material={bpMatSub} position={[0, 1.11, 0]} />
            <lineSegments geometry={new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.15, 0.15, 0.02, 8))} material={bpMatMain} position={[0, 1.12, 0]} />
            <lineSegments geometry={new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.02, 0.02, 0.15, 4))} material={bpMatMain} position={[0, 1.21, 0]} />
            <lineSegments geometry={new THREE.EdgesGeometry(new THREE.SphereGeometry(0.1, 8, 8, 0, Math.PI*2, 0, Math.PI/2))} material={bpMatMain} position={[0, 1.3, 0]} />
          </group>
        );
      })}

      {/* Centerpiece */}
      <lineSegments geometry={new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.8, 1.0, 0.2, 16))} material={bpMatBold} position={[0, 1.1, 0]} />
      <lineSegments geometry={new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.6, 0.8, 0.4, 16))} material={bpMatMain} position={[0, 1.4, 0]} />
      <lineSegments geometry={new THREE.EdgesGeometry(new THREE.ConeGeometry(0.5, 0.6, 8))} material={bpMatSub} position={[0, 1.9, 0]} />

      {/* Chairs */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const px = Math.cos(angle) * 5.2;
        const pz = Math.sin(angle) * 5.2;
        return (
          <group key={i} position={[px, 0, pz]} rotation={[0, -angle - Math.PI/2, 0]}>
            <lineSegments geometry={new THREE.EdgesGeometry(new THREE.BoxGeometry(0.6, 0.08, 0.6))} material={bpMatMain} position={[0, 0.5, 0]} />
            <lineSegments geometry={new THREE.EdgesGeometry(new THREE.BoxGeometry(0.6, 0.6, 0.08))} material={bpMatMain} position={[0, 0.8, -0.3]} />
          </group>
        );
      })}

      {/* DJ Booth */}
      <lineSegments geometry={new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.8, 1, 1.2, 32))} material={bpMatBold} position={[0, 0.6, 0]} />
      <lineSegments geometry={new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.6, 0.8, 0.4, 32))} material={bpMatMain} position={[0, 1.4, 0]} />
      <lineSegments geometry={new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.5, 0.6, 0.1, 32))} material={bpMatSub} position={[0, 1.65, 0]} />
      <lineSegments geometry={new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.15, 0.15, 0.02, 16))} material={bpMatBold} position={[-0.2, 1.71, 0]} />
      <lineSegments geometry={new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.15, 0.15, 0.02, 16))} material={bpMatBold} position={[0.2, 1.71, 0]} />
      <lineSegments geometry={new THREE.EdgesGeometry(new THREE.BoxGeometry(0.3, 0.02, 0.2))} material={bpMatMain} position={[0, 1.71, 0.2]} />

      {/* Buffet Station */}
      <lineSegments geometry={new THREE.EdgesGeometry(new THREE.BoxGeometry(3, 0.1, 1))} material={bpMatBold} position={[-4, 1, 4]} />
      {([[-1.4, -0.4], [1.4, -0.4], [-1.4, 0.4], [1.4, 0.4]] as [number, number][]).map(([x,z], i) => (
        <lineSegments key={i} geometry={new THREE.EdgesGeometry(new THREE.BoxGeometry(0.1, 1, 0.1))} material={bpMatSub} position={[-4+x, 0.5, 4+z]} />
      ))}
      {Array.from({ length: 3 }).map((_, i) => (
        <group key={i} position={[-4.5 + i*0.5, 0, 4]}>
          <lineSegments geometry={new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.2, 0.2, 0.05, 8))} material={bpMatMain} position={[0, 1.08, 0]} />
          <lineSegments geometry={new THREE.EdgesGeometry(new THREE.SphereGeometry(0.25, 8, 8, 0, Math.PI*2, 0, Math.PI/2))} material={bpMatBold} position={[0, 1.13, 0]} />
        </group>
      ))}

      {/* Gift Table */}
      <lineSegments geometry={new THREE.EdgesGeometry(new THREE.BoxGeometry(1.5, 0.1, 1))} material={bpMatBold} position={[4, 1, 4]} />
      {([[-0.7, -0.4], [0.7, -0.4], [-0.7, 0.4], [0.7, 0.4]] as [number, number][]).map(([x,z], i) => (
        <lineSegments key={i} geometry={new THREE.EdgesGeometry(new THREE.BoxGeometry(0.1, 1, 0.1))} material={bpMatSub} position={[4+x, 0.5, 4+z]} />
      ))}
      <lineSegments geometry={new THREE.EdgesGeometry(new THREE.BoxGeometry(0.5, 0.4, 0.5))} material={bpMatMain} position={[3.8, 1.3, 4]} />
      <lineSegments geometry={new THREE.EdgesGeometry(new THREE.BoxGeometry(0.3, 0.3, 0.3))} material={bpMatSub} position={[4.3, 1.25, 4.1]} />
    </group>
  );
};

// ═════════════════════════════════════════════════════════════════
// ENVIRONMENT & BACKGROUND
// ═════════════════════════════════════════════════════════════════
const BackgroundEnv = () => {
  const gridMatRef = useRef<THREE.ShaderMaterial>(null);
  const spineMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const motesRef = useRef<THREE.Points>(null);

  const moteData = useMemo(() => {
    const moteCount = 200;
    const motesPos = new Float32Array(moteCount * 3);
    const motesBase = new Float32Array(moteCount * 3);
    const motesSpeed = new Float32Array(moteCount);
    for(let i=0; i<moteCount; i++) {
      motesPos[i*3] = (Math.random()-0.5)*80; motesPos[i*3+1] = (Math.random()-0.5)*50; motesPos[i*3+2] = (Math.random()-0.5)*40;
      motesBase[i*3] = motesPos[i*3]; motesBase[i*3+1] = motesPos[i*3+1]; motesBase[i*3+2] = motesPos[i*3+2];
      motesSpeed[i] = 0.5 + Math.random() * 1.5;
    }
    return { motesPos, motesBase, motesSpeed, moteCount };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (gridMatRef.current) gridMatRef.current.uniforms.uTime.value = t;
    if (spineMatRef.current) spineMatRef.current.opacity = 0.4 + Math.sin(t * 0.5) * 0.1;
    if (ringsRef.current) ringsRef.current.rotation.z = t * 0.08;
    if (motesRef.current) {
      motesRef.current.rotation.y = t * 0.008;
      const posAttr = motesRef.current.geometry.attributes.position as THREE.BufferAttribute;
      for(let i=0; i<moteData.moteCount; i++) {
        posAttr.array[i*3+1] = moteData.motesBase[i*3+1] + Math.sin(t * moteData.motesSpeed[i] * 0.2 + i) * 0.5;
      }
      posAttr.needsUpdate = true;
    }
  });

  const matBold = useMemo(() => new THREE.LineBasicMaterial({ color: PALETTE.LA_LOUNGE, transparent: true, opacity: 0.6 }), []);
  const matMain = useMemo(() => new THREE.LineBasicMaterial({ color: PALETTE.RING_COLOR, transparent: true, opacity: 0.5 }), []);
  const matSub = useMemo(() => new THREE.LineBasicMaterial({ color: PALETTE.GRID_ACCENT, transparent: true, opacity: 0.4 }), []);

  return (
    <>
      <color attach="background" args={[PALETTE.DEEP_PLUM]} />
      
      {/* Lights */}
      <ambientLight color={PALETTE.AMBIENT_BASE} intensity={0.4} />
      <hemisphereLight color={PALETTE.AMBIENT_BASE} groundColor={PALETTE.DEEP_PLUM} intensity={0.6} />
      <directionalLight color={PALETTE.WARM_KEY} intensity={1.5} position={[10, 40, 10]} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-near={1} shadow-camera-far={150} shadow-camera-left={-50} shadow-camera-right={50} shadow-camera-top={50} shadow-camera-bottom={-50} shadow-bias={-0.0005} />
      <directionalLight color={PALETTE.COOL_FILL} intensity={0.8} position={[-20, 25, -15]} />
      <directionalLight color={PALETTE.CRYSTAL_RIM} intensity={0.6} position={[0, 15, -30]} />
      <spotLight color={PALETTE.BRASS_POLISHED} intensity={60} distance={50} angle={0.7} penumbra={0.8} decay={2} position={[0, 16, -14]} />
      <spotLight color={PALETTE.YOUR_BIRTHDAY} intensity={50} distance={40} angle={0.7} penumbra={0.8} decay={2} position={[0, 16, 14]} />
      <pointLight color={PALETTE.BRASS_POLISHED} intensity={15} distance={30} decay={2} position={[0, 6, -14]} />
      <pointLight color={PALETTE.YOUR_BIRTHDAY} intensity={10} distance={25} decay={2} position={[0, 6, 14]} />

      {/* Architecture */}
      <group>
        {[
          { w: 14, h: 0.3, d: 7, x: 0, y: 0.15, z: -18 },
          { w: 10, h: 0.3, d: 5, x: -18, y: 0.15, z: 12 },
          { w: 8, h: 0.3, d: 4, x: 18, y: 0.15, z: 8 }
        ].map((p, i) => (
          <lineSegments key={i} geometry={new THREE.EdgesGeometry(new THREE.BoxGeometry(p.w, p.h, p.d))} material={matMain} position={[p.x, p.y, p.z]} />
        ))}
        {([[-22,-18], [22,-18], [-22,18], [22,18], [-12,-8], [12,-8], [-12,8], [12,8]] as [number, number][]).map(([x,z], i) => {
          const h = 6 + (Math.sin(i * 12.9898) * 43758.5453 % 1) * 4;
          return <lineSegments key={i} geometry={new THREE.EdgesGeometry(new THREE.BoxGeometry(0.4, h, 0.4))} material={i < 4 ? matBold : matSub} position={[x, h/2, z]} />;
        })}
        {[
          { w: 44, h: 0.25, d: 0.25, x: 0, y: 7, z: -18 },
          { w: 44, h: 0.25, d: 0.25, x: 0, y: 9, z: 18 },
          { w: 0.25, h: 0.25, d: 36, x: -22, y: 5, z: 0 },
          { w: 0.25, h: 0.25, d: 36, x: 22, y: 5, z: 0 }
        ].map((t, i) => (
          <lineSegments key={i} geometry={new THREE.EdgesGeometry(new THREE.BoxGeometry(t.w, t.h, t.d))} material={matBold} position={[t.x, t.y, t.z]} />
        ))}
        {([[-10,-6], [10,-6], [0,16], [-16,0], [16,0]] as [number, number][]).map(([x,z], i) => (
          <lineSegments key={i} geometry={new THREE.EdgesGeometry(new THREE.CylinderGeometry(1.2, 1.2, 0.25, 24))} material={matSub} position={[x, 0.125, z]} />
        ))}
      </group>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 70, 12]} />
        <meshBasicMaterial ref={spineMatRef} color={PALETTE.BRASS_POLISHED} transparent opacity={0.5} />
      </mesh>

      <group ref={ringsRef}>
        {Array.from({ length: 8 }).map((_, i) => {
          const radius = 6 + i * 5;
          return (
            <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[radius, radius + 0.08, 128]} />
              <meshBasicMaterial color={PALETTE.RING_COLOR} transparent opacity={0.2} side={THREE.DoubleSide} />
            </mesh>
          );
        })}
      </group>

      <points ref={motesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[moteData.motesPos, 3]} />
        </bufferGeometry>
        <pointsMaterial color={PALETTE.BRASS_POLISHED} size={0.1} sizeAttenuation transparent opacity={0.4} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>

      {/* Glossy Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color={0x0a0506} roughness={0.15} metalness={0.5} />
      </mesh>

      {/* Shader Grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
        <planeGeometry args={[300, 300]} />
        <shaderMaterial 
          ref={gridMatRef}
          uniforms={{
            uTime: { value: 0 },
            uColorMain: { value: new THREE.Color(PALETTE.GRID_MAIN) },
            uColorAccent: { value: new THREE.Color(PALETTE.GRID_ACCENT) },
            uColorLight: { value: new THREE.Color(PALETTE.GRID_LIGHT) },
            uColorPulse: { value: new THREE.Color(PALETTE.GRID_PULSE) },
            uFadeStart: { value: 30.0 },
            uFadeEnd: { value: 100.0 }
          }}
          vertexShader={gridVertexShader}
          fragmentShader={gridFragmentShader}
          transparent depthWrite={false} side={THREE.DoubleSide}
        />
      </mesh>

      {/* Shadow Catcher */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <shadowMaterial opacity={0.4} />
      </mesh>
    </>
  );
};

// ═════════════════════════════════════════════════════════════════
// CAMERA RIG
// ═════════════════════════════════════════════════════════════════
const CameraRig = () => {
  const { pointer } = useThree();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const camDist = isMobile ? 32 : 52;
  const pitch = Math.PI / 3;
  const height = camDist * Math.sin(pitch);
  const depth = camDist * Math.cos(pitch);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const noiseX = Math.sin(t * 0.1) * 1.5;
    const noiseY = Math.cos(t * 0.15) * 0.5;
    const pX = pointer.x * (isMobile ? 2 : 4) + noiseX;
    const pY = pointer.y * (isMobile ? 1 : 2) + noiseY;

    state.camera.position.x = pX;
    state.camera.position.y = height + pY * 0.3;
    state.camera.position.z = depth + pY * 0.5;
    state.camera.lookAt(pX * 0.3, pY * 0.1, 0);
  });

  return null;
};

// ═════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═════════════════════════════════════════════════════════════════
export default function Hero3DBackground() {
  const [enabled, setEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setEnabled(shouldEnable3D());
    setIsMobile(window.innerWidth < 768);
  }, []);

  if (!enabled) return null;

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 0, overflow: 'hidden', background: '#0d0609' }}>
      <Canvas
        shadows
        dpr={[1, isMobile ? 1.5 : 2]}
        camera={{ position: [0, 45, 26], fov: isMobile ? 48 : 38, near: 0.1, far: 500 }}
        gl={{ antialias: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      >
        <BackgroundEnv />
        <LutFurniture z={-14} scale={isMobile ? 0.6 : 1.0} />
        <CenterBlueprints position={[0, 0.05, 0]} />
        <BirthdayParty z={14} scale={isMobile ? 0.6 : 1.0} />
        <CameraRig />
      </Canvas>
      <div style={{
        position: 'fixed',
        top: 0, left: 0, width: '100%', height: '100%',
        zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(circle at center, transparent 45%, rgba(13, 6, 9, 0.8) 100%)'
      }} />
    </div>
  );
}
