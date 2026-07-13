'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { shouldEnable3D } from '@/lib/device-capabilities'

/**
 * LaLounge3DBackground — an ultra-detailed "event blueprint" 3D scene for the
 * La Lounge page. Built with vanilla Three.js (NOT R3F) following the same
 * pattern as `birthday-3d-background.tsx`.
 *
 * The scene is an architectural top-down/3D hybrid: a transparent canvas
 * layered over the page's light background, with translucent fuchsia/purple
 * volumes, dashed measurement lines, holo-UI nodes, and a 3-phase cinematic
 * camera (fly-through → pull-up → continuous orbit).
 *
 * Adapted from a user-provided HTML reference. The HTML's fuchsia/purple
 * palette (#86198f, #a21caf, #c026d3, #d946ef, #f0abfc) is kept as-is — it
 * matches both the blueprint aesthetic and the La Lounge brand pink
 * (#E6007E = BRAND_COLORS.LA_LOUNGE).
 *
 * Scene elements:
 *  - Base grid (200×50, fuchsia lines @ 0.3 opacity)
 *  - Main stage (raised platform, truss roof, LED screen backdrop, stairs)
 *  - FOH booth + dancefloor + crowd particles (120 desktop / 60 mobile)
 *  - VIP platforms (2 raised side platforms with sofas + railings)
 *  - Guest tables (rows of round tables with chairs + centerpieces)
 *  - Main bar + catering (bar counter, food trucks, picnic tables, string lights)
 *  - Entrance plaza (gate arch, turnstiles, planters, totems)
 *  - Backstage + generators (containers, generator boxes, cable lines)
 *  - Restrooms (2 portacabin-style boxes)
 *  - Landscape bollards (perimeter lights)
 *  - Holo UI nodes (5 nodes, each with ring + dashed line + sphere + label)
 *  - Cinematic 3-phase camera animation
 *
 * Performance gates:
 *  - shouldEnable3D() guard
 *  - IntersectionObserver pauses rAF when off-screen
 *  - Mobile: capped pixel ratio (1.5), reduced crowd particles (60 vs 120)
 *  - Full resource disposal (geometries / materials / textures / renderer)
 */

/** Anything we want to dispose on unmount: geometries/materials/textures have
 *  dispose(); meshes/groups/lights don't (handled via `'dispose' in d` narrowing). */
type Disposable =
  | THREE.BufferGeometry
  | THREE.Material
  | THREE.Texture
  | THREE.Object3D

