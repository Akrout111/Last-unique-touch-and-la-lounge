'use client'
/* eslint-disable @typescript-eslint/no-non-null-assertion, react-hooks/exhaustive-deps */

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

// ========== CONFIG (Centralized tuning parameters) ==========
const CONFIG = {
  // Cinematic camera animation duration (starts instantly on page load — no intro overlay).
  INTRO_DURATION: 5.0,
  POST_PROCESS_DELAY_MS: 400,
  MAX_PIXEL_RATIO: { mobile: 1.5, desktop: 2 },
  MOUSE_SMOOTHING: 0.045,
  STAR_COUNT: {
    mobile: { deep: 300, mid: 200 },
    desktop: { deep: 900, mid: 600 },
  },
  DUST_COUNT: { mobile: 400, desktop: 1200 },
  SHOOTING_STAR_COUNT: 3,
  AURORA_BRIGHTNESS_BOOST: 1.25,
}

// ========== SHADERS ==========

const NEBULA_VERT = `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`

const NEBULA_FRAG = `
  uniform float uTime,uOpacity,uIntro; uniform vec3 uC1,uC2,uC3; varying vec2 vUv;
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
  float snoise(vec2 v){
    const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
    vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);
    vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
    vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod289(i);
    vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
    vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
    m=m*m; m=m*m;
    vec3 x=2.0*fract(p*C.www)-1.0; vec3 h=abs(x)-0.5; vec3 ox=floor(x+0.5); vec3 a0=x-ox;
    m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
    vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
    return 130.0*dot(m,g);
  }
  float fbm(vec2 p){float v=0.0,a=0.5;for(int i=0;i<5;i++){v+=a*snoise(p);p*=2.1;a*=0.47;}return v;}
  void main(){
    vec2 uv=vUv; float t=uTime*0.02;
    float n1=fbm(uv*2.0+vec2(t*0.7,t*0.4));
    float n2=fbm(uv*1.5-vec2(t*0.5,t*0.8));
    float n3=fbm(uv*2.8+vec2(t*0.3,-t*0.6));
    vec3 col=mix(uC1,uC2,n1*0.5+0.5);
    col=mix(col,uC3,n2*0.35+0.15);
    float alpha=smoothstep(-0.35,0.55,n1)*smoothstep(-0.25,0.45,n3)*uOpacity;
    alpha*=(0.78+0.22*sin(uTime*0.12+n2*6.28));
    alpha*=smoothstep(0.0,0.15,uIntro)*smoothstep(1.0,0.7,uIntro);
    gl_FragColor=vec4(col*1.15,alpha);
  }
`

const STAR_VERT = `
  attribute float aSize,aTwSpd,aTwOff,aLayer,aVarP,aVarA,aRevealDelay;
  attribute vec3 aColor;
  uniform float uTime,uPR,uMX,uMY,uIntro;
  varying vec3 vColor; varying float vTw,vDist,vLayer,vVar,vReveal;
  void main(){
    vColor=aColor; vLayer=aLayer;
    float reveal=smoothstep(aRevealDelay,aRevealDelay+0.35,uIntro);
    vReveal=reveal;
    vec3 pos=position;
    float ps=0.2+aLayer*0.8;
    pos.x+=uMX*ps*(1.0+aLayer*2.0);
    pos.y+=uMY*ps*(1.0+aLayer*2.0);
    float warp = smoothstep(0.0, 0.25, uIntro) * smoothstep(0.45, 0.15, uIntro);
    pos.z += warp * 15.0 * (1.0 - aLayer * 0.3);
    vec4 mv=modelViewMatrix*vec4(pos,1.0);
    float tw=sin(uTime*aTwSpd+aTwOff); tw=tw*tw; vTw=tw;
    float var=1.0+aVarA*sin(uTime*aVarP); vVar=var;
    float sz=aSize*(420.0/max(-mv.z,1.0));
    sz*=(0.75+tw*0.45)*var;
    float growReveal = reveal * (1.0 + 0.15 * sin(reveal * 3.14159));
    sz*=growReveal;
    gl_PointSize=clamp(sz*uPR,0.5,55.0);
    gl_Position=projectionMatrix*mv;
    vDist=-mv.z;
  }
`

const STAR_FRAG = `
  varying vec3 vColor; varying float vTw,vDist,vLayer,vVar,vReveal;
  void main(){
    vec2 c=gl_PointCoord-vec2(0.5); float d=length(c);
    if(d>0.5)discard;
    float glow=1.0-smoothstep(0.0,0.5,d); glow=pow(glow,3.2);
    float core=smoothstep(0.08,0.0,d);
    float inner=smoothstep(0.18,0.0,d)*0.5;
    float sharpRing=smoothstep(0.28,0.22,d)*0.25;
    vec3 coreCol=vColor*(3.0+vTw*1.2)*vVar;
    vec3 haloCol=vColor*(0.5+vTw*0.2)*vVar;
    vec3 innerCol=vColor*(1.2+vTw*0.4)*vVar;
    vec3 ringCol=vColor*(0.8+vTw*0.3)*vVar;
    vec3 fin=mix(haloCol,innerCol,inner);
    fin=mix(fin,ringCol,sharpRing);
    fin=mix(fin,coreCol,core);
    float fade=smoothstep(180.0,10.0,vDist);
    float alpha=glow*(0.65+vTw*0.45)*fade;
    if(vLayer>0.5)alpha*=0.65;
    if(vLayer>0.8)alpha*=0.8;
    alpha*=vReveal;
    gl_FragColor=vec4(fin,alpha);
  }
`

