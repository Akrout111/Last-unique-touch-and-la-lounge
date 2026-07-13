'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { shouldEnable3D } from '@/lib/device-capabilities'
import { BRAND_COLORS } from '@/lib/brand-colors'

/**
 * Birthday3DBackground — full club-style 3D scene for the Your Birthday page.
 *
 * Built with vanilla Three.js (not R3F) for precise control over the complex
 * scene (Reflector + post-processing + PMREM are simpler to wire up directly).
 *
 * Scene elements (adapted from a user-provided HTML reference):
 *  - Reflective floor + grid
 *  - LED screen with HSL color cycling
 *  - DJ booth with LED strips + small screens
 *  - Low-lying fog (canvas-textured Points)
 *  - Floor lamps (moving-head SpotLights that sweep)
 *  - Speaker towers with pulsing cones + LED rings + strips
 *  - Gift boxes with ribbons and bows
 *  - Equalizer bars (20 mobile / 50 desktop)
 *  - Spinning vinyl records (2 mobile / 5 desktop)
 *  - Volumetric laser beams (2 mobile / 4 desktop) with additive blending
 *  - Balloon arch (24 balloons in a semi-circle, breathing animation)
 *  - Floating particles (300 mobile / 1000 desktop, vertex-colored)
 *  - Post-processing: EffectComposer → RenderPass → UnrealBloomPass → OutputPass → FXAA
 *  - PMREMGenerator + RoomEnvironment for PBR
 *  - Mouse parallax (desktop only)
 *
 * Performance gates:
 *  - shouldEnable3D() guard
 *  - IntersectionObserver pauses rAF when the canvas scrolls off-screen
 *  - Mobile: capped pixel ratio (1.5), reduced counts, no mousemove listener
 *  - All geometries / materials / textures / render targets are tracked and
 *    disposed on unmount; PMREMGenerator + renderer.dispose() are also called.
 */

/** Minimal structural type for the post-processing composer we use. */
type Composer = {
  render: () => void
  setSize: (w: number, h: number) => void
  addPass: (...args: never[]) => void
  dispose: () => void
}

/** Anything we want to dispose on unmount: geometries/materials/textures/render
 *  targets have dispose(); meshes/groups/lights don't (handled via narrowing). */
type Disposable =
  | THREE.BufferGeometry
  | THREE.Material
  | THREE.Texture
  | THREE.WebGLRenderTarget
  | THREE.Object3D