export default function LaLounge3DBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
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

    // === COLOR PALETTE (from HTML reference; matches La Lounge brand pink) ===
    const C_STRUCT = 0x86198f // matStruct — primary structural volumes
    const C_MAIN = 0xa21caf // matMain — main surfaces
    const C_SUB = 0xc026d3 // matSub — secondary surfaces
    const C_ACCENT = 0xd946ef // matAccent — accent / holo
    const C_HIDDEN = 0xf0abfc // matHidden — dashed measurement lines
    const C_GLASS = 0xfbcfe8 // matGlass — glass / transparent panels
    const C_ZONE = 0xfae8ff // matZone — zone shading
    const C_RUG = 0xf5d0fe // matRug — rug / carpet zones
    const C_GRID1 = 0xa21caf // grid primary
    const C_GRID2 = 0xfbcfe8 // grid secondary

    // === SCENE (transparent — page CSS provides the light background) ===
    const scene = new THREE.Scene()

    // === CAMERA ===
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 40, 90)
    // Persistent look-target — lerped across the 3 cinematic phases.
    const camTarget = new THREE.Vector3(0, 2, 70)
    camera.lookAt(camTarget)

    // === RENDERER ===
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
    })
    renderer.setClearColor(0x000000, 0)
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatioCap))
    container.appendChild(renderer.domElement)

    // === LIGHTING (matches HTML reference) ===
    const ambient = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambient)

    const dirMain = new THREE.DirectionalLight(C_ACCENT, 0.8)
    dirMain.position.set(50, 100, 50)
    scene.add(dirMain)

    const dirSub = new THREE.DirectionalLight(C_MAIN, 0.4)
    dirSub.position.set(-50, 50, -50)
    scene.add(dirSub)

    disposablesRef.current.push(ambient, dirMain, dirSub)

    // === MATERIALS (all translucent — blueprint aesthetic) ===
    const matStruct = new THREE.MeshPhongMaterial({
      color: C_STRUCT,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
    })
    const matMain = new THREE.MeshPhongMaterial({
      color: C_MAIN,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
    })
    const matSub = new THREE.MeshPhongMaterial({
      color: C_SUB,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    })
    const matAccent = new THREE.MeshPhongMaterial({
      color: C_ACCENT,
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide,
      emissive: C_ACCENT,
      emissiveIntensity: 0.3,
    })
    const matVolume = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
    })
    const matVolumeAccent = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
    })
    const matGlass = new THREE.MeshPhongMaterial({
      color: C_GLASS,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide,
    })
    const matZone = new THREE.MeshBasicMaterial({
      color: C_ZONE,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    })
    const matRug = new THREE.MeshBasicMaterial({
      color: C_RUG,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    })
    disposablesRef.current.push(
      matStruct, matMain, matSub, matAccent,
      matVolume, matVolumeAccent, matGlass, matZone, matRug,
    )

    // === BASE GRID (200×50, fuchsia cross-lines) ===
    const grid = new THREE.GridHelper(200, 50, C_GRID1, C_GRID2)
    const gridMat = grid.material as THREE.Material
    gridMat.transparent = true
    gridMat.opacity = 0.3
    scene.add(grid)
    disposablesRef.current.push(grid)

    // ============================================================
    // HELPER FUNCTIONS
    // ============================================================

    /** Make a box mesh (does NOT add to scene — caller adds to scene/group). */
    function makeBox(
      w: number, h: number, d: number,
      mat: THREE.Material, x = 0, y = 0, z = 0,
    ): THREE.Mesh {
      const geo = new THREE.BoxGeometry(w, h, d)
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(x, y, z)
      disposablesRef.current.push(geo, mesh)
      return mesh
    }

    /** Make a cylinder mesh (does NOT add to scene). */
    function makeCyl(
      rt: number, rb: number, h: number,
      mat: THREE.Material, x = 0, y = 0, z = 0, seg = 16,
    ): THREE.Mesh {
      const geo = new THREE.CylinderGeometry(rt, rb, h, seg)
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(x, y, z)
      disposablesRef.current.push(geo, mesh)
      return mesh
    }

    /** Volume box — added directly to scene at (x,y,z). */
    function volBox(
      w: number, h: number, d: number,
      mat: THREE.Material, x: number, y: number, z: number,
    ): THREE.Mesh {
      const m = makeBox(w, h, d, mat, x, y, z)
      scene.add(m)
      return m
    }

    /** Volume cylinder — added directly to scene at (x,y,z). */
    function volCyl(
      rt: number, rb: number, h: number,
      mat: THREE.Material, x: number, y: number, z: number, seg = 16,
    ): THREE.Mesh {
      const m = makeCyl(rt, rb, h, mat, x, y, z, seg)
      scene.add(m)
      return m
    }

    /** Dashed measurement line (LineDashedMaterial). */
    function dashedLine(
      p1: THREE.Vector3, p2: THREE.Vector3,
      color: number = C_HIDDEN, opacity = 0.6,
    ): THREE.Line {
      const geo = new THREE.BufferGeometry().setFromPoints([p1, p2])
      const mat = new THREE.LineDashedMaterial({
        color,
        transparent: true,
        opacity,
        dashSize: 0.6,
        gapSize: 0.4,
      })
      const line = new THREE.Line(geo, mat)
      line.computeLineDistances()
      scene.add(line)
      disposablesRef.current.push(geo, mat, line)
      return line
    }

    /** Solid line. */
    function solidLine(
      p1: THREE.Vector3, p2: THREE.Vector3,
      color: number = C_ACCENT, opacity = 0.7,
    ): THREE.Line {
      const geo = new THREE.BufferGeometry().setFromPoints([p1, p2])
      const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity })
      const line = new THREE.Line(geo, mat)
      scene.add(line)
      disposablesRef.current.push(geo, mat, line)
      return line
    }

    /** Horizontal circle outline (ring) on the XZ plane at y. */
    function createCircle(
      radius: number, y = 0.02,
      color: number = C_ACCENT, opacity = 0.8, segments = 64,
    ): THREE.Line {
      const pts: THREE.Vector3[] = []
      for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * Math.PI * 2
        pts.push(new THREE.Vector3(Math.cos(a) * radius, y, Math.sin(a) * radius))
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts)
      const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity })
      const line = new THREE.Line(geo, mat)
      scene.add(line)
      disposablesRef.current.push(geo, mat, line)
      return line
    }

    /** Flat zone plane on the ground (XZ). */
    function createZone(
      w: number, d: number, mat: THREE.Material,
      x: number, y: number, z: number,
    ): THREE.Mesh {
      const geo = new THREE.PlaneGeometry(w, d)
      const mesh = new THREE.Mesh(geo, mat)
      mesh.rotation.x = -Math.PI / 2
      mesh.position.set(x, y, z)
      scene.add(mesh)
      disposablesRef.current.push(geo, mesh)
      return mesh
    }

    /** Text label as a sprite (canvas texture). */
    function createText(
      text: string, x: number, y: number, z: number,
      color: number = C_ACCENT, scale = 8,
    ): THREE.Sprite {
      const canvas = document.createElement('canvas')
      canvas.width = 256
      canvas.height = 64
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.font = 'bold 30px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const hex = '#' + color.toString(16).padStart(6, '0')
        ctx.fillStyle = hex
        ctx.shadowColor = hex
        ctx.shadowBlur = 8
        ctx.fillText(text, canvas.width / 2, canvas.height / 2)
      }
      const tex = new THREE.CanvasTexture(canvas)
      tex.needsUpdate = true
      const mat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
        depthTest: false,
      })
      const sprite = new THREE.Sprite(mat)
      sprite.position.set(x, y, z)
      sprite.scale.set(scale, scale * 0.25, 1)
      scene.add(sprite)
      disposablesRef.current.push(tex, mat, sprite)
      return sprite
    }

    /** Truss segment — horizontal beam with vertical posts + X bracing. */
    function createTrussSegment(
      width: number, height: number,
      x: number, y: number, z: number,
      mat: THREE.Material = matStruct,
    ): THREE.Group {
      const group = new THREE.Group()
      // Top + bottom chords
      const chordGeo = new THREE.BoxGeometry(width, 0.18, 0.18)
      const top = new THREE.Mesh(chordGeo, mat)
      top.position.y = height
      group.add(top)
      const bot = new THREE.Mesh(chordGeo, mat)
      bot.position.y = 0
      group.add(bot)
      // Vertical posts + X bracing
      const postCount = Math.max(2, Math.floor(width / 2))
      const postGeo = new THREE.BoxGeometry(0.14, height, 0.14)
      const braceMat = new THREE.LineBasicMaterial({
        color: C_SUB, transparent: true, opacity: 0.5,
      })
      const braceGeos: THREE.BufferGeometry[] = []
      for (let i = 0; i <= postCount; i++) {
        const px = -width / 2 + (i / postCount) * width
        const post = new THREE.Mesh(postGeo, mat)
        post.position.set(px, height / 2, 0)
        group.add(post)
        if (i < postCount) {
          const x1 = px
          const x2 = -width / 2 + ((i + 1) / postCount) * width
          // Diagonal /
          const g1 = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(x1, 0, 0),
            new THREE.Vector3(x2, height, 0),
          ])
          const l1 = new THREE.Line(g1, braceMat)
          group.add(l1)
          // Diagonal \
          const g2 = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(x1, height, 0),
            new THREE.Vector3(x2, 0, 0),
          ])
          const l2 = new THREE.Line(g2, braceMat)
          group.add(l2)
          braceGeos.push(g1, g2)
        }
      }
      group.position.set(x, y, z)
      scene.add(group)
      disposablesRef.current.push(chordGeo, postGeo, braceMat, top, bot, group)
      braceGeos.forEach((g) => disposablesRef.current.push(g))
      return group
    }

    // ============================================================
    // FURNITURE GENERATORS (each returns a Group, caller positions it)
    // ============================================================

    /** Banquet chair — seat + back + 4 legs. */
    function createBanquetChair(): THREE.Group {
      const g = new THREE.Group()
      g.add(makeBox(0.5, 0.05, 0.5, matSub, 0, 0.45, 0)) // seat
      g.add(makeBox(0.5, 0.5, 0.05, matSub, 0, 0.7, -0.225)) // back
      for (const [lx, lz] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]) {
        g.add(makeCyl(0.03, 0.03, 0.45, matSub, lx, 0.225, lz, 6))
      }
      return g
    }

    /** Bar stool — round seat + 4 legs + footrest ring. */
    function createBarStool(): THREE.Group {
      const g = new THREE.Group()
      g.add(makeCyl(0.22, 0.22, 0.05, matAccent, 0, 1.0, 0, 16)) // seat
      for (const [lx, lz] of [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]]) {
        g.add(makeCyl(0.02, 0.02, 1.0, matSub, lx, 0.5, lz, 6))
      }
      // Footrest ring (torus)
      const ringGeo = new THREE.TorusGeometry(0.2, 0.015, 6, 16)
      const ring = new THREE.Mesh(ringGeo, matSub)
      ring.rotation.x = Math.PI / 2
      ring.position.y = 0.3
      g.add(ring)
      disposablesRef.current.push(ringGeo, ring)
      return g
    }

    /** Lounge sofa — long cushioned seat + back + armrests. */
    function createLoungeSofa(): THREE.Group {
      const g = new THREE.Group()
      g.add(makeBox(2.4, 0.4, 0.9, matMain, 0, 0.2, 0)) // base
      g.add(makeBox(2.4, 0.2, 0.1, matMain, 0, 0.5, -0.4)) // back cushion
      g.add(makeBox(2.4, 0.5, 0.2, matSub, 0, 0.45, 0.1)) // seat cushion
      g.add(makeBox(0.2, 0.4, 0.9, matMain, -1.1, 0.4, 0)) // left arm
      g.add(makeBox(0.2, 0.4, 0.9, matMain, 1.1, 0.4, 0)) // right arm
      for (const [lx, lz] of [[-1.1, -0.4], [1.1, -0.4], [-1.1, 0.4], [1.1, 0.4]]) {
        g.add(makeBox(0.15, 0.2, 0.15, matSub, lx, 0.0, lz))
      }
      return g
    }

    /** Planter — tapered pot + spherical foliage. */
    function createPlanter(): THREE.Group {
      const g = new THREE.Group()
      g.add(makeCyl(0.4, 0.3, 0.5, matStruct, 0, 0.25, 0, 12)) // pot
      const foliGeo = new THREE.SphereGeometry(0.55, 12, 8)
      const foli = new THREE.Mesh(foliGeo, matSub)
      foli.position.y = 0.7
      foli.scale.y = 1.2
      g.add(foli)
      disposablesRef.current.push(foliGeo, foli)
      return g
    }

    /** Food truck — box body + serving window + roof + wheels. */
    function createFoodTruck(): THREE.Group {
      const g = new THREE.Group()
      g.add(makeBox(4, 2.2, 2, matMain, 0, 1.3, 0)) // body
      g.add(makeBox(4, 0.4, 2, matAccent, 0, 2.6, 0)) // roof awning
      // Serving window (glass plane)
      const winGeo = new THREE.PlaneGeometry(2.5, 0.9)
      const win = new THREE.Mesh(winGeo, matGlass)
      win.position.set(0, 1.5, 1.01)
      g.add(win)
      disposablesRef.current.push(winGeo, win)
      // Wheels
      for (const [lx, lz] of [[-1.4, -1], [1.4, -1], [-1.4, 1], [1.4, 1]]) {
        g.add(makeCyl(0.3, 0.3, 0.2, matStruct, lx, 0.3, lz, 12))
      }
      // Counter line (under window)
      const counterGeo = new THREE.BoxGeometry(3, 0.1, 0.4)
      const counter = new THREE.Mesh(counterGeo, matAccent)
      counter.position.set(0, 1.0, 1.05)
      g.add(counter)
      disposablesRef.current.push(counterGeo, counter)
      return g
    }

    /** Totem — tall vertical sign pole with a banner box on top. */
    function createTotem(): THREE.Group {
      const g = new THREE.Group()
      g.add(makeCyl(0.12, 0.15, 4, matStruct, 0, 2, 0, 8)) // pole
      g.add(makeBox(1.2, 1.5, 0.15, matAccent, 0, 4.4, 0)) // banner
      g.add(makeBox(1.4, 0.1, 0.2, matStruct, 0, 5.2, 0)) // cap
      return g
    }

    /** Picnic table — long tabletop + 2 benches + 4 legs. */
    function createPicnicTable(): THREE.Group {
      const g = new THREE.Group()
      g.add(makeBox(2.4, 0.08, 0.7, matMain, 0, 0.75, 0)) // tabletop
      g.add(makeBox(2.4, 0.06, 0.35, matSub, 0, 0.45, -0.6)) // bench 1
      g.add(makeBox(2.4, 0.06, 0.35, matSub, 0, 0.45, 0.6)) // bench 2
      for (const [lx, lz] of [[-1.0, -0.2], [1.0, -0.2], [-1.0, 0.2], [1.0, 0.2]]) {
        g.add(makeBox(0.08, 0.75, 0.5, matStruct, lx, 0.375, lz)) // leg
      }
      return g
    }

    /** String lights — a wire between two poles with glowing bulbs. */
    function createStringLights(
      x1: number, z1: number, x2: number, z2: number, height = 5,
    ): THREE.Group {
      const g = new THREE.Group()
      // Wire (catenary curve approximated by a parabola of small segments)
      const span = Math.hypot(x2 - x1, z2 - z1)
      const segs = 16
      const pts: THREE.Vector3[] = []
      for (let i = 0; i <= segs; i++) {
        const t = i / segs
        const x = x1 + (x2 - x1) * t
        const z = z1 + (z2 - z1) * t
        const sag = Math.sin(t * Math.PI) * 0.6 // parabolic sag
        pts.push(new THREE.Vector3(x, height - sag, z))
      }
      const wireGeo = new THREE.BufferGeometry().setFromPoints(pts)
      const wireMat = new THREE.LineBasicMaterial({
        color: C_HIDDEN, transparent: true, opacity: 0.5,
      })
      const wire = new THREE.Line(wireGeo, wireMat)
      scene.add(wire)
      disposablesRef.current.push(wireGeo, wireMat, wire)
      // Bulbs along the wire
      const bulbGeo = new THREE.SphereGeometry(0.08, 6, 6)
      const bulbMat = new THREE.MeshBasicMaterial({
        color: C_ACCENT, transparent: true, opacity: 0.95,
      })
      const bulbCount = Math.max(4, Math.floor(span / 1.5))
      for (let i = 1; i < bulbCount; i++) {
        const t = i / bulbCount
        const x = x1 + (x2 - x1) * t
        const z = z1 + (z2 - z1) * t
        const sag = Math.sin(t * Math.PI) * 0.6
        const bulb = new THREE.Mesh(bulbGeo, bulbMat)
        bulb.position.set(x, height - sag - 0.1, z)
        scene.add(bulb)
        disposablesRef.current.push(bulb)
      }
      disposablesRef.current.push(bulbGeo, bulbMat)
      // Support poles at both ends
      g.add(makeCyl(0.06, 0.08, height, matStruct, x1, height / 2, z1, 6))
      g.add(makeCyl(0.06, 0.08, height, matStruct, x2, height / 2, z2, 6))
      return g
    }

    /** Turnstile — rotating gate arms on a post. */
    function createTurnstile(): THREE.Group {
      const g = new THREE.Group()
      g.add(makeCyl(0.12, 0.15, 1.1, matStruct, 0, 0.55, 0, 8)) // post
      // 3-way arms
      const armGeo = new THREE.BoxGeometry(0.8, 0.05, 0.05)
      for (let i = 0; i < 3; i++) {
        const arm = new THREE.Mesh(armGeo, matAccent)
        arm.position.y = 1.0
        arm.rotation.y = (i / 3) * Math.PI * 2
        g.add(arm)
        disposablesRef.current.push(arm)
      }
      disposablesRef.current.push(armGeo)
      return g
    }

    /** Centerpiece — small vase + flowers for round tables. */
    function createCenterpiece(): THREE.Group {
      const g = new THREE.Group()
      g.add(makeCyl(0.08, 0.1, 0.2, matAccent, 0, 0.1, 0, 8)) // vase
      const flowerGeo = new THREE.SphereGeometry(0.15, 8, 6)
      const flower = new THREE.Mesh(flowerGeo, matAccent)
      flower.position.y = 0.3
      g.add(flower)
      disposablesRef.current.push(flowerGeo, flower)
      return g
    }

    // ============================================================
    // ARCHITECTURE BUILD
    // ============================================================

    // --- MAIN STAGE (z = -30 to -10) ---
    // Raised platform
    createZone(40, 22, matZone, 0, 0.02, -20) // stage floor zone
    volBox(40, 1, 22, matMain, 0, 0.5, -20) // stage platform
    // Stage edge accent line
    solidLine(new THREE.Vector3(-20, 1.05, -31), new THREE.Vector3(20, 1.05, -31), C_ACCENT, 0.9)
    solidLine(new THREE.Vector3(-20, 1.05, -9), new THREE.Vector3(20, 1.05, -9), C_ACCENT, 0.9)
    solidLine(new THREE.Vector3(-20, 1.05, -31), new THREE.Vector3(-20, 1.05, -9), C_ACCENT, 0.9)
    solidLine(new THREE.Vector3(20, 1.05, -31), new THREE.Vector3(20, 1.05, -9), C_ACCENT, 0.9)
    // LED screen backdrop
    volBox(30, 6, 0.5, matGlass, 0, 4.5, -30)
    const ledGeo = new THREE.PlaneGeometry(28, 5)
    const ledMat = new THREE.MeshBasicMaterial({
      color: C_ACCENT, transparent: true, opacity: 0.4, side: THREE.DoubleSide,
    })
    const ledScreen = new THREE.Mesh(ledGeo, ledMat)
    ledScreen.position.set(0, 4.5, -29.7)
    scene.add(ledScreen)
    disposablesRef.current.push(ledGeo, ledMat, ledScreen)
    // Truss roof over stage (2 side trusses + cross beam)
    createTrussSegment(22, 8, -16, 1.5, -20)
    createTrussSegment(22, 8, 16, 1.5, -20)
    // Cross truss (front + back)
    const crossTruss1 = createTrussSegment(32, 1, 0, 9.5, -16)
    crossTruss1.rotation.y = Math.PI / 2
    crossTruss1.scale.set(0.7, 1, 1)
    crossTruss1.position.set(0, 9.5, -16)
    const crossTruss2 = createTrussSegment(32, 1, 0, 9.5, -24)
    crossTruss2.rotation.y = Math.PI / 2
    crossTruss2.scale.set(0.7, 1, 1)
    crossTruss2.position.set(0, 9.5, -24)
    // Stage stairs (front)
    volBox(6, 0.5, 1, matSub, 0, 0.25, -7.5)
    volBox(6, 0.25, 1, matSub, 0, 0.125, -8.5)
    createText('MAIN STAGE', 0, 11, -20, C_ACCENT, 10)

    // --- FOH BOOTH + DANCEFLOOR (z = -5 to 15) ---
    createZone(30, 20, matZone, 0, 0.02, 5) // dancefloor zone
    // FOH booth (front-of-house) — small platform at z=15
    volBox(6, 1, 3, matMain, 0, 0.5, 15)
    volBox(6, 1.2, 0.2, matGlass, 0, 1.6, 13.6) // FOH screen
    createText('FOH', 0, 2.5, 15, C_ACCENT, 6)
    // Dancefloor edge markers (4 corner circles)
    createCircle(1.5, 0.03, C_ACCENT, 0.5, 32)
    // Dancefloor bounding lines
    solidLine(new THREE.Vector3(-15, 0.05, -5), new THREE.Vector3(15, 0.05, -5), C_ACCENT, 0.5)
    solidLine(new THREE.Vector3(-15, 0.05, 13), new THREE.Vector3(15, 0.05, 13), C_ACCENT, 0.5)
    solidLine(new THREE.Vector3(-15, 0.05, -5), new THREE.Vector3(-15, 0.05, 13), C_ACCENT, 0.5)
    solidLine(new THREE.Vector3(15, 0.05, -5), new THREE.Vector3(15, 0.05, 13), C_ACCENT, 0.5)

    // --- VIP PLATFORMS (2 raised side platforms) ---
    for (const sx of [-1, 1]) {
      const x = sx * 30
      createZone(12, 18, matZone, x, 0.02, 5)
      volBox(12, 0.6, 18, matMain, x, 0.3, 5) // raised platform
      // Edge accent
      solidLine(
        new THREE.Vector3(x - 6, 0.65, -4), new THREE.Vector3(x + 6, 0.65, -4),
        C_ACCENT, 0.9,
      )
      solidLine(
        new THREE.Vector3(x - 6, 0.65, 14), new THREE.Vector3(x + 6, 0.65, 14),
        C_ACCENT, 0.9,
      )
      // VIP sofa + 2 stools
      const sofa = createLoungeSofa()
      sofa.position.set(x, 0.6, 0)
      scene.add(sofa)
      const stool1 = createBarStool()
      stool1.position.set(x - 3, 0.6, 6)
      scene.add(stool1)
      const stool2 = createBarStool()
      stool2.position.set(x + 3, 0.6, 6)
      scene.add(stool2)
      // Railing (glass panels around platform edge)
      for (const rz of [-4, 0, 4, 8, 12]) {
        const panelGeo = new THREE.PlaneGeometry(2, 0.8)
        const panel = new THREE.Mesh(panelGeo, matGlass)
        panel.position.set(x + sx * 6, 1.2, rz)
        panel.rotation.y = Math.PI / 2
        scene.add(panel)
        disposablesRef.current.push(panelGeo, panel)
      }
      createText(sx < 0 ? 'VIP A' : 'VIP B', x, 3.5, 5, C_ACCENT, 7)
      // Stairs down
      volBox(2, 0.3, 2, matSub, x + sx * 7, 0.15, 5)
      volBox(2, 0.15, 2, matSub, x + sx * 8, 0.075, 5)
    }

    // --- GUEST TABLES (rows at z = 20-35) ---
    type GuestTable = { group: THREE.Group; centerpiece: THREE.Group; phase: number }
    const guestTables: GuestTable[] = []
    const tablePositions: Array<[number, number]> = [
      // Row 1 (z=22)
      [-18, 22], [-9, 22], [0, 22], [9, 22], [18, 22],
      // Row 2 (z=30)
      [-18, 30], [-9, 30], [0, 30], [9, 30], [18, 30],
    ]
    for (let i = 0; i < tablePositions.length; i++) {
      const [tx, tz] = tablePositions[i]
      const g = new THREE.Group()
      // Round tabletop
      const topGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.08, 24)
      const top = new THREE.Mesh(topGeo, matMain)
      top.position.y = 0.75
      g.add(top)
      // Central pedestal
      g.add(makeCyl(0.1, 0.15, 0.75, matStruct, 0, 0.375, 0, 8))
      // Base
      g.add(makeCyl(0.4, 0.4, 0.05, matStruct, 0, 0.025, 0, 12))
      disposablesRef.current.push(topGeo, top)
      // 6 chairs around the table
      for (let c = 0; c < 6; c++) {
        const angle = (c / 6) * Math.PI * 2
        const chair = createBanquetChair()
        chair.position.set(Math.cos(angle) * 2.3, 0, Math.sin(angle) * 2.3)
        chair.rotation.y = -angle + Math.PI / 2
        g.add(chair)
      }
      // Centerpiece
      const cp = createCenterpiece()
      cp.position.set(0, 0.79, 0)
      g.add(cp)
      g.position.set(tx, 0, tz)
      scene.add(g)
      guestTables.push({ group: g, centerpiece: cp, phase: i * 0.5 })
    }

    // --- MAIN BAR + CATERING (z = 38-55) ---
    // Main bar (long counter at z=38, x=-15)
    volBox(10, 1.2, 2, matMain, -15, 0.6, 38)
    volBox(10, 0.1, 0.6, matAccent, -15, 1.3, 38.9) // bar top accent
    // Bar stools (5)
    for (let i = 0; i < 5; i++) {
      const stool = createBarStool()
      stool.position.set(-15 - 4 + i * 2, 0, 39.5)
      scene.add(stool)
    }
    // Back shelf behind bar
    volBox(10, 2, 0.4, matGlass, -15, 1.2, 36.8)
    createText('MAIN BAR', -15, 2.8, 38, C_ACCENT, 7)
    // Catering zone
    createZone(30, 16, matZone, 10, 0.02, 48)
    // Food trucks (2)
    const truck1 = createFoodTruck()
    truck1.position.set(5, 0, 48)
    scene.add(truck1)
    const truck2 = createFoodTruck()
    truck2.position.set(18, 0, 48)
    truck2.rotation.y = -0.3
    scene.add(truck2)
    // Picnic tables (4) near food trucks
    for (let i = 0; i < 4; i++) {
      const pt = createPicnicTable()
      pt.position.set(2 + i * 4, 0, 55)
      scene.add(pt)
    }
    // String lights overhead in catering zone
    createStringLights(-5, 42, 25, 42, 6)
    createStringLights(-5, 56, 25, 56, 6)
    createStringLights(-5, 42, -5, 56, 6)
    createStringLights(25, 42, 25, 56, 6)

    // --- ENTRANCE PLAZA (z = 65-80) ---
    // Plaza zone
    createZone(40, 18, matZone, 0, 0.02, 72)
    // Gate arch (2 pillars + top beam)
    volBox(1, 6, 1, matStruct, -10, 3, 65)
    volBox(1, 6, 1, matStruct, 10, 3, 65)
    volBox(22, 1, 1, matAccent, 0, 6, 65) // arch top
    createText('ENTRANCE', 0, 7.5, 65, C_ACCENT, 9)
    // Turnstiles (3 in a row at z=68)
    for (let i = 0; i < 3; i++) {
      const ts = createTurnstile()
      ts.position.set(-6 + i * 6, 0, 68)
      scene.add(ts)
    }
    // Planters (4 at plaza corners)
    for (const [px, pz] of [[-15, 65], [15, 65], [-15, 78], [15, 78]]) {
      const p = createPlanter()
      p.position.set(px, 0, pz)
      scene.add(p)
    }
    // Totems (2 at entrance sides)
    const totem1 = createTotem()
    totem1.position.set(-18, 0, 70)
    scene.add(totem1)
    const totem2 = createTotem()
    totem2.position.set(18, 0, 70)
    scene.add(totem2)
    // Welcome rug
    createZone(8, 12, matRug, 0, 0.04, 72)

    // --- BACKSTAGE + GENERATORS (z = -50 to -40) ---
    // Backstage containers (2)
    volBox(8, 2.5, 3, matMain, -12, 1.25, -45)
    volBox(8, 2.5, 3, matMain, 12, 1.25, -45)
    createText('BACKSTAGE', 0, 4, -45, C_ACCENT, 8)
    // Generators (2 boxes with cable lines)
    volBox(2, 1, 1.5, matStruct, -25, 0.5, -50)
    volBox(2, 1, 1.5, matStruct, 25, 0.5, -50)
    createText('GEN', -25, 1.5, -50, C_HIDDEN, 4)
    createText('GEN', 25, 1.5, -50, C_HIDDEN, 4)
    // Cable dashed lines from generators to stage
    dashedLine(
      new THREE.Vector3(-25, 0.1, -49), new THREE.Vector3(-20, 0.1, -31),
      C_HIDDEN, 0.5,
    )
    dashedLine(
      new THREE.Vector3(25, 0.1, -49), new THREE.Vector3(20, 0.1, -31),
      C_HIDDEN, 0.5,
    )

    // --- RESTROOMS (2 portacabins at z=50, x=±30) ---
    volBox(4, 2.5, 3, matMain, -32, 1.25, 50)
    volBox(4, 2.5, 3, matMain, 32, 1.25, 50)
    createText('WC', -32, 3, 50, C_HIDDEN, 5)
    createText('WC', 32, 3, 50, C_HIDDEN, 5)

    // --- LANDSCAPE BOLLARDS (perimeter lights) ---
    const bollardMat = new THREE.MeshBasicMaterial({
      color: C_HIDDEN, transparent: true, opacity: 0.7,
    })
    const bollardCount = isMobile ? 16 : 24
    for (let i = 0; i < bollardCount; i++) {
      const t = i / bollardCount
      const angle = t * Math.PI * 2
      const r = 75
      volCyl(0.1, 0.12, 0.6, bollardMat, Math.cos(angle) * r, 0.3, Math.sin(angle) * r, 8)
    }
    disposablesRef.current.push(bollardMat)

    // ============================================================
    // HOLO UI NODES (5 nodes — each with ring + dashed line + sphere + label)
    // ============================================================
    type HoloNode = {
      sphere: THREE.Mesh
      sphereMat: THREE.MeshPhongMaterial
      ring: THREE.Line
      ringMat: THREE.LineBasicMaterial
      baseY: number
      phase: number
    }
    const holoNodes: HoloNode[] = []
    const holoPositions: Array<[number, number, string]> = [
      [0, 5, 'STAGE'],
      [-30, 5, 'VIP A'],
      [30, 5, 'VIP B'],
      [-15, 5, 'BAR'],
      [0, 72, 'ENTRY'],
    ]
    for (let i = 0; i < holoPositions.length; i++) {
      const [hx, hz, label] = holoPositions[i]
      // Ground ring
      const ringLine = createCircle(2, 0.05, C_ACCENT, 0.7, 48)
      ringLine.position.set(hx, 0, hz)
      // Inner ring
      const innerRing = createCircle(1, 0.06, C_HIDDEN, 0.5, 32)
      innerRing.position.set(hx, 0, hz)
      // Dashed line from ground to sphere
      dashedLine(
        new THREE.Vector3(hx, 0.1, hz),
        new THREE.Vector3(hx, 5, hz),
        C_HIDDEN, 0.6,
      )
      // Sphere at top
      const sphereGeo = new THREE.SphereGeometry(0.5, 16, 12)
      const sphereMat = new THREE.MeshPhongMaterial({
        color: C_ACCENT,
        transparent: true,
        opacity: 0.85,
        emissive: C_ACCENT,
        emissiveIntensity: 0.6,
      })
      const sphere = new THREE.Mesh(sphereGeo, sphereMat)
      sphere.position.set(hx, 5, hz)
      scene.add(sphere)
      disposablesRef.current.push(sphereGeo, sphereMat, sphere)
      // Label
      createText(label, hx, 6.5, hz, C_ACCENT, 6)
      holoNodes.push({
        sphere,
        sphereMat,
        ring: ringLine,
        ringMat: ringLine.material as THREE.LineBasicMaterial,
        baseY: 5,
        phase: i * 1.2,
      })
    }

    // ============================================================
    // CROWD PARTICLES (additive blending, bobbing animation)
    // ============================================================
    const crowdCount = isMobile ? 60 : 120
    const crowdGeo = new THREE.BufferGeometry()
    const crowdPos = new Float32Array(crowdCount * 3)
    const crowdBase = new Float32Array(crowdCount * 3) // base positions for bobbing
    for (let i = 0; i < crowdCount; i++) {
      // Distribute in dancefloor area (z -5..13, x -14..14) with some clustering
      const cx = (Math.random() - 0.5) * 28
      const cz = -5 + Math.random() * 18
      crowdPos[i * 3] = cx
      crowdPos[i * 3 + 1] = 0.5 + Math.random() * 0.3
      crowdPos[i * 3 + 2] = cz
      crowdBase[i * 3] = cx
      crowdBase[i * 3 + 1] = crowdPos[i * 3 + 1]
      crowdBase[i * 3 + 2] = cz
    }
    crowdGeo.setAttribute('position', new THREE.BufferAttribute(crowdPos, 3))
    const crowdMat = new THREE.PointsMaterial({
      color: C_ACCENT,
      size: 0.45,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    })
    const crowdPoints = new THREE.Points(crowdGeo, crowdMat)
    scene.add(crowdPoints)
    disposablesRef.current.push(crowdGeo, crowdMat, crowdPoints)

    // ============================================================
    // ANIMATION LOOP — crowd bobbing + holo pulse + 3-phase camera
    // ============================================================
    const clock = new THREE.Clock()
    let isInView = true

    // Camera phase targets (lerped smoothly across phases).
    const targetStart = new THREE.Vector3(0, 2, 70)
    const targetPhase1End = new THREE.Vector3(0, 5, 30)
    const targetPhase2End = new THREE.Vector3(0, 0, 0)
    const posStart = new THREE.Vector3(0, 40, 90)
    const posPhase1End = new THREE.Vector3(0, 22, 55)
    const posPhase2End = new THREE.Vector3(0, 75, 95)

    // Smooth ease-in-out.
    const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)

    // Reusable temp vectors (avoid GC churn).
    const tmpPos = new THREE.Vector3()
    const tmpTarget = new THREE.Vector3()

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)
      // NOTE: getDelta() must be called BEFORE reading clock.elapsedTime —
      // getElapsedTime() internally calls getDelta(), so calling it first
      // would make the subsequent getDelta() return ~0.
      clock.getDelta()
      const elapsed = clock.elapsedTime

      // --- Crowd bobbing (vertical oscillation around base position) ---
      const posAttr = crowdGeo.getAttribute('position') as THREE.BufferAttribute
      for (let i = 0; i < crowdCount; i++) {
        const bx = crowdBase[i * 3]
        const by = crowdBase[i * 3 + 1]
        const bz = crowdBase[i * 3 + 2]
        const phase = i * 0.7
        const bob = Math.sin(elapsed * 3 + phase) * 0.15
        // Small horizontal sway
        const sway = Math.sin(elapsed * 1.5 + phase * 0.5) * 0.1
        posAttr.setXYZ(i, bx + sway, by + bob, bz)
      }
      posAttr.needsUpdate = true

      // --- Holo UI node pulsing (sphere scale + ring opacity + emissive) ---
      for (const node of holoNodes) {
        const pulse = 1 + Math.sin(elapsed * 2 + node.phase) * 0.18
        node.sphere.scale.setScalar(pulse)
        node.sphereMat.emissiveIntensity = 0.4 + Math.sin(elapsed * 3 + node.phase) * 0.3
        node.sphereMat.opacity = 0.7 + Math.sin(elapsed * 2 + node.phase) * 0.2
        node.ringMat.opacity = 0.5 + Math.sin(elapsed * 1.5 + node.phase) * 0.3
        // Sphere gentle hover
        node.sphere.position.y = node.baseY + Math.sin(elapsed * 1.2 + node.phase) * 0.3
      }

      // --- 3-phase cinematic camera ---
      if (elapsed < 4) {
        // Phase 1 (0-4s): fly-through toward dancefloor
        const t = easeInOut(elapsed / 4)
        tmpPos.lerpVectors(posStart, posPhase1End, t)
        tmpTarget.lerpVectors(targetStart, targetPhase1End, t)
        camera.position.copy(tmpPos)
        camTarget.copy(tmpTarget)
      } else if (elapsed < 8) {
        // Phase 2 (4-8s): pull-up to overhead
        const t = easeInOut((elapsed - 4) / 4)
        tmpPos.lerpVectors(posPhase1End, posPhase2End, t)
        tmpTarget.lerpVectors(targetPhase1End, targetPhase2End, t)
        camera.position.copy(tmpPos)
        camTarget.copy(tmpTarget)
      } else {
        // Phase 3 (8s+): continuous orbit around venue center
        const orbitT = elapsed - 8
        const angle = orbitT * 0.08
        const radius = 95
        const yOscillate = 55 + Math.sin(orbitT * 0.2) * 15
        camera.position.set(
          Math.cos(angle) * radius,
          yOscillate,
          Math.sin(angle) * radius,
        )
        camTarget.set(0, 0, 0)
      }
      camera.lookAt(camTarget)

      renderer.render(scene, camera)
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
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatioCap))
      }, 250)
    }
    window.addEventListener('resize', onResize)

    // === CLEANUP ===
    return () => {
      cancelAnimationFrame(animationIdRef.current)
      visibilityObserver.disconnect()
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
      renderer.dispose()
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