const DUST_VERT = `
  attribute float aSize,aAlpha,aSpeed,aTurb,aRevealDelay;
  uniform float uTime,uPR,uIntro;
  varying float vAlpha,vDist,vGlow,vReveal;
  void main(){
    float reveal=smoothstep(aRevealDelay,aRevealDelay+0.3,uIntro);
    vReveal=reveal;
    vec3 pos=position;
    float t=uTime;
    pos.y+=sin(t*aSpeed+position.x*0.5)*aTurb;
    pos.x+=cos(t*aSpeed*0.6+position.y*0.3)*aTurb*0.7;
    vec4 mv=modelViewMatrix*vec4(pos,1.0);
    float sz=aSize*(240.0/max(-mv.z,1.0));
    sz*=reveal;
    gl_PointSize=clamp(sz*uPR,0.2,5.0);
    gl_Position=projectionMatrix*mv;
    vAlpha=aAlpha; vDist=-mv.z;
    vGlow=sin(t*aSpeed*2.0+position.x)*0.5+0.5;
  }
`

const DUST_FRAG = `
  varying float vAlpha,vDist,vGlow,vReveal;
  void main(){
    vec2 c=gl_PointCoord-vec2(0.5); float d=length(c);
    if(d>0.5)discard;
    float glow=1.0-smoothstep(0.0,0.5,d); glow=pow(glow,1.6);
    float fade=smoothstep(85.0,6.0,vDist);
    float alpha=glow*vAlpha*fade*(0.5+vGlow*0.3)*0.55;
    alpha*=vReveal;
    vec3 col=mix(vec3(0.97,0.76,0.15),vec3(0.96,0.88,0.55),vGlow);
    gl_FragColor=vec4(col,alpha);
  }
`

const AURORA_VERT = `
  varying vec2 vUv; varying float vH;
  void main(){vUv=uv; vH=position.y; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}
`

const AURORA_FRAG = `
  uniform float uTime,uIntro,uBrightness; uniform vec3 uC1,uC2; varying vec2 vUv; varying float vH;
  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float smoothN(vec2 p){
    vec2 i=floor(p); vec2 f=fract(p);
    f=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }
  float fbm(vec2 p){float v=0.0,a=0.5;for(int i=0;i<4;i++){v+=a*smoothN(p);p*=2.03;a*=0.5;}return v;}
  void main(){
    float t=uTime*0.06;
    vec2 uv=vUv*vec2(4.0,1.0);
    float n=fbm(uv+vec2(t,t*0.25));
    float n2=fbm(uv*1.3-vec2(t*0.4,t*0.15));
    float shape=smoothstep(0.32,0.68,n)*smoothstep(0.22,0.58,n2);
    shape*=smoothstep(0.0,0.25,vUv.y)*smoothstep(1.0,0.65,vUv.y);
    vec3 col=mix(uC1,uC2,n);
    col = pow(col, vec3(0.85));
    col *= uBrightness;
    float alpha=shape*0.55*(0.8+0.2*sin(uTime*0.4));
    alpha*=smoothstep(0.0,0.2,uIntro);
    gl_FragColor=vec4(col,alpha);
  }
`

// ========== TEXTURES ==========