export default function Birthday3DBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const composerRef = useRef<Composer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const animationIdRef = useRef<number>(0)
  const disposablesRef = useRef<Disposable[]>([])

  // Enable 3D only on capable devices.
  useEffect(() => {
    setEnabled(shouldEnable3D())
  }, [])

  // Main 3D setup — runs ONCE when enabled. An IntersectionObserver inside
  // this effect pauses/resumes the rAF loop without tearing down the scene.
  useEffect(() => {
    if (!enabled || !containerRef.current) return

    const container = containerRef.current
    const isMobile = window.innerWidth < 768
    const width = container.clientWidth
    const height = container.clientHeight
    const pixelRatioCap = isMobile ? 1.5 : 2
    const devicePixelRatio = Math.min(window.devicePixelRatio, 2)

    // === BRAND COLORS ===
    const GOLD = BRAND_COLORS.YOUR_BIRTHDAY // #F5B914 — primary neon
    const PINK = BRAND_COLORS.LA_LOUNGE // #E6007E — secondary neon
    const PURPLE = '#9D4EDD' // tertiary
    const CYAN = '#00F3FF' // accent
    const BG = '#0a0814' // dark purple
    const FLOOR_COLOR = 0x05050a

    // === SCENE ===
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(BG)
    scene.fog = new THREE.FogExp2(BG, 0.007)
    sceneRef.current = scene

    // === CAMERA ===
    // On mobile, a wider FOV + pulled-back camera position lets the full scene
    // (floor, speakers, balloon arch, LED screen) be visible on a narrow portrait
    // viewport instead of just the cropped center.
    const camera = new THREE.PerspectiveCamera(
      isMobile ? 65 : 55,
      width / height,
      0.1,
      1000,
    )
    camera.position.set(0, isMobile ? 10 : 7, isMobile ? 45 : 35)

    // === RENDERER ===
    const renderer = new THREE.WebGLRenderer({
      antialias: false, // FXAA handles AA in post
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false,
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatioCap))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    // Slightly lower exposure so the scene's lit details aren't washed out by
    // the bloom + IBL stack.
    renderer.toneMappingExposure = 0.9
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // === PMREM + ROOM ENVIRONMENT (PBR IBL) ===
    const pmrem = new THREE.PMREMGenerator(renderer)
    const roomEnv = new RoomEnvironment()
    const pmremRT = pmrem.fromScene(roomEnv, 0.04)
    scene.environment = pmremRT.texture
    disposablesRef.current.push(pmremRT, pmremRT.texture, roomEnv)

    // === POST-PROCESSING ===
    // RenderPass → UnrealBloomPass → OutputPass (tone map + sRGB) → FXAA
    // OutputPass is added on top of the spec's pass list so colors render
    // correctly (EffectComposer bypasses the renderer's tone mapping).
    let composer: Composer | null = null
    let fxaaPass: ShaderPass | null = null
    try {
      composer = new EffectComposer(renderer) as unknown as Composer
      const renderPass = new RenderPass(scene, camera)
      composer.addPass(renderPass as unknown as never)

      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(width, height),
        0.35, // strength (reduced from 0.5 so bloom doesn't wash out details)
        0.8, // radius
        0.95, // threshold
      )
      composer.addPass(bloomPass as unknown as never)

      const outputPass = new OutputPass()
      composer.addPass(outputPass as unknown as never)

      fxaaPass = new ShaderPass(FXAAShader)
      fxaaPass.material.uniforms['resolution'].value.set(
        1 / (width * devicePixelRatio),
        1 / (height * devicePixelRatio),
      )
      composer.addPass(fxaaPass as unknown as never)

      composerRef.current = composer
    } catch (err) {
      console.warn('Failed to initialize post-processing, falling back to standard renderer:', err)
      composer = null
    }

    // === LIGHTS ===
    // Intensities reduced ~25–30% across the board so the background no longer
    // hides the scene's finer details (gift boxes, balloons, speaker cones, eq
    // bars) under a blanket of over-bright lighting + bloom.
    const ambient = new THREE.AmbientLight(0x4a3a6e, 0.35)
    scene.add(ambient)

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.9)
    keyLight.position.set(5, 20, 15)
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight(PURPLE, 1.1)
    rimLight.position.set(-15, 12, -10)
    scene.add(rimLight)

    const purplePL = new THREE.PointLight(PURPLE, 56, 60)
    purplePL.position.set(-15, 10, 5)
    scene.add(purplePL)
    const pinkPL = new THREE.PointLight(PINK, 56, 60)
    pinkPL.position.set(15, 8, 5)
    scene.add(pinkPL)
    const cyanPL = new THREE.PointLight(CYAN, 42, 60)
    cyanPL.position.set(0, 4, 18)
    scene.add(cyanPL)
    disposablesRef.current.push(ambient, keyLight, rimLight, purplePL, pinkPL, cyanPL)

    // === REFLECTIVE FLOOR ===
    const reflectorGeo = new THREE.PlaneGeometry(200, 200)
    const reflector = new Reflector(reflectorGeo, {
      clipBias: 0.003,
      textureWidth: Math.floor(width * devicePixelRatio * (isMobile ? 0.5 : 1)),
      textureHeight: Math.floor(height * devicePixelRatio * (isMobile ? 0.5 : 1)),
      color: FLOOR_COLOR,
    })
    reflector.rotation.x = -Math.PI / 2
    reflector.position.y = -12
    scene.add(reflector)
    disposablesRef.current.push(reflectorGeo, reflector)

    const grid = new THREE.GridHelper(200, 50, PURPLE, PINK)
    const gridMat = grid.material as THREE.Material
    gridMat.transparent = true
    gridMat.opacity = 0.1
    grid.position.y = -11.98
    scene.add(grid)
    disposablesRef.current.push(grid)

    // === LED SCREEN (HSL color cycle) ===
    const screenGeo = new THREE.PlaneGeometry(60, 25)
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: new THREE.Color(PURPLE),
      emissiveIntensity: 1.5,
      side: THREE.DoubleSide,
    })
    const ledScreen = new THREE.Mesh(screenGeo, screenMat)
    ledScreen.position.set(0, 5, -40)
    scene.add(ledScreen)
    disposablesRef.current.push(screenGeo, screenMat, ledScreen)

    // === DJ BOOTH ===
    const boothGroup = new THREE.Group()
    const boothGeo = new THREE.BoxGeometry(10, 3, 3)
    const boothMat = new THREE.MeshStandardMaterial({ color: 0x111118, metalness: 0.6, roughness: 0.4 })
    const booth = new THREE.Mesh(boothGeo, boothMat)
    boothGroup.add(booth)

    const djStripMat = new THREE.MeshStandardMaterial({
      color: GOLD,
      emissive: GOLD,
      emissiveIntensity: 1.5,
    })
    const djStrips: THREE.Mesh[] = []
    for (let i = 0; i < 5; i++) {
      const stripGeo = new THREE.BoxGeometry(8, 0.15, 0.1)
      const strip = new THREE.Mesh(stripGeo, djStripMat)
      strip.position.set(0, -1.2 + i * 0.6, 1.55)
      boothGroup.add(strip)
      djStrips.push(strip)
      disposablesRef.current.push(stripGeo, strip)
    }

    const djScreenMat = new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: CYAN,
      emissiveIntensity: 1.0,
    })
    const djScreenGeo = new THREE.PlaneGeometry(2, 1.2)
    const djScreenL = new THREE.Mesh(djScreenGeo, djScreenMat)
    djScreenL.position.set(-3, 2, 1.5)
    boothGroup.add(djScreenL)
    const djScreenR = new THREE.Mesh(djScreenGeo, djScreenMat)
    djScreenR.position.set(3, 2, 1.5)
    boothGroup.add(djScreenR)
    boothGroup.position.set(0, -10.5, -25)
    scene.add(boothGroup)
    disposablesRef.current.push(
      boothGeo, boothMat, booth,
      djStripMat,
      djScreenGeo, djScreenMat, djScreenL, djScreenR,
      boothGroup,
    )

    // === LOW-LYING FOG (canvas-textured Points) ===
    const fogTexture = createSoftCircleTexture()
    disposablesRef.current.push(fogTexture)
    const fogCount = 150
    const fogGeo = new THREE.BufferGeometry()
    const fogPos = new Float32Array(fogCount * 3)
    for (let i = 0; i < fogCount; i++) {
      fogPos[i * 3] = (Math.random() - 0.5) * 80
      fogPos[i * 3 + 1] = -12 + Math.random() * 3
      fogPos[i * 3 + 2] = (Math.random() - 0.5) * 60 - 10
    }
    fogGeo.setAttribute('position', new THREE.BufferAttribute(fogPos, 3))
    const fogMat = new THREE.PointsMaterial({
      map: fogTexture,
      size: 8,
      transparent: true,
      opacity: 0.05,
      depthWrite: false,
      blending: THREE.NormalBlending,
    })
    const fogParticles = new THREE.Points(fogGeo, fogMat)
    scene.add(fogParticles)
    disposablesRef.current.push(fogGeo, fogMat, fogParticles)

    // === FLOOR LAMPS (moving-head SpotLights) ===
    type Lamp = { spot: THREE.SpotLight; target: THREE.Object3D; base: THREE.Group }
    const lamps: Lamp[] = []
    const lampColors = [PURPLE, PINK, CYAN, '#F97316']
    const lampCount = isMobile ? 2 : 4
    for (let i = 0; i < lampCount; i++) {
      const group = new THREE.Group()
      const baseGeo = new THREE.CylinderGeometry(0.4, 0.6, 1.2, 16)
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x222228, metalness: 0.8, roughness: 0.3 })
      const baseMesh = new THREE.Mesh(baseGeo, baseMat)
      baseMesh.position.y = -11.4
      group.add(baseMesh)

      const headGeo = new THREE.BoxGeometry(0.8, 0.6, 0.8)
      const headMat = new THREE.MeshStandardMaterial({
        color: lampColors[i],
        emissive: lampColors[i],
        emissiveIntensity: 1.2,
      })
      const head = new THREE.Mesh(headGeo, headMat)
      head.position.y = -10.6
      group.add(head)

      const spot = new THREE.SpotLight(lampColors[i], 56, 60, 0.4, 0.5, 1.2)
      spot.position.set(0, -10.4, 0)
      const targetObj = new THREE.Object3D()
      targetObj.position.set(0, -12, 5)
      scene.add(targetObj)
      spot.target = targetObj
      group.add(spot)

      const angle = (i / lampCount) * Math.PI * 2
      group.position.set(Math.cos(angle) * 16, 0, Math.sin(angle) * 12 - 5)
      scene.add(group)
      lamps.push({ spot, target: targetObj, base: group })
      disposablesRef.current.push(
        baseGeo, baseMat, baseMesh,
        headGeo, headMat, head,
        spot, targetObj, group,
      )
    }

    // === SPEAKER TOWERS ===
    type Speaker = {
      group: THREE.Group
      cones: THREE.Mesh[]
      rings: THREE.Mesh[]
      strips: THREE.Mesh[]
    }
    const speakers: Speaker[] = []
    const speakerPositions = [
      { x: -22, z: -15 },
      { x: 22, z: -15 },
    ]
    for (const pos of speakerPositions) {
      const group = new THREE.Group()

      const cabGeo = new THREE.BoxGeometry(4, 12, 3.5)
      const cabMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0f, metalness: 0.9, roughness: 0.2 })
      const cabinet = new THREE.Mesh(cabGeo, cabMat)
      cabinet.position.y = -6
      group.add(cabinet)

      const spStripMat = new THREE.MeshStandardMaterial({
        color: GOLD,
        emissive: GOLD,
        emissiveIntensity: 1.5,
      })
      const strips: THREE.Mesh[] = []
      for (let i = 0; i < 6; i++) {
        const stripGeo = new THREE.BoxGeometry(3.6, 0.1, 0.05)
        const strip = new THREE.Mesh(stripGeo, spStripMat)
        strip.position.set(0, -11 + i * 2, 1.78)
        group.add(strip)
        strips.push(strip)
        disposablesRef.current.push(stripGeo, strip)
      }

      const cones: THREE.Mesh[] = []
      const conePositions = [
        { y: -2, r: 1.4 },
        { y: -8, r: 1.8 },
        { y: -11, r: 1.8 },
      ]
      for (const cp of conePositions) {
        const coneGeo = new THREE.CylinderGeometry(cp.r, cp.r, 0.4, 32)
        const coneMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1f, metalness: 0.5, roughness: 0.5 })
        const cone = new THREE.Mesh(coneGeo, coneMat)
        cone.position.set(0, cp.y, 1.78)
        cone.rotation.x = Math.PI / 2
        group.add(cone)
        cones.push(cone)
        disposablesRef.current.push(coneGeo, coneMat, cone)

        const capGeo = new THREE.SphereGeometry(cp.r * 0.4, 16, 16)
        const capMat = new THREE.MeshStandardMaterial({
          color: PINK,
          emissive: PINK,
          emissiveIntensity: 0.4,
        })
        const cap = new THREE.Mesh(capGeo, capMat)
        cap.position.set(0, cp.y, 1.98)
        group.add(cap)
        disposablesRef.current.push(capGeo, capMat, cap)
      }

      const rings: THREE.Mesh[] = []
      for (const cp of conePositions) {
        const ringGeo = new THREE.TorusGeometry(cp.r + 0.15, 0.08, 8, 32)
        const ringMat = new THREE.MeshStandardMaterial({
          color: CYAN,
          emissive: CYAN,
          emissiveIntensity: 1.0,
        })
        const ring = new THREE.Mesh(ringGeo, ringMat)
        ring.position.set(0, cp.y, 1.78)
        group.add(ring)
        rings.push(ring)
        disposablesRef.current.push(ringGeo, ringMat, ring)
      }

      group.position.set(pos.x, 0, pos.z)
      scene.add(group)
      disposablesRef.current.push(cabGeo, cabMat, cabinet, spStripMat, group)
      speakers.push({ group, cones, rings, strips })
    }

    // === GIFT BOXES ===
    type Gift = { group: THREE.Group; bowMat: THREE.MeshStandardMaterial }
    const gifts: Gift[] = []
    const giftColors = [GOLD, PINK, PURPLE]
    const giftPositions = [
      { x: -10, z: -8 },
      { x: 10, z: -8 },
      { x: 0, z: -12 },
    ]
    for (let i = 0; i < giftPositions.length; i++) {
      const group = new THREE.Group()
      const color = giftColors[i % giftColors.length]
      const size = 1.5 + Math.random() * 0.8

      const boxGeo = new THREE.BoxGeometry(size, size, size)
      const boxMat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.25,
        metalness: 0.5,
        roughness: 0.4,
      })
      const box = new THREE.Mesh(boxGeo, boxMat)
      box.position.y = size / 2
      group.add(box)

      const ribbonMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.4,
      })
      const vRibGeo = new THREE.BoxGeometry(size * 0.2, size * 1.05, size * 1.02)
      const vRib = new THREE.Mesh(vRibGeo, ribbonMat)
      vRib.position.y = size / 2
      group.add(vRib)
      const hRibGeo = new THREE.BoxGeometry(size * 1.02, size * 0.2, size * 1.05)
      const hRib = new THREE.Mesh(hRibGeo, ribbonMat)
      hRib.position.y = size / 2
      group.add(hRib)

      const bowGeo = new THREE.TorusGeometry(size * 0.3, size * 0.1, 8, 16)
      const bowMat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.8,
      })
      const bow = new THREE.Mesh(bowGeo, bowMat)
      bow.position.y = size + size * 0.15
      bow.rotation.x = Math.PI / 2
      group.add(bow)

      const pos = giftPositions[i]
      group.position.set(pos.x, -11.5, pos.z)
      scene.add(group)
      gifts.push({ group, bowMat })
      disposablesRef.current.push(
        boxGeo, boxMat, box,
        ribbonMat,
        vRibGeo, vRib, hRibGeo, hRib,
        bowGeo, bowMat, bow,
        group,
      )
    }

    // === EQUALIZER BARS ===
    const eqBars: THREE.Mesh[] = []
    const eqMats: THREE.MeshStandardMaterial[] = []
    const barCount = isMobile ? 20 : 50
    const barGeo = new THREE.BoxGeometry(0.6, 1, 0.6)
    for (let i = 0; i < barCount; i++) {
      const hue = (i / barCount) * 360
      const color = new THREE.Color(`hsl(${hue}, 100%, 55%)`)
      const mat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.5,
      })
      const bar = new THREE.Mesh(barGeo, mat)
      const x = (i - barCount / 2) * 0.9
      bar.position.set(x, -11.5, -8)
      bar.scale.y = 1
      scene.add(bar)
      eqBars.push(bar)
      eqMats.push(mat)
      disposablesRef.current.push(mat, bar)
    }
    disposablesRef.current.push(barGeo)

    // === VINYL RECORDS ===
    type Vinyl = { group: THREE.Group; labelMat: THREE.MeshStandardMaterial }
    const vinyls: Vinyl[] = []
    const vinylColors = [GOLD, PINK, PURPLE, CYAN, '#F97316']
    const vinylCount = isMobile ? 2 : 5
    for (let i = 0; i < vinylCount; i++) {
      const group = new THREE.Group()
      const color = vinylColors[i % vinylColors.length]
      const size = 2.5

      const discGeo = new THREE.CylinderGeometry(size, size, 0.15, 64)
      const discMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, metalness: 0.95, roughness: 0.1 })
      const disc = new THREE.Mesh(discGeo, discMat)
      group.add(disc)

      const labelGeo = new THREE.CylinderGeometry(size * 0.35, size * 0.35, 0.17, 32)
      const labelMat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.8,
        roughness: 0.3,
      })
      const label = new THREE.Mesh(labelGeo, labelMat)
      group.add(label)

      const angle = (i / vinylCount) * Math.PI * 2
      const radius = 18
      group.position.set(
        Math.cos(angle) * radius,
        8 + Math.random() * 4,
        Math.sin(angle) * radius - 20,
      )
      group.rotation.x = Math.PI / 2
      scene.add(group)
      vinyls.push({ group, labelMat })
      disposablesRef.current.push(discGeo, discMat, disc, labelGeo, labelMat, label, group)
    }

    // === LASER BEAMS (volumetric, additive blending) ===
    const lasers: THREE.Mesh[] = []
    const laserMats: THREE.MeshBasicMaterial[] = []
    const laserCount = isMobile ? 2 : 4
    const laserColors = [CYAN, PINK, GOLD, PURPLE]
    for (let i = 0; i < laserCount; i++) {
      const beamGeo = new THREE.CylinderGeometry(0.12, 0.12, 80, 8, 1, true)
      beamGeo.translate(0, 40, 0)
      const beamColor = laserColors[i % laserColors.length]
      const beamMat = new THREE.MeshBasicMaterial({
        color: beamColor,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
      const beam = new THREE.Mesh(beamGeo, beamMat)
      const x = (i - (laserCount - 1) / 2) * 6
      beam.position.set(x, 25, -10)
      scene.add(beam)
      lasers.push(beam)
      laserMats.push(beamMat)
      disposablesRef.current.push(beamGeo, beamMat, beam)
    }

    // === BALLOON ARCH (24 balloons, semi-circle) ===
    type Balloon = {
      mesh: THREE.Mesh
      mat: THREE.MeshStandardMaterial
      baseY: number
      phase: number
    }
    const balloons: Balloon[] = []
    const balloonColors = [GOLD, PINK, PURPLE, CYAN, '#F97316', '#FFFFFF']
    const archCount = 24
    const archRadius = 18
    for (let i = 0; i < archCount; i++) {
      const t = i / (archCount - 1)
      const angle = Math.PI * t // 0..PI — semi-circle
      const x = Math.cos(angle) * archRadius
      const z = -20
      const baseY = Math.sin(angle) * 12 + 4
      const color = balloonColors[i % balloonColors.length]

      const bodyGeo = new THREE.SphereGeometry(0.9, 16, 16)
      bodyGeo.scale(1, 1.25, 1)
      const bodyMat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.2,
        metalness: 0.6,
        roughness: 0.2,
      })
      const mesh = new THREE.Mesh(bodyGeo, bodyMat)
      mesh.position.set(x, baseY, z)
      scene.add(mesh)
      balloons.push({ mesh, mat: bodyMat, baseY, phase: i * 0.4 })
      disposablesRef.current.push(bodyGeo, bodyMat, mesh)
    }

    // === FLOATING PARTICLES (vertex-colored, canvas texture) ===
    const particleTexture = createSoftCircleTexture()
    disposablesRef.current.push(particleTexture)
    const particleCount = isMobile ? 300 : 1000
    const particleGeo = new THREE.BufferGeometry()
    const particlePos = new Float32Array(particleCount * 3)
    const particleCols = new Float32Array(particleCount * 3)
    const palette = [
      new THREE.Color(GOLD),
      new THREE.Color(PINK),
      new THREE.Color(PURPLE),
      new THREE.Color(CYAN),
    ]
    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 100
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 50 + 5
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 80 - 10
      const c = palette[i % palette.length]
      particleCols[i * 3] = c.r
      particleCols[i * 3 + 1] = c.g
      particleCols[i * 3 + 2] = c.b
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3))
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleCols, 3))
    const particleMat = new THREE.PointsMaterial({
      map: particleTexture,
      size: 0.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)
    disposablesRef.current.push(particleGeo, particleMat, particles)

    // === MOUSE PARALLAX (desktop only — no mousemove on touch devices) ===
    const mouse = { x: 0, y: 0 }
    const targetMouse = { x: 0, y: 0 }
    const onMouseMove = (e: MouseEvent) => {
      targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1
      targetMouse.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    if (!isMobile) {
      window.addEventListener('mousemove', onMouseMove)
    }

    // === ANIMATION LOOP ===
    const clock = new THREE.Clock()
    let isInView = true

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)
      // NOTE: getDelta() must be called BEFORE reading clock.elapsedTime —
      // getElapsedTime() internally calls getDelta(), so calling it first
      // would make the subsequent getDelta() return ~0.
      const delta = clock.getDelta()
      const time = clock.elapsedTime

      // Smooth mouse + camera parallax (desktop only). On mobile the camera
      // stays at its initial pulled-back position so the full scene remains in
      // frame on the narrow portrait viewport.
      mouse.x += (targetMouse.x - mouse.x) * 0.05
      mouse.y += (targetMouse.y - mouse.y) * 0.05
      if (isMobile) {
        camera.position.x = 0
        camera.position.y = 10
      } else {
        camera.position.x = mouse.x * 4
        camera.position.y = 7 + mouse.y * 2
      }
      camera.lookAt(0, 0, -15)

      // LED screen color cycle
      const ledHue = (time * 0.05) % 1
      screenMat.emissive.setHSL(ledHue, 1, 0.5)
      screenMat.emissiveIntensity = 1.5 + Math.sin(time * 2) * 0.3

      // DJ booth strips flicker
      djStripMat.emissiveIntensity = 1.3 + Math.sin(time * 5) * 0.4

      // Floor lamps sweep + intensity pulse
      lamps.forEach((lamp, i) => {
        const baseX = lamp.base.position.x
        const baseZ = lamp.base.position.z
        lamp.target.position.x = baseX + Math.sin(time * 0.8 + i) * 12
        lamp.target.position.z = baseZ + Math.cos(time * 0.8 + i) * 8
        lamp.target.position.y = -12
        lamp.spot.intensity = 42 + Math.sin(time * 4 + i) * 21
      })

      // Speakers pulse + LED rings/strips flicker
      const beat = 1 + Math.sin(time * 5) * 0.08
      speakers.forEach((sp) => {
        sp.cones.forEach((c) => c.scale.set(beat, 1, beat))
        sp.rings.forEach((r, idx) => {
          const mat = r.material as THREE.MeshStandardMaterial
          mat.emissiveIntensity = 0.8 + Math.sin(time * 4 + idx) * 0.5
        })
        sp.strips.forEach((s, idx) => {
          const mat = s.material as THREE.MeshStandardMaterial
          mat.emissiveIntensity = 1.2 + Math.sin(time * 6 + idx * 0.5) * 0.5
        })
      })

      // Gift boxes: bow shimmer + subtle rotation
      gifts.forEach((g, i) => {
        g.bowMat.emissiveIntensity = 0.6 + Math.sin(time * 3 + i) * 0.3
        g.group.rotation.y = Math.sin(time * 0.5 + i) * 0.1
      })

      // Equalizer bars (simulated audio)
      eqBars.forEach((bar, i) => {
        const h = 1 + Math.sin(time * 4 + i * 0.3) * 4 + Math.cos(time * 2 + i * 0.15) * 1.5
        bar.scale.y = Math.max(0.5, h)
        bar.position.y = -11.5 + bar.scale.y / 2
        eqMats[i].emissiveIntensity = 0.4 + (bar.scale.y / 6) * 0.5
      })

      // Vinyls spin + label pulse
      vinyls.forEach((v, i) => {
        v.group.rotation.z += delta * (0.6 + i * 0.2)
        v.group.position.y = 8 + Math.sin(time * 0.7 + i) * 1.5
        v.labelMat.emissiveIntensity = 0.6 + Math.sin(time * 2 + i) * 0.3
      })

      // Laser beams swing + intensity flicker
      lasers.forEach((laser, i) => {
        laser.rotation.z = Math.sin(time * 0.6 + i * 1.2) * 0.5
        laser.rotation.x = Math.cos(time * 0.4 + i) * 0.3
        laserMats[i].opacity = 0.25 + Math.sin(time * 5 + i) * 0.15 + 0.1
      })

      // Balloon arch breathing
      balloons.forEach((b) => {
        const s = 1 + Math.sin(time * 1.5 + b.phase) * 0.06
        b.mesh.scale.set(s, s, s)
        b.mesh.position.y = b.baseY + Math.sin(time * 0.8 + b.phase) * 0.3
      })

      // Fog + particles drift
      fogParticles.rotation.y = time * 0.02
      particles.rotation.y = time * 0.03
      particles.rotation.x = time * 0.01

      // Pulse point lights (intensities reduced 30% to match the lower
      // overall lighting budget — see light setup above).
      purplePL.intensity = 42 + Math.sin(time * 2) * 14
      pinkPL.intensity = 42 + Math.sin(time * 2 + 1) * 14
      cyanPL.intensity = 35 + Math.sin(time * 2 + 2) * 10.5

      // Render
      if (composer) {
        composer.render()
      } else {
        renderer.render(scene, camera)
      }
    }

    // === INTERSECTION OBSERVER (pause/resume rAF without teardown) ===
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      const wasInView = isInView
      isInView = entry.isIntersecting
      if (isInView && !wasInView) {
        // Reset clock so animations don't lurch forward after the pause.
        clock.getDelta()
        animate()
      } else if (!isInView && wasInView) {
        cancelAnimationFrame(animationIdRef.current)
        animationIdRef.current = 0
      }
    }, { threshold: 0.01 })
    visibilityObserver.observe(container)

    animate()

    // === RESIZE HANDLER (debounced) ===
    let resizeTimer: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        if (!containerRef.current) return
        const w = containerRef.current.clientWidth
        const h = containerRef.current.clientHeight
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
        const pr = Math.min(window.devicePixelRatio, pixelRatioCap)
        renderer.setPixelRatio(pr)
        if (composer) composer.setSize(w, h)
        if (fxaaPass) {
          fxaaPass.material.uniforms['resolution'].value.set(
            1 / (w * pr),
            1 / (h * pr),
          )
        }
      }, 250)
    }
    window.addEventListener('resize', onResize)

    // === CLEANUP ===
    return () => {
      cancelAnimationFrame(animationIdRef.current)
      visibilityObserver.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      clearTimeout(resizeTimer)

      // Dispose all tracked resources. The `'dispose' in d` narrowing skips
      // Object3D subclasses that don't expose dispose (Mesh/Group/Light).
      disposablesRef.current.forEach((d) => {
        if (d && 'dispose' in d && typeof d.dispose === 'function') {
          d.dispose()
        }
      })
      disposablesRef.current = []

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      if (composerRef.current) {
        composerRef.current.dispose()
        composerRef.current = null
      }
      pmrem.dispose()
      renderer.dispose()

      rendererRef.current = null
      composerRef.current = null
      sceneRef.current = null
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    />
  )
}

/**
 * Build a small radial-gradient CanvasTexture used as the sprite for both the
 * low-lying fog Points and the floating particles. Soft circular falloff so
 * the points read as glowing bokeh rather than hard squares.
 */
function createSoftCircleTexture(): THREE.Texture {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const gradient = ctx.createRadialGradient(
      size / 2, size / 2, 0,
      size / 2, size / 2, size / 2,
    )
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.3, 'rgba(255,255,255,0.6)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}
