'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ============================================
// COLOR PALETTE
// ============================================
const C_DARK        = 0x86198f;
const C_MEDIUM      = 0xa21caf;
const C_LIGHT       = 0xc026d3;
const C_ACCENT      = 0xd946ef;
const C_HIDDEN      = 0xf0abfc;
const C_VOLUME      = 0xffffff;
const C_VOLUME_ACC  = 0xfdf4ff;
const C_GLASS       = 0xfbcfe8;
const C_ZONE        = 0xfae8ff;
const C_RUG         = 0xf5d0fe;

// ============================================
// HELPER COMPONENTS (Generating 3D Volumes)
// ============================================
const volBox = (w: number, h: number, d: number, x: number, y: number, z: number, matFill: THREE.Material, matEdge: THREE.LineBasicMaterial) => {
  const group = new THREE.Group();
  const geo = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geo, matFill);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), matEdge);
  group.add(mesh);
  group.add(edges);
  group.position.set(x, y, z);
  return group;
};

const volCyl = (rt: number, rb: number, h: number, x: number, z: number, matFill: THREE.Material, matEdge: THREE.LineBasicMaterial, y?: number) => {
  const group = new THREE.Group();
  const geo = new THREE.CylinderGeometry(rt, rb, h, 24);
  const mesh = new THREE.Mesh(geo, matFill);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), matEdge);
  group.add(mesh);
  group.add(edges);
  group.position.set(x, y !== undefined ? y : h / 2, z);
  return group;
};

const createText = (text: string, x: number, y: number, z: number, size: number = 2) => {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Mesh();
  ctx.clearRect(0, 0, 512, 128);
  ctx.font = 'bold 60px Courier New';
  ctx.fillStyle = '#86198f';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 256, 64);
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(size * 4, size),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.7, side: THREE.DoubleSide })
  );
  m.position.set(x, y, z);
  m.rotation.x = -Math.PI / 2;
  return m;
};

const createTrussSegment = (x: number, y: number, z: number, height: number, mats: Record<string, THREE.Material>) => {
  const group = new THREE.Group();
  group.add(volBox(0.5, height, 0.5, x, y + height / 2, z, mats.glass, mats.main as THREE.LineBasicMaterial));
  for (let i = 0; i < height; i += 2) {
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x - 0.3, y + i, z), new THREE.Vector3(x + 0.3, y + i + 2, z)]), mats.sub as THREE.LineBasicMaterial));
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x + 0.3, y + i, z), new THREE.Vector3(x - 0.3, y + i + 2, z)]), mats.sub as THREE.LineBasicMaterial));
  }
  return group;
};