function makeSoftTex(): THREE.CanvasTexture {
  const c = document.createElement('canvas'); c.width = 128; c.height = 128
  const x = c.getContext('2d')!
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.1, 'rgba(255,248,235,0.95)')
  g.addColorStop(0.35, 'rgba(245,200,90,0.45)')
  g.addColorStop(0.7, 'rgba(170,100,220,0.1)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  x.fillStyle = g; x.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

function makeGlowTex(): THREE.CanvasTexture {
  const c = document.createElement('canvas'); c.width = 256; c.height = 256
  const x = c.getContext('2d')!
  const g = x.createRadialGradient(128, 128, 0, 128, 128, 128)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.12, 'rgba(255,245,220,0.65)')
  g.addColorStop(0.4, 'rgba(245,200,100,0.2)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  x.fillStyle = g; x.fillRect(0, 0, 256, 256)
  return new THREE.CanvasTexture(c)
}

// ========== SHOOTING STARS ==========

interface ShootingStar {
  line: THREE.Line
  geo: THREE.BufferGeometry
  mat: THREE.LineBasicMaterial
  hPoint: THREE.Points
  hGeo: THREE.BufferGeometry
  hMat: THREE.PointsMaterial
  active: boolean
  pts: THREE.Vector3[]
  life: number
  timer: number
  vel: THREE.Vector3
}

class ShootingStars {
  scene: THREE.Scene
  stars: ShootingStar[]
  glowTex: THREE.CanvasTexture

  constructor(scene: THREE.Scene, count = 3) {
    this.scene = scene
    this.stars = []
    this.glowTex = makeGlowTex()
    for (let i = 0; i < count; i++) {
      const geo = new THREE.BufferGeometry()
      const pos = new Float32Array(20 * 3)
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      const mat = new THREE.LineBasicMaterial({
        color: 0xfff8dc, transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, depthWrite: false,
      })
      const line = new THREE.Line(geo, mat)
      scene.add(line)

      const hGeo = new THREE.BufferGeometry()
      const hPos = new Float32Array([0, 0, 0])
      hGeo.setAttribute('position', new THREE.BufferAttribute(hPos, 3))
      const hMat = new THREE.PointsMaterial({
        size: 5, map: this.glowTex, transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, depthWrite: false,
      })
      const hPoint = new THREE.Points(hGeo, hMat)
      scene.add(hPoint)

      this.stars.push({
        line, geo, mat, hPoint, hGeo, hMat,
        active: false, pts: [], life: 0, timer: 999, vel: new THREE.Vector3(),
      })
    }
  }

  update(dt: number, introProgress: number) {
    if (introProgress < 0.55) return
    this.stars.forEach((s) => {
      if (!s.active) {
        s.timer -= dt
        if (s.timer <= 0) { this.spawn(s); s.timer = 4 + Math.random() * 10 }
        return
      }
      s.life -= dt * 0.85
      const head = s.pts[0]
      head.x += s.vel.x * dt * 50; head.y += s.vel.y * dt * 50; head.z += s.vel.z * dt * 50
      for (let i = s.pts.length - 1; i > 0; i--) s.pts[i].lerp(s.pts[i - 1], 0.22)
      const arr = s.geo.attributes.position.array as Float32Array
      for (let i = 0; i < s.pts.length; i++) {
        arr[i * 3] = s.pts[i].x; arr[i * 3 + 1] = s.pts[i].y; arr[i * 3 + 2] = s.pts[i].z
      }
      s.geo.attributes.position.needsUpdate = true
      const hArr = s.hGeo.attributes.position.array as Float32Array
      hArr[0] = head.x; hArr[1] = head.y; hArr[2] = head.z
      s.hGeo.attributes.position.needsUpdate = true
      const fade = Math.max(0, s.life)
      s.mat.opacity = fade * 0.88
      s.hMat.opacity = fade * 0.65
      s.hMat.size = 3 + fade * 5
      if (s.life <= 0 || head.y < -55 || Math.abs(head.x) > 90) {
        s.active = false; s.mat.opacity = 0; s.hMat.opacity = 0
      }
    })
  }

  spawn(s: ShootingStar) {
    s.active = true; s.life = 1.0
    const sx = (Math.random() - 0.5) * 85, sy = 28 + Math.random() * 18, sz = (Math.random() - 0.5) * 20
    s.pts = []
    for (let i = 0; i < 20; i++) s.pts.push(new THREE.Vector3(sx, sy, sz))
    const ang = -Math.PI / 4 + (Math.random() - 0.5) * 0.6, sp = 0.35 + Math.random() * 0.35
    s.vel.set(Math.cos(ang) * sp, -Math.sin(Math.abs(ang)) * sp, (Math.random() - 0.5) * 0.08)
    const arr = s.geo.attributes.position.array as Float32Array
    for (let i = 0; i < 20; i++) { arr[i * 3] = sx; arr[i * 3 + 1] = sy; arr[i * 3 + 2] = sz }
    s.geo.attributes.position.needsUpdate = true
    s.hMat.opacity = 0.65
  }

  dispose() {
    this.glowTex.dispose()
    this.stars.forEach((s) => {
      this.scene.remove(s.line); s.geo.dispose(); s.mat.dispose()
      this.scene.remove(s.hPoint); s.hGeo.dispose(); s.hMat.dispose()
    })
  }
}

// ========== HELPERS ==========

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

function noise(t: number): number {
  return Math.sin(t) * 0.5 + Math.sin(t * 2.1) * 0.25 + Math.sin(t * 4.3) * 0.125
}

function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x)
}

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
}

// ========== COMPONENT ==========

// Detect WebGL support once (lazily, module scope) — component is client-only.
let webglSupported: boolean | null = null
function detectWebGL(): boolean {
  if (webglSupported !== null) return webglSupported
  try {
    const tc = document.createElement('canvas')
    webglSupported = !!(window.WebGLRenderingContext && (tc.getContext('webgl') || tc.getContext('experimental-webgl')))
  } catch {
    webglSupported = false
  }
  return webglSupported
}

// Detect reduced-motion preference once (module scope, lazy).
let reducedMotion: boolean | null = null
function detectReducedMotion(): boolean {
  if (reducedMotion !== null) return reducedMotion
  reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  return reducedMotion
}

