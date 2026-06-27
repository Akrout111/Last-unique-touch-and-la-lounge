'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Stage, Environment } from '@react-three/drei'
import { Suspense } from 'react'
import type { ThreeElements } from '@react-three/fiber'

function Model({ modelUrl }: { modelUrl: string }) {
  const { scene } = useGLTF(modelUrl)
  return <primitive object={scene} scale={1} {...({} as ThreeElements)} />
}

export function ModelCanvas({ modelUrl }: { modelUrl: string }) {
  return (
    <Canvas shadows camera={{ position: [4, 2, 5], fov: 45 }}>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.2}
        castShadow
      />
      <Suspense fallback={null}>
        <Stage environment="city" intensity={0.6}>
          <Model modelUrl={modelUrl} />
        </Stage>
      </Suspense>
      <OrbitControls
        enablePan={false}
        minDistance={2}
        maxDistance={10}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.8}
      />
      <Environment preset="city" />
    </Canvas>
  )
}

// Preload the sample model
useGLTF.preload('https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb')