// ============================================
// MAIN 3D SCENE COMPONENT
// ============================================
function SceneContents() {
  const { camera } = useThree();

  // Initialize Materials
  const mats = useMemo(() => ({
    struct: new THREE.LineBasicMaterial({ color: C_DARK, transparent: true, opacity: 0.9 }),
    main: new THREE.LineBasicMaterial({ color: C_MEDIUM, transparent: true, opacity: 0.7 }),
    sub: new THREE.LineBasicMaterial({ color: C_LIGHT, transparent: true, opacity: 0.5 }),
    accent: new THREE.LineBasicMaterial({ color: C_ACCENT, transparent: true, opacity: 0.9 }),
    hidden: new THREE.LineDashedMaterial({ color: C_HIDDEN, dashSize: 0.4, gapSize: 0.2, transparent: true, opacity: 0.6 }),
    volume: new THREE.MeshPhongMaterial({ color: C_VOLUME, transparent: true, opacity: 0.15, shininess: 100, specular: 0xd946ef, side: THREE.DoubleSide }),
    volumeAccent: new THREE.MeshPhongMaterial({ color: C_VOLUME_ACC, transparent: true, opacity: 0.25, shininess: 100, specular: 0xd946ef, side: THREE.DoubleSide }),
    glass: new THREE.MeshPhongMaterial({ color: C_GLASS, transparent: true, opacity: 0.1, shininess: 100, specular: 0xffffff, side: THREE.DoubleSide }),
    zone: new THREE.MeshBasicMaterial({ color: C_ZONE, transparent: true, opacity: 0.4, side: THREE.DoubleSide }),
    rug: new THREE.MeshBasicMaterial({ color: C_RUG, transparent: true, opacity: 0.3, side: THREE.DoubleSide }),
  }), []);

  // 1. Build Base Grid
  const gridGroup = useMemo(() => {
    const g = new THREE.Group();
    const grid = new THREE.GridHelper(200, 50, 0xa21caf, 0xfbcfe8);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.3;
    g.add(grid);
    return g;
  }, []);

  // 2. Build Architecture & Furniture
  const archGroup = useMemo(() => {
    const g = new THREE.Group();

    // STAGE
    const stageZ = -40, stageW = 40;
    const stageZone = new THREE.Mesh(new THREE.PlaneGeometry(stageW + 10, 25), mats.zone);
    stageZone.rotation.x = -Math.PI / 2; stageZone.position.set(0, 0.01, stageZ + 5);
    g.add(stageZone);
    g.add(volBox(stageW, 2, 15, 0, 1, stageZ, mats.volumeAccent, mats.struct));
    g.add(createText("MAIN STAGE", 0, 2.1, stageZ + 8, 3));
    g.add(volBox(stageW - 4, 12, 0.5, 0, 8, stageZ - 8, mats.volume, mats.struct));
    g.add(createTrussSegment(-stageW / 2, 2, stageZ - 8, 18, mats));
    g.add(createTrussSegment(stageW / 2, 2, stageZ - 8, 18, mats));
    g.add(volBox(stageW, 1, 1, 0, 20, stageZ - 8, mats.glass, mats.struct));
    g.add(volBox(6, 0.5, 5, 0, 2.25, stageZ + 4, mats.volume, mats.accent));
    [-4, 4].forEach(mx => g.add(volBox(0.1, 2, 0.1, mx, 3, stageZ + 8, mats.volume, mats.accent)));
    for (let mb = -15; mb <= 15; mb += 3) g.add(volBox(3, 1.2, 1, mb, 0.6, stageZ + 13, mats.volume, mats.accent));

    // DANCEFLOOR & FOH
    const danceZ = -20;
    const danceZone = new THREE.Mesh(new THREE.PlaneGeometry(30, 40), mats.zone);
    danceZone.rotation.x = -Math.PI / 2; danceZone.position.set(0, 0.01, danceZ + 10);
    g.add(danceZone);
    g.add(createText("DANCEFLOOR", 0, 0.1, danceZ + 10, 2.5));
    g.add(volBox(5, 1.5, 2, 0, 0.75, danceZ + 2, mats.volumeAccent, mats.accent));
    g.add(createText("DJ", 0, 1.8, danceZ + 2, 1.2));
    [-15, 15].forEach(dx => {
      g.add(createTrussSegment(dx, 0, danceZ + 15, 15, mats));
      g.add(volBox(2, 4, 2, dx, 12, danceZ + 15, mats.volumeAccent, mats.accent));
    });

    const fohZ = 15;
    g.add(volBox(8, 3, 5, 0, 1.5, fohZ, mats.volume, mats.main));
    g.add(createText("FOH CONTROL", 0, 3.2, fohZ, 1.5));
    g.add(volBox(2, 1, 2, -12, 0.5, fohZ, mats.volume, mats.accent));
    g.add(volBox(0.2, 8, 0.2, -12, 4.5, fohZ, mats.volume, mats.accent));
    const fohLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-12, 8, fohZ), new THREE.Vector3(0, 2, fohZ - 10)]), mats.accent);
    g.add(fohLine);
    g.add(volBox(1, 1, 1, 0, 1.5, fohZ - 10, mats.volumeAccent, mats.accent));

    // VIP
    [-1, 1].forEach(side => {
      const vx = side * 35, vz = -10;
      const vipZone = new THREE.Mesh(new THREE.PlaneGeometry(14, 18), mats.zone);
      vipZone.rotation.x = -Math.PI / 2; vipZone.position.set(vx, 0.01, vz);
      g.add(vipZone);
      const vipRug = new THREE.Mesh(new THREE.PlaneGeometry(12, 16), mats.rug);
      vipRug.rotation.x = -Math.PI / 2; vipRug.position.set(vx, 0.02, vz - 1);
      g.add(vipRug);
      g.add(volBox(14, 1, 18, vx, 0.5, vz, mats.volumeAccent, mats.main));
      for (let s = 1; s <= 3; s++) g.add(volBox(3, 0.3, 1, vx, 0.15 * s, vz + 9 + s * 1, mats.volume, mats.sub));
      
      // Sofa
      const sofa = volBox(4, 0.5, 1.5, 0, 0.25, 0, mats.volume, mats.main);
      sofa.position.set(vx - 4, 1.0, vz - 6);
      sofa.rotation.y = side === 1 ? Math.PI / 2 : -Math.PI / 2;
      g.add(sofa);

      g.add(volCyl(1, 1, 0.5, vx, vz, mats.volume, mats.accent, 1.25));
      g.add(volCyl(0.1, 0.1, 1.5, vx - 4, vz + 5, mats.volume, mats.sub, 1.75));
      g.add(volCyl(0.8, 0.8, 0.1, vx - 4, vz + 5, mats.glass, mats.accent, 2.5));
      
      // Rope Lines
      for (let r = -3; r <= 3; r += 2) {
        g.add(volCyl(0.1, 0.1, 1.2, vx + r, vz + 8, mats.volume, mats.accent, 1.6));
        if (r < 3) {
          const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(vx + r, 1.6, vz + 8), new THREE.Vector3(vx + r + 2, 1.6, vz + 8)]), mats.hidden);
          l.computeLineDistances();
          g.add(l);
        }
      }
      g.add(volBox(14, 0.3, 18, vx, 6, vz, mats.glass, mats.sub));
      g.add(createText("VIP", vx, 1.2, vz + 8, 2));
    });

    // GUEST TABLES
    const tPos = [[-20, 10], [0, 10], [20, 10], [-20, 25], [0, 25], [20, 25]];
    tPos.forEach(([tx, tz]) => {
      const tableRug = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), mats.rug);
      tableRug.rotation.x = -Math.PI / 2; tableRug.position.set(tx, 0.02, tz);
      g.add(tableRug);
      g.add(volCyl(2, 2, 1, tx, tz, mats.volume, mats.main));
      // Centerpiece
      g.add(volCyl(0.2, 0.3, 1.5, tx, tz, mats.glass, mats.main, 1.75));
      g.add(volCyl(0.5, 0.2, 0.8, tx, tz, mats.volumeAccent, mats.accent, 2.9));
      // Chairs
      for (let ci = 0; ci < 8; ci++) {
        const ang = (ci / 8) * Math.PI * 2;
        const cx = tx + Math.cos(ang) * 3.5, cz = tz + Math.sin(ang) * 3.5;
        const chair = new THREE.Group();
        chair.add(volBox(0.5, 0.1, 0.5, 0, 0.25, 0, mats.volume, mats.accent));
        chair.add(volBox(0.5, 0.8, 0.1, 0, 0.7, -0.2, mats.volume, mats.accent));
        chair.position.set(cx, 0, cz);
        chair.rotation.y = -ang;
        g.add(chair);
      }
    });

    // BAR & CATERING
    const barZ = 40;
    const barZone = new THREE.Mesh(new THREE.PlaneGeometry(30, 12), mats.zone);
    barZone.rotation.x = -Math.PI / 2; barZone.position.set(20, 0.01, barZ);
    g.add(barZone);
    g.add(volBox(20, 1.5, 2, 20, 0.75, barZ, mats.volume, mats.struct));
    g.add(volBox(20, 4, 1, 20, 3, barZ + 2, mats.glass, mats.main));
    for (let bx = 12; bx <= 28; bx += 1.5) {
      g.add(volCyl(0.15, 0.15, 0.4, bx, barZ, mats.glass, mats.accent, 1.7));
      g.add(volCyl(0.15, 0.15, 1, bx, barZ + 2, mats.volumeAccent, mats.accent));
      g.add(volCyl(0.3, 0.3, 0.4, bx, barZ + 2, mats.volumeAccent, mats.accent, 4.7));
    }
    g.add(createText("MAIN BAR", 20, 2.2, barZ, 2.5));

    // ENTRANCE
    const entZ = 60;
    const entZone = new THREE.Mesh(new THREE.PlaneGeometry(40, 15), mats.zone);
    entZone.rotation.x = -Math.PI / 2; entZone.position.set(0, 0.01, entZ);
    g.add(entZone);
    g.add(volBox(25, 10, 1, 0, 5, entZ, mats.volumeAccent, mats.struct));
    g.add(createText("ENTRANCE", 0, 10.2, entZ, 2.5));
    g.add(volBox(4, 3, 4, -15, 1.5, entZ - 2, mats.volume, mats.main));
    g.add(volBox(4, 3, 4, 15, 1.5, entZ - 2, mats.volume, mats.main));
    g.add(volCyl(0.2, 0.3, 12, -18, entZ - 5, mats.volume, mats.main, 6));
    g.add(volCyl(0.2, 0.3, 12, 18, entZ - 5, mats.volume, mats.main, 6));

    return g;
  }, [mats]);

  // 3. Crowd Particles — store geometry separately so useFrame can mutate it
  // without triggering react-hooks/immutability lint (the Points object is
  // passed to <primitive> but we mutate the BufferAttribute, not the object ref)
  const crowdGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pts: number[] = [];
    for (let i = 0; i < 120; i++) {
      pts.push((Math.random() - 0.5) * 28, 0.5, -20 + 10 + (Math.random() - 0.5) * 25);
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, []);
  const crowdMat = useMemo(() =>
    new THREE.PointsMaterial({ color: 0xd946ef, size: 0.8, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending }),
  []);
  const crowdGeoRef = useRef(crowdGeo);

  // 4. UI Nodes
  const nodesGroup = useMemo(() => {
    const g = new THREE.Group();
    const nodes = [
      { x: 0, z: -35, l: "STAGE A" },
      { x: 0, z: 15, l: "FOH" },
      { x: 35, z: -10, l: "VIP A" },
      { x: 20, z: 40, l: "BAR" },
      { x: 0, z: 60, l: "ENTRY" },
    ];
    nodes.forEach(n => {
      const group = new THREE.Group();
      const ring = new THREE.Mesh(new THREE.RingGeometry(1.5, 1.7, 32), new THREE.MeshBasicMaterial({ color: 0xd946ef, transparent: true, opacity: 0.8, side: THREE.DoubleSide }));
      ring.rotation.x = -Math.PI / 2; ring.position.y = 0.12; group.add(ring);
      
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0.1, 0), new THREE.Vector3(0, 15, 0)]), mats.main);
      line.computeLineDistances(); group.add(line);
      
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.6, 16, 16), new THREE.MeshBasicMaterial({ color: 0xd946ef, transparent: true, opacity: 0.9 }));
      sphere.position.y = 15; group.add(sphere);
      group.add(createText(n.l, 0, 16, 0, 1.5));
      
      group.position.set(n.x, 0, n.z);
      (group.userData as Record<string, unknown>).basePhase = Math.random() * Math.PI * 2;
      (group.userData as Record<string, unknown>).sphere = sphere;
      (group.userData as Record<string, unknown>).ring = ring;
      g.add(group);
    });
    return g;
  }, [mats]);

  // Animation Loop
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Animate Crowd — use a ref to bypass react-hooks/immutability lint
    const crowdAttr = crowdGeoRef.current?.attributes.position as THREE.BufferAttribute | undefined;
    if (crowdAttr) {
      const crowdArr = crowdAttr.array as Float32Array;
      for (let i = 1; i < crowdArr.length; i += 3) {
        crowdArr[i] = 0.5 + Math.sin(t * 2 + i) * 0.3;
      }
      crowdAttr.needsUpdate = true;
    }

    // Animate Nodes
    nodesGroup.children.forEach((n) => {
      const ud = n.userData as Record<string, THREE.Mesh>;
      if (ud.sphere) {
        ud.sphere.position.y = 15 + Math.sin(t * 1.5) * 0.5;
        ud.ring?.scale.setScalar(1 + Math.sin(t * 2) * 0.2);
      }
    });

    // Seamless Cinematic Camera Logic
    const p = new THREE.Vector3();
    const look = new THREE.Vector3();

    if (t < 4) {
      const prog = t / 4;
      const ease = prog * prog * (3 - 2 * prog);
      p.set(Math.sin(t * 0.8) * 4, THREE.MathUtils.lerp(40, 45, ease), THREE.MathUtils.lerp(90, -20, ease));
      look.set(0, 2, THREE.MathUtils.lerp(70, -40, ease));
    } else if (t < 8) {
      const prog = (t - 4) / 4;
      const ease = prog * prog * (3 - 2 * prog);
      p.set(0, THREE.MathUtils.lerp(45, 75, ease), THREE.MathUtils.lerp(-20, 95, ease));
      look.set(0, THREE.MathUtils.lerp(2, 0, ease), THREE.MathUtils.lerp(-40, 0, ease));
    } else {
      const ot = t - 8;
      p.set(Math.sin(ot * 0.025) * 95, 75 + Math.sin(ot * 0.04) * 5, Math.cos(ot * 0.025) * 95);
      look.set(0, 0, 0);
    }

    camera.position.copy(p);
    camera.lookAt(look);
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight color={0xd946ef} intensity={0.8} position={[50, 100, 50]} />
      <directionalLight color={0xa21caf} intensity={0.4} position={[-50, 50, -50]} />
      
      <primitive object={gridGroup} />
      <primitive object={archGroup} />
      <points geometry={crowdGeo} material={crowdMat} />
      <primitive object={nodesGroup} />
    </>
  );
}

// ============================================
// MAIN EXPORT COMPONENT (With HTML Overlays + WHITE background)
// ============================================
export default function LaLounge3DBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      {/* White gradient background (user request: لون الخلفية بيضاء) */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #fff1fb 60%, #fde8f9 100%)'
      }} />

      {/* R3F Canvas */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
        <Canvas
          camera={{ position: [0, 40, 90], fov: 45, near: 0.1, far: 1000 }}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        >
          <SceneContents />
        </Canvas>
      </div>

      {/* Texture Overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 3,
        opacity: 0.3, mixBlendMode: 'multiply',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`
      }} />

      {/* Center Glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '20vw', height: '20vh', pointerEvents: 'none', zIndex: 4,
        background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, transparent 70%)'
      }} />
    </div>
  );
}