export default function CosmicBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [postProcess, setPostProcess] = useState(false)
  // cinematicReady flips on after the WebGL scene has rendered a few frames, then a
  // black overlay fades out (opacity 1 → 0) revealing the scene. This is the entry
  // animation the user sees on first visit — elegant fade-in instead of a "zoom-in
  // from far" that framed a tiny patch in the middle of black.
  const [cinematicReady, setCinematicReady] = useState(false)

  // These are computed once at module scope (client-only component).
  const glOk = detectWebGL()
  const showFallback = !glOk
  const reduced = detectReducedMotion()

  // Trigger post-processing overlays (vignette/grain/etc.) once the scene is up.
  // Then start the cinematic fade-in shortly after — so the user sees an animated
  // entrance (camera move + fade) the moment they enter the site.
  useEffect(() => {
    const readyTimer = setTimeout(() => setCinematicReady(true), 80)
    const ppTimer = setTimeout(() => setPostProcess(true), CONFIG.POST_PROCESS_DELAY_MS)
    return () => { clearTimeout(readyTimer); clearTimeout(ppTimer) }
  }, [])

  // WebGL scene
  useEffect(() => {
    const container = containerRef.current
    if (!container || !glOk) return

    const isMobile = window.innerWidth < 768
    const dpr = Math.min(window.devicePixelRatio, isMobile ? CONFIG.MAX_PIXEL_RATIO.mobile : CONFIG.MAX_PIXEL_RATIO.desktop)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x03020a)
    scene.fog = new THREE.FogExp2(0x03020a, 0.012)

    const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 1000)
    // Cinematic entry: camera begins slightly offset + pulled back, then eases to its
    // framing position. This creates motion WITHOUT the ugly "tiny patch in the
    // middle of black" — because the scene already fills the frame at z=35 (close
    // enough that nebula/stars cover the whole viewport). A black fade-in overlay
    // (in JSX) hides the first ~80ms so the camera settle looks like a deliberate
    // cinematic reveal rather than a sudden snap.
    camera.position.set(8, 4, 35)

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: false,
      powerPreference: 'high-performance',
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(dpr)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    container.appendChild(renderer.domElement)

    // Lights
    scene.add(new THREE.AmbientLight(0x120820, 0.65))
    const keyLight = new THREE.PointLight(0xe8b84a, 1.8, 160); keyLight.position.set(22, 16, 10); scene.add(keyLight)
    const fillLight = new THREE.PointLight(0x6b21a8, 1.4, 130); fillLight.position.set(-20, -10, -6); scene.add(fillLight)
    const rimLight = new THREE.PointLight(0x3b1d6b, 0.8, 110); rimLight.position.set(0, -24, -16); scene.add(rimLight)

    // INTRO STATE
    let introProgress = 0
    const INTRO_DURATION = reduced ? 2.0 : CONFIG.INTRO_DURATION

    // NEBULA
    const nebGroup = new THREE.Group(); scene.add(nebGroup)
    const nebMats: THREE.ShaderMaterial[] = []
    const nebGeos: THREE.PlaneGeometry[] = []
    const nebCfgs = [
      { c1: new THREE.Color(0x1a0a3d), c2: new THREE.Color(0x4c1d8a), c3: new THREE.Color(0x0a0418), op: 0.08, pos: [-15, 12, -42] as [number, number, number], sc: [50, 32, 1] as [number, number, number], spin: 0.0015 },
      { c1: new THREE.Color(0x3d2800), c2: new THREE.Color(0xc4951a), c3: new THREE.Color(0x5c3a00), op: 0.06, pos: [18, 8, -36] as [number, number, number], sc: [42, 28, 1] as [number, number, number], spin: -0.0012 },
      { c1: new THREE.Color(0x0a0825), c2: new THREE.Color(0x312e81), c3: new THREE.Color(0x050210), op: 0.07, pos: [5, -14, -48] as [number, number, number], sc: [58, 36, 1] as [number, number, number], spin: 0.0008 },
      { c1: new THREE.Color(0x1e0b4d), c2: new THREE.Color(0x5b21b6), c3: new THREE.Color(0x0f0520), op: 0.05, pos: [-8, -5, -55] as [number, number, number], sc: [65, 40, 1] as [number, number, number], spin: -0.001 },
    ]
    nebCfgs.forEach((cfg) => {
      const geo = new THREE.PlaneGeometry(1, 1, 1, 1)
      nebGeos.push(geo)
      const mat = new THREE.ShaderMaterial({
        vertexShader: NEBULA_VERT, fragmentShader: NEBULA_FRAG,
        uniforms: {
          uTime: { value: 0 }, uC1: { value: cfg.c1 }, uC2: { value: cfg.c2 }, uC3: { value: cfg.c3 },
          uOpacity: { value: cfg.op }, uIntro: { value: 0 },
        },
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      })
      nebMats.push(mat)
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(...cfg.pos); mesh.scale.set(...cfg.sc)
      mesh.userData.spin = cfg.spin
      mesh.userData.basePos = cfg.pos.slice()
      nebGroup.add(mesh)
    })

    // STARS
    const starGroup = new THREE.Group(); scene.add(starGroup)
    const starPalette = [
      new THREE.Color(0xffffff), new THREE.Color(0xfff4e8), new THREE.Color(0xfff2c8),
      new THREE.Color(0xffd2a8), new THREE.Color(0xc2c8ff), new THREE.Color(0xb8c5ff),
    ]

    interface StarLayer { geo: THREE.BufferGeometry; mat: THREE.ShaderMaterial }
    function createStarLayer(count: number, zMin: number, zMax: number, sizeMin: number, sizeMax: number, layerVal: number): StarLayer {
      const geo = new THREE.BufferGeometry()
      const pos = new Float32Array(count * 3), col = new Float32Array(count * 3)
      const sz = new Float32Array(count), twSpd = new Float32Array(count)
      const twOff = new Float32Array(count), dep = new Float32Array(count)
      const varP = new Float32Array(count), varA = new Float32Array(count)
      const revealDel = new Float32Array(count)
      for (let i = 0; i < count; i++) {
        const angle = (Math.random() - 0.5) * Math.PI * 0.7
        const dist = 20 + Math.random() * 100
        pos[i * 3] = Math.cos(angle) * dist + (Math.random() - 0.5) * 30
        pos[i * 3 + 1] = Math.sin(angle) * dist * 0.4 + (Math.random() - 0.5) * 50
        pos[i * 3 + 2] = zMin + Math.random() * (zMax - zMin)
        const c = starPalette[Math.floor(Math.random() * starPalette.length)]
        col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
        sz[i] = sizeMin + Math.random() * (sizeMax - sizeMin)
        twSpd[i] = 0.2 + Math.random() * 1.5
        twOff[i] = Math.random() * Math.PI * 2
        dep[i] = layerVal + Math.random() * 0.3
        varP[i] = 0.04 + Math.random() * 0.1
        varA[i] = Math.random() * 0.2
        revealDel[i] = Math.random() * 0.9
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3))
      geo.setAttribute('aSize', new THREE.BufferAttribute(sz, 1))
      geo.setAttribute('aTwSpd', new THREE.BufferAttribute(twSpd, 1))
      geo.setAttribute('aTwOff', new THREE.BufferAttribute(twOff, 1))
      geo.setAttribute('aLayer', new THREE.BufferAttribute(dep, 1))
      geo.setAttribute('aVarP', new THREE.BufferAttribute(varP, 1))
      geo.setAttribute('aVarA', new THREE.BufferAttribute(varA, 1))
      geo.setAttribute('aRevealDelay', new THREE.BufferAttribute(revealDel, 1))
      const mat = new THREE.ShaderMaterial({
        vertexShader: STAR_VERT, fragmentShader: STAR_FRAG,
        uniforms: { uTime: { value: 0 }, uPR: { value: dpr }, uMX: { value: 0 }, uMY: { value: 0 }, uIntro: { value: 0 } },
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      })
      return { geo, mat }
    }

    const starCounts = isMobile ? CONFIG.STAR_COUNT.mobile : CONFIG.STAR_COUNT.desktop
    // Only small, faint background stars remain (deep + mid layers). The foreground
    // layer and flare stars (large bright stars with diffraction spikes) were removed
    // per design request — keep only the small stars sitting behind the aurora.
    const deepLayer = createStarLayer(starCounts.deep, -100, -25, 0.3, 0.7, 0)
    const midLayer = createStarLayer(starCounts.mid, -55, -10, 0.4, 0.9, 0.4)
    starGroup.add(new THREE.Points(deepLayer.geo, deepLayer.mat))
    starGroup.add(new THREE.Points(midLayer.geo, midLayer.mat))

    // Dust (kept — tiny particles behind aurora, not big stars)
    const dustCount = isMobile ? CONFIG.DUST_COUNT.mobile : CONFIG.DUST_COUNT.desktop
    const dustGeo = new THREE.BufferGeometry()
    const dPos = new Float32Array(dustCount * 3), dSize = new Float32Array(dustCount)
    const dAlpha = new Float32Array(dustCount), dSpeed = new Float32Array(dustCount)
    const dTurb = new Float32Array(dustCount), dReveal = new Float32Array(dustCount)
    for (let i = 0; i < dustCount; i++) {
      dPos[i * 3] = (Math.random() - 0.5) * 65
      dPos[i * 3 + 1] = (Math.random() - 0.5) * 45
      dPos[i * 3 + 2] = (Math.random() - 0.5) * 25 + 4
      dSize[i] = 0.25 + Math.random() * 0.7
      dAlpha[i] = 0.12 + Math.random() * 0.35
      dSpeed[i] = 0.15 + Math.random() * 0.8
      dTurb[i] = 0.25 + Math.random() * 1.2
      dReveal[i] = 0.4 + Math.random() * 0.5
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3))
    dustGeo.setAttribute('aSize', new THREE.BufferAttribute(dSize, 1))
    dustGeo.setAttribute('aAlpha', new THREE.BufferAttribute(dAlpha, 1))
    dustGeo.setAttribute('aSpeed', new THREE.BufferAttribute(dSpeed, 1))
    dustGeo.setAttribute('aTurb', new THREE.BufferAttribute(dTurb, 1))
    dustGeo.setAttribute('aRevealDelay', new THREE.BufferAttribute(dReveal, 1))
    const dustMat = new THREE.ShaderMaterial({
      vertexShader: DUST_VERT, fragmentShader: DUST_FRAG,
      uniforms: { uTime: { value: 0 }, uPR: { value: dpr }, uIntro: { value: 0 } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    })
    starGroup.add(new THREE.Points(dustGeo, dustMat))

    // Shooting stars
    const shootingStars = new ShootingStars(scene, CONFIG.SHOOTING_STAR_COUNT)

    // Orbit rings
    const orbitGroup = new THREE.Group()
    orbitGroup.position.set(0, 0, -12)
    scene.add(orbitGroup)

    const softTex = makeSoftTex()
    const glowTex = makeGlowTex()

    interface OrbitRing {
      grp: THREE.Group
      rGeo: THREE.RingGeometry; gGeo: THREE.RingGeometry; pGeo: THREE.BufferGeometry
      rMat: THREE.MeshBasicMaterial; gMat: THREE.MeshBasicMaterial; pMat: THREE.PointsMaterial
      pPos: Float32Array; pVel: Float32Array
    }
    function createOrbit(radius: number, colorHex: number, _opacity: number, rx: number, ry: number, rz: number): OrbitRing {
      const grp = new THREE.Group()
      const rGeo = new THREE.RingGeometry(radius, radius + 0.05, 200)
      const rMat = new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })
      grp.add(new THREE.Mesh(rGeo, rMat))
      const gGeo = new THREE.RingGeometry(radius - 0.45, radius + 0.5, 200)
      const gMat = new THREE.MeshBasicMaterial({ color: colorHex, transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })
      grp.add(new THREE.Mesh(gGeo, gMat))
      const pearlCount = 5
      const pGeo = new THREE.BufferGeometry()
      const pPos = new Float32Array(pearlCount * 3)
      const pVel = new Float32Array(pearlCount)
      for (let i = 0; i < pearlCount; i++) {
        const a = (i / pearlCount) * Math.PI * 2
        pPos[i * 3] = Math.cos(a) * radius
        pPos[i * 3 + 1] = Math.sin(a) * radius
        pPos[i * 3 + 2] = 0
        pVel[i] = 0.2 + Math.random() * 0.3
      }
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
      const pMat = new THREE.PointsMaterial({ size: 0.6, map: softTex, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
      grp.add(new THREE.Points(pGeo, pMat))
      grp.rotation.x = rx; grp.rotation.y = ry; grp.rotation.z = rz
      return { grp, rGeo, gGeo, pGeo, rMat, gMat, pMat, pPos, pVel }
    }

    const ring1 = createOrbit(17, 0xf5b914, 0.16, Math.PI / 3.2, Math.PI / 5.5, 0)
    const ring2 = createOrbit(29, 0xc9a24b, 0.11, -Math.PI / 3.8, Math.PI / 3.2, 0)
    const ring3 = createOrbit(23, 0x7e22ce, 0.08, Math.PI / 4.5, -Math.PI / 2.8, 0)
    orbitGroup.add(ring1.grp); orbitGroup.add(ring2.grp); orbitGroup.add(ring3.grp)

    // AURORA
    const auroraBrightness = CONFIG.AURORA_BRIGHTNESS_BOOST
    const auroraBottomGeo = new THREE.PlaneGeometry(90, 18, 1, 1)
    const auroraBottomMat = new THREE.ShaderMaterial({
      vertexShader: AURORA_VERT, fragmentShader: AURORA_FRAG,
      uniforms: { uTime: { value: 0 }, uC1: { value: new THREE.Color(0x34d399) }, uC2: { value: new THREE.Color(0xa855f7) }, uIntro: { value: 0 }, uBrightness: { value: auroraBrightness } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    })
    const auroraBottom = new THREE.Mesh(auroraBottomGeo, auroraBottomMat)
    auroraBottom.position.set(0, -22, -30); auroraBottom.rotation.x = 0.15
    scene.add(auroraBottom)

    const auroraMidGeo = new THREE.PlaneGeometry(85, 15, 1, 1)
    const auroraMidMat = new THREE.ShaderMaterial({
      vertexShader: AURORA_VERT, fragmentShader: AURORA_FRAG,
      uniforms: { uTime: { value: 0 }, uC1: { value: new THREE.Color(0xf472b6) }, uC2: { value: new THREE.Color(0xec4899) }, uIntro: { value: 0 }, uBrightness: { value: auroraBrightness } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    })
    const auroraMid = new THREE.Mesh(auroraMidGeo, auroraMidMat)
    auroraMid.position.set(5, 2, -32); auroraMid.rotation.x = -0.08; auroraMid.rotation.y = 0.1
    scene.add(auroraMid)

    const auroraTopGeo = new THREE.PlaneGeometry(80, 14, 1, 1)
    const auroraTopMat = new THREE.ShaderMaterial({
      vertexShader: AURORA_VERT, fragmentShader: AURORA_FRAG,
      uniforms: { uTime: { value: 0 }, uC1: { value: new THREE.Color(0xfde047) }, uC2: { value: new THREE.Color(0xf97316) }, uIntro: { value: 0 }, uBrightness: { value: auroraBrightness } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    })
    const auroraTop = new THREE.Mesh(auroraTopGeo, auroraTopMat)
    auroraTop.position.set(-3, 24, -28); auroraTop.rotation.x = -0.2; auroraTop.rotation.y = -0.05
    scene.add(auroraTop)

    // Lens flares
    const flareSprites: { sprite: THREE.Sprite; mat: THREE.SpriteMaterial; baseOp: number; phase: number }[] = []
    const glowTex2 = makeGlowTex()
    const flareCfgs = [
      { pos: [26, 18, 6] as [number, number, number], color: 0xf5b914, size: 9, intensity: 0.2, phase: 0.0 },
      { pos: [-24, -14, -8] as [number, number, number], color: 0x7e22ce, size: 11, intensity: 0.16, phase: 1.7 },
      { pos: [0, 26, -16] as [number, number, number], color: 0xc9a24b, size: 6, intensity: 0.12, phase: 3.3 },
    ]
    flareCfgs.forEach((fc) => {
      const mat = new THREE.SpriteMaterial({ map: glowTex2, color: fc.color, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
      const sprite = new THREE.Sprite(mat)
      sprite.position.set(...fc.pos); sprite.scale.set(fc.size, fc.size, 1)
      scene.add(sprite)
      flareSprites.push({ sprite, mat, baseOp: fc.intensity, phase: fc.phase })
    })

    // God rays
    const rayGroup = new THREE.Group(); scene.add(rayGroup)
    for (let i = 0; i < 4; i++) {
      const c = document.createElement('canvas'); c.width = 64; c.height = 256
      const x = c.getContext('2d')!
      const g = x.createLinearGradient(32, 0, 32, 256)
      const alpha = 0.04 + Math.random() * 0.03
      g.addColorStop(0, `rgba(240,200,100,${alpha})`)
      g.addColorStop(0.4, `rgba(240,200,100,${alpha * 0.35})`)
      g.addColorStop(1, 'rgba(240,200,100,0)')
      x.fillStyle = g; x.fillRect(0, 0, 64, 256)
      const tex = new THREE.CanvasTexture(c)
      const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
      const geo = new THREE.PlaneGeometry(2 + Math.random() * 4, 18 + Math.random() * 15)
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set((Math.random() - 0.5) * 45, 14 + Math.random() * 12, -8 + Math.random() * 10)
      mesh.rotation.z = -0.25 + Math.random() * 0.5
      mesh.material.opacity = 0
      rayGroup.add(mesh)
    }

    // Mouse / Touch
    let mouseX = 0, mouseY = 0, tMX = 0, tMY = 0
    const onMouseMove = (e: MouseEvent) => {
      tMX = (e.clientX / window.innerWidth) * 2 - 1
      tMY = -(e.clientY / window.innerHeight) * 2 + 1
    }
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        tMX = (e.touches[0].clientX / window.innerWidth) * 2 - 1
        tMY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1
      }
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    // ANIMATION
    const clock = new THREE.Clock()
    let animId = 0
    let introComplete = false

    const animate = () => {
      animId = requestAnimationFrame(animate)
      if (document.hidden) return
      const dt = Math.min(clock.getDelta(), 0.05)
      const t = clock.getElapsedTime()

      if (!introComplete) {
        introProgress = Math.min(t / INTRO_DURATION, 1.0)
        if (introProgress >= 1.0) introComplete = true
      }
      const easedIntro = easeOutExpo(introProgress)

      mouseX += (tMX - mouseX) * CONFIG.MOUSE_SMOOTHING
      mouseY += (tMY - mouseY) * CONFIG.MOUSE_SMOOTHING

      nebMats.forEach((m) => { m.uniforms.uTime.value = t; m.uniforms.uIntro.value = easedIntro })
      deepLayer.mat.uniforms.uTime.value = t; deepLayer.mat.uniforms.uPR.value = dpr
      deepLayer.mat.uniforms.uMX.value = mouseX; deepLayer.mat.uniforms.uMY.value = mouseY
      deepLayer.mat.uniforms.uIntro.value = easedIntro
      midLayer.mat.uniforms.uTime.value = t; midLayer.mat.uniforms.uPR.value = dpr
      midLayer.mat.uniforms.uMX.value = mouseX; midLayer.mat.uniforms.uMY.value = mouseY
      midLayer.mat.uniforms.uIntro.value = easedIntro
      dustMat.uniforms.uTime.value = t; dustMat.uniforms.uPR.value = dpr
      dustMat.uniforms.uIntro.value = easedIntro

      // Nebula drift
      nebGroup.children.forEach((mesh: THREE.Object3D, i: number) => {
        mesh.rotation.z = mesh.userData.spin * t
        const base = mesh.userData.basePos as number[]
        mesh.position.y = base[1] + Math.sin(t * 0.015 + i * 1.7) * 0.6
        mesh.position.x = base[0] + Math.cos(t * 0.012 + i * 2.1) * 0.4
      })

      shootingStars.update(dt, easedIntro)

      const ringReveal = smoothstep(0.35, 0.75, easedIntro)
      ring1.rMat.opacity = 0.18 * ringReveal
      ring1.gMat.opacity = 0.18 * 0.1 * ringReveal
      ring1.pMat.opacity = 0.85 * ringReveal
      ring2.rMat.opacity = 0.13 * ringReveal
      ring2.gMat.opacity = 0.13 * 0.1 * ringReveal
      ring2.pMat.opacity = 0.85 * ringReveal
      ring3.rMat.opacity = 0.1 * ringReveal
      ring3.gMat.opacity = 0.1 * 0.1 * ringReveal
      ring3.pMat.opacity = 0.85 * ringReveal

      ring1.grp.rotation.z = t * 0.009 * ringReveal
      ring2.grp.rotation.z = -t * 0.007 * ringReveal
      ring3.grp.rotation.z = t * 0.005 * ringReveal

      ;[ring1, ring2, ring3].forEach((ring) => {
        const pos = ring.pGeo.attributes.position.array as Float32Array
        const count = ring.pPos.length / 3
        for (let i = 0; i < count; i++) {
          const a = (t * ring.pVel[i] * 0.1) + (i / count) * Math.PI * 2
          const r = Math.sqrt(ring.pPos[i * 3] * ring.pPos[i * 3] + ring.pPos[i * 3 + 1] * ring.pPos[i * 3 + 1])
          pos[i * 3] = Math.cos(a) * r
          pos[i * 3 + 1] = Math.sin(a) * r
        }
        ring.pGeo.attributes.position.needsUpdate = true
      })

      auroraBottom.material.uniforms.uTime.value = t
      auroraBottom.material.uniforms.uIntro.value = easedIntro
      auroraMid.material.uniforms.uTime.value = t
      auroraMid.material.uniforms.uIntro.value = easedIntro
      auroraTop.material.uniforms.uTime.value = t
      auroraTop.material.uniforms.uIntro.value = easedIntro

      const flareFade = smoothstep(0.45, 0.85, easedIntro)
      flareSprites.forEach((fs, i) => {
        fs.mat.opacity = fs.baseOp * (0.78 + Math.sin(t * (0.35 + i * 0.22) + fs.phase) * 0.22) * flareFade
      })

      const rayFade = smoothstep(0.55, 1.0, easedIntro)
      rayGroup.children.forEach((ray, i) => {
        const mesh = ray as THREE.Mesh
        ;(mesh.material as THREE.Material).opacity = rayFade
        if (!mesh.userData.baseRot) mesh.userData.baseRot = mesh.rotation.z
        mesh.rotation.z = mesh.userData.baseRot + Math.sin(t * 0.12 + i * 0.7) * 0.05
      })

      // ========== CINEMATIC ENTRY (no ugly zoom-from-far) ==========
      // Camera eases from (8,4,35) to (0,0,20) over INTRO_DURATION with a pan + dolly.
      // This is a short, elegant move — the scene already fills the frame at z=35, so
      // there's no "small patch in the middle of black". Combined with the black
      // fade-in overlay (JSX), this is the entrance animation the user sees on entry.
      const introEase = easeInOutCubic(Math.min(introProgress, 1.0))
      const startX = 8, startY = 4, startZ = 35
      const endX = 0, endY = 0, endZ = 20
      const camX = startX + (endX - startX) * introEase
      const camY = startY + (endY - startY) * introEase
      const camZ = startZ + (endZ - startZ) * introEase

      // Gentle ambient motion layered on top (after intro completes, these dominate)
      const driftX = noise(t * 0.025) * 1.8
      const driftY = noise(t * 0.02 + 100) * 1.0
      const driftZ = noise(t * 0.01 + 200) * 1.2
      const breathe = Math.sin(t * 0.06) * 0.25
      // Blend: during intro, drift is muted; after intro (introProgress=1), full drift.
      const driftAmt = introEase

      camera.position.x = camX + driftX * driftAmt + mouseX * 2.2 * introEase
      camera.position.y = camY + driftY * driftAmt + mouseY * 1.6 * introEase
      camera.position.z = camZ + driftZ * driftAmt + breathe * driftAmt

      // Look-at target also eases from a slight upward angle to dead-center,
      // giving a subtle tilt-down cinematic feel.
      const lookStartX = 2, lookStartY = 1.5
      const lookEndX = 0, lookEndY = 0
      const lookX = lookStartX + (lookEndX - lookStartX) * introEase + noise(t * 0.015 + 300) * 0.3 * driftAmt
      const lookY = lookStartY + (lookEndY - lookStartY) * introEase + noise(t * 0.012 + 400) * 0.2 * driftAmt
      camera.lookAt(lookX, lookY, 0)

      renderer.render(scene, camera)
    }
    animate()

    // Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    const onVis = () => { if (document.hidden) clock.stop(); else clock.start() }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVis)
      try { container.removeChild(renderer.domElement) } catch { /* ignore */ }

      nebGeos.forEach((g) => g.dispose())
      nebMats.forEach((m) => m.dispose())
      deepLayer.mat.dispose(); deepLayer.geo.dispose()
      midLayer.mat.dispose(); midLayer.geo.dispose()
      dustMat.dispose(); dustGeo.dispose()
      softTex.dispose(); glowTex.dispose(); glowTex2.dispose()
      shootingStars.dispose()
      ;[ring1, ring2, ring3].forEach((ring) => {
        ring.rGeo.dispose(); ring.gGeo.dispose(); ring.pGeo.dispose()
        ring.rMat.dispose(); ring.gMat.dispose(); ring.pMat.dispose()
      })
      auroraBottomMat.dispose(); auroraBottomGeo.dispose()
      auroraMidMat.dispose(); auroraMidGeo.dispose()
      auroraTopMat.dispose(); auroraTopGeo.dispose()
      flareSprites.forEach((fs) => fs.mat.dispose())
      rayGroup.children.forEach((c) => {
        const mesh = c as THREE.Mesh
        const mat = mesh.material as THREE.MeshBasicMaterial
        if (mat.map) mat.map.dispose()
        mat.dispose()
        mesh.geometry.dispose()
      })
      scene.clear()
      renderer.dispose()
    }
  }, [])

  return (
    <>
      {/* WebGL canvas container */}
      <div
        ref={containerRef}
        aria-hidden="true"
        role="presentation"
        style={{ position: 'fixed', inset: 0, zIndex: 0, background: '#000000' }}
      />

      {/* Cinematic fade-in overlay — pure black that fades out (opacity 1 → 0) once
          the WebGL scene has rendered a few frames. This is the "lights coming up"
          moment of the entrance animation: the user sees black → stars + nebula
          fade in while the camera eases into its framing position. The overlay sits
          above the canvas (zIndex 1500) but below the post-process layers. */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1500,
          background: '#000000',
          pointerEvents: 'none',
          opacity: cinematicReady ? 0 : 1,
          transition: reduced
            ? 'opacity 0.4s ease-out'
            : 'opacity 2.5s cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'opacity',
        }}
      />

      {/* Grain overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: '-50%', width: '200%', height: '200%',
          pointerEvents: 'none', zIndex: 1000,
          opacity: postProcess ? 0.035 : 0,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          animation: 'cosmicGrainShift 0.4s steps(8) infinite',
          transition: 'opacity 4s ease-out',
          willChange: 'transform,opacity',
        }}
      />

      {/* Vignette */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 900,
          opacity: postProcess ? 1 : 0,
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 28%, rgba(3,2,10,0.6) 60%, rgba(3,2,10,0.96) 100%)',
          transition: 'opacity 4s ease-out 1s',
        }}
      />

      {/* Color grade */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 850,
          opacity: postProcess ? 1 : 0,
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(200,160,60,0.07) 0%, transparent 40%), radial-gradient(ellipse at 70% 80%, rgba(100,50,180,0.08) 0%, transparent 45%)',
          mixBlendMode: 'overlay',
          transition: 'opacity 4s ease-out 1.5s',
        }}
      />

      {/* Chromatic */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 800,
          opacity: postProcess ? 0.025 : 0,
          background:
            'radial-gradient(ellipse at 30% 50%, rgba(255,40,40,0.15) 0%, transparent 55%), radial-gradient(ellipse at 70% 50%, rgba(40,40,255,0.15) 0%, transparent 55%)',
          mixBlendMode: 'screen',
          transition: 'opacity 4s ease-out 2s',
        }}
      />

      {/* WebGL Fallback */}
      {showFallback && (
        <div
          role="alert"
          style={{
            position: 'fixed', inset: 0, background: '#000000',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            zIndex: 7000, textAlign: 'center', padding: 32, gap: 16,
          }}
        >
          <div style={{
            width: 120, height: 120, borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(201,162,75,0.15) 0%,transparent 70%)',
            marginBottom: 8,
          }} />
          <p style={{
            color: 'rgba(201,162,75,0.7)', fontFamily: "'Segoe UI',system-ui,sans-serif",
            fontSize: 12, letterSpacing: 2, maxWidth: 440, lineHeight: 1.6, margin: 0,
          }}>
            Your browser does not support WebGL, which is required for this experience.
          </p>
          <p style={{
            direction: 'rtl', fontSize: 14, color: 'rgba(201,162,75,0.85)', letterSpacing: 0,
            fontFamily: "'Segoe UI',system-ui,sans-serif", margin: 0,
          }}>
            متصفحك لا يدعم WebGL اللازم لعرض هذه التجربة. الرجاء استخدام متصفح حديث.
          </p>
        </div>
      )}

      <style>{`
        @keyframes cosmicGrainShift {
          0%,100% { transform: translate(0,0); }
          10% { transform: translate(-3%,-2%); }
          20% { transform: translate(2%,3%); }
          30% { transform: translate(-1%,2%); }
          40% { transform: translate(3%,-1%); }
          50% { transform: translate(-2%,-3%); }
          60% { transform: translate(1%,2%); }
          70% { transform: translate(-3%,1%); }
          80% { transform: translate(2%,-2%); }
          90% { transform: translate(-1%,3%); }
        }
        @media (prefers-reduced-motion: reduce) {
          div[style*="cosmicGrainShift"] {
            animation-duration: 0.01ms !important;
            animation-delay: 0s !important;
          }
        }
      `}</style>
    </>
  )
}
