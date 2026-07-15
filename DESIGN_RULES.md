# Last Unique Touch — Design Rules (Do Not Violate)

> These rules are extracted from the Tri-AI v3.0 Design Review. Any violation = confirmed bug.

## 1-15. (See previous rules — i18n, colors, design language, RTL, navigation, images, cursors, a11y, RHF+Radix, skeletons, dead code, typography, three.js, dead ternaries, release testing)

## 16. 3D Content — Additional Rules

- ✅ Use `useGLTF` from drei (auto-enables MeshoptDecoder)
- ✅ Compress GLB files with `gltf-transform` + `EXT_meshopt_compression`
- ✅ `dpr={[1, 1.5]}` on mobile (never `dpr={2}` or higher)
- ✅ `frameloop="always"` with IntersectionObserver to pause canvas outside viewport
- ✅ `pointer-events-none` on any canvas overlay
- ✅ `THREE.MathUtils.damp` for framerate-independent smoothing (not `lerp`)
- ✅ `useScrollStore.getState()` in `useFrame` (not the hook — prevents re-renders)
- ✅ `scene.clone(true)` before modifying materials (never modify cached scene)
- ✅ WebGL context loss handler for iOS Safari
- ✅ `prefers-reduced-motion` + `prefers-reduced-data` fallbacks
- ✅ Device capability detection (`hardwareConcurrency`, `deviceMemory`)
- ✅ `useGLTF.clear(url)` on unmount (prevents memory leaks)
- ✅ `useGLTF.preload(url)` for hero models (starts download immediately)
- ❌ Do NOT use `<ScrollControls>` from Drei with `pointer-events-none`
- ❌ Do NOT use `setState` in `useFrame` — use refs or Zustand getState
- ❌ Do NOT use Environment preset on mobile (HDRI is heavy — use ambientLight)
- ❌ Do NOT use `<img>` to load GLB — always use `useGLTF` or `useLoader(GLTFLoader)`
