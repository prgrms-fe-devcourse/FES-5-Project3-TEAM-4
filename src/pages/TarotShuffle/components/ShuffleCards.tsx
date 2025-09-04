import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { useEffect, useMemo, useRef } from 'react';
import cardBackUrl from '@/assets/Tarot/tarot_back.svg?url';

const THEME = {
  canvasBg: '#151228',
  tableColor: '#FFFFFF',
  tableSvg: '/velvet-light.png',
  tableRepeat: [3, 3] as [number, number],
};

const CARD_SRC = cardBackUrl;

function mulberry32(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = (min: number, max: number, r: () => number) => min + (max - min) * r();
const svgToDataUrl = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;

const CFG = {
  count: 40,
  w: 1.4,
  h: 2.2,
  thick: 0.012,
  layerGap: 0.05,
  durOut: 0.28,
  durIn: 0.34,
  startGap: 0.18,
  seed: 20250902,
  deckClearance: 0.3,

  poses: [
    {
      stage: [-0.85, 0.04, -0.08] as [number, number, number],
      L: [-1.8, -0.1, 0.0],
      R: [1.8, -0.3, 0.1],
    },
    {
      stage: [-0.95, -0.02, 0.12] as [number, number, number],
      L: [-1.6, 0.05, 0.1],
      R: [1.9, -0.25, -0.1],
    },
  ],
  poseEveryN: 8,
  poseAutoSwap: false,
  tiltOnOutDeg: 12,
};

const BASE_Y = CFG.deckClearance + CFG.thick * 0.5;

function Deck3D({ faceUrl }: { faceUrl: string }) {
  const stage = useRef<THREE.Group>(null!);
  const L = useRef<THREE.Group>(null!);
  const R = useRef<THREE.Group>(null!);
  const meshes = useRef<THREE.Mesh[]>([]);
  const orderL = useRef<number[]>([]);
  const orderR = useRef<number[]>([]);
  const timer = useRef<number | null>(null);

  const r = useMemo(() => mulberry32(CFG.seed), []);
  const ids = useMemo(() => Array.from({ length: CFG.count }, (_, i) => i), []);
  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin('anonymous');
  const faceTex = useMemo(() => new THREE.TextureLoader().load(faceUrl), [faceUrl]);

  function pickInsertionIndex(n: number, r: () => number) {
    if (n <= 0) return 0;
    const t = Math.pow(r(), 1.6);
    const min = Math.floor(n * 0.2);
    const max = Math.ceil(n * 0.85);
    return Math.min(max, Math.max(min, Math.floor(t * (max - min + 1) + min)));
  }

  function relayoutStack(stack: number[], ms: THREE.Mesh[], gap: number, dur = 0.16) {
    stack.forEach((id, i) => {
      gsap.to(ms[id].position, { y: BASE_Y + i * gap, duration: dur, ease: 'power2.out' });
    });
  }

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    const raf = requestAnimationFrame(() => {
      cleanup = start();
    });
    return () => {
      cancelAnimationFrame(raf);
      if (cleanup) cleanup();
    };

    function start() {
      gsap.globalTimeline.timeScale(1.4);
      const s = stage.current,
        gL = L.current,
        gR = R.current,
        ms = meshes.current.filter(Boolean);
      if (!s || !gL || !gR || ms.length === 0) return;

      orderL.current = [];
      orderR.current = ms.map((_, i) => i);
      ms.forEach((m, i) => {
        gR.attach(m);
        m.position.set(0, BASE_Y + i * CFG.layerGap, 0);

        m.rotation.set(
          THREE.MathUtils.degToRad(rand(10, 16, r)),
          0,
          THREE.MathUtils.degToRad(rand(-2, 2, r))
        );
      });

      let poseIdx = 0;
      let launched = 0;
      const applyPose = () => {
        const P = CFG.poses[poseIdx % CFG.poses.length];
        gsap.to(s.rotation, {
          x: P.stage[0],
          y: P.stage[1],
          z: P.stage[2],
          duration: 0.6,
          ease: 'power3.inOut',
        });
        gsap.to(gL.position, {
          x: P.L[0],
          y: P.L[1],
          z: P.L[2],
          duration: 0.6,
          ease: 'power3.inOut',
        });
        gsap.to(gR.position, {
          x: P.R[0],
          y: P.R[1],
          z: P.R[2],
          duration: 0.6,
          ease: 'power3.inOut',
        });
      };
      applyPose();

      const launch = (fromRight: boolean) => {
        const from = fromRight ? orderR.current : orderL.current;
        const to = fromRight ? orderL.current : orderR.current;
        if (!from.length) return;

        const id = from[from.length - 1];
        const m = ms[id];
        from.pop();

        const parentFrom = fromRight ? gR : gL;
        const parentTo = fromRight ? gL : gR;
        parentFrom.attach(m);

        const ins = pickInsertionIndex(to.length, r);
        const targetY = BASE_Y + ins * CFG.layerGap;
        const side = fromRight ? -1 : 1;
        const dx = side * rand(1.8, 2.6, r);
        const peak = rand(0.45, 0.9, r);

        const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });

        tl.to(
          m.position,
          {
            x: dx * 0.55,
            y: m.position.y + peak,
            z: -0.4,
            duration: CFG.durOut,
            ease: 'power3.in',
          },
          0
        ).to(
          m.rotation,
          {
            x: THREE.MathUtils.degToRad(rand(18, 24, r)),
            y: THREE.MathUtils.degToRad(side * rand(6, 12, r)),
            z: THREE.MathUtils.degToRad(side * CFG.tiltOnOutDeg + rand(-2, 2, r)),
            duration: CFG.durOut,
            ease: 'power3.in',
          },
          0
        );

        tl.add(() => {
          parentTo.attach(m);
        });

        tl.add(() => {
          for (let j = ins; j < to.length; j++) {
            const mid = ms[to[j]];
            gsap.to(mid.position, {
              y: BASE_Y + (j + 1) * CFG.layerGap,
              duration: CFG.durIn * 0.85,
              ease: 'power2.out',
            });
          }
        }, '>');

        tl.to(
          m.position,
          {
            x: 0,
            y: targetY,
            z: 0,
            duration: CFG.durIn,
            ease: 'power3.out',
            onComplete: () => {
              to.splice(ins, 0, id);
              relayoutStack(to, ms, CFG.layerGap, 0.18);
            },
          },
          '>'
        );
        tl.to(
          m.rotation,
          {
            x: THREE.MathUtils.degToRad(rand(16, 20, r)),
            y: THREE.MathUtils.degToRad(side * rand(-8, -4, r)),
            z: THREE.MathUtils.degToRad(rand(-4, 4, r)),
            duration: CFG.durIn,
            ease: 'power3.out',
          },
          '<'
        );
      };

      let dirRTL = true;
      const step = () => {
        if (CFG.poseAutoSwap && launched % CFG.poseEveryN === 0) {
          poseIdx++;
          applyPose();
        }
        launch(dirRTL);
        launched++;
        if (orderR.current.length === 0) dirRTL = false;
        if (orderL.current.length === 0) dirRTL = true;
        timer.current = window.setTimeout(step, CFG.startGap * 1000);
      };
      step();

      return () => {
        if (timer.current) window.clearTimeout(timer.current);
        gsap.killTweensOf(ms.map((m) => m.position));
      };
    }
  }, [faceUrl]);

  return (
    <group ref={stage} position={[0, 0, 0]}>
      <group ref={L} />
      <group ref={R} />
      {ids.map((i) => (
        <mesh
          key={i}
          ref={(m: THREE.Mesh | null) => {
            if (m) meshes.current[i] = m;
            else delete meshes.current[i];
          }}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[CFG.w, CFG.thick, CFG.h]} />
          <meshStandardMaterial
            attach="material-0"
            color="#1b2234"
            roughness={0.9}
            metalness={0.04}
          />
          <meshStandardMaterial
            attach="material-1"
            color="#1b2234"
            roughness={0.9}
            metalness={0.04}
          />
          <meshStandardMaterial attach="material-3" color="#121724" roughness={0.95} />
          <meshStandardMaterial attach="material-4" color="#192036" roughness={0.9} />
          <meshStandardMaterial attach="material-5" color="#0f1320" roughness={0.88} />
          <meshStandardMaterial
            attach="material-2"
            map={faceTex}
            roughness={0.85}
            metalness={0.02}
            toneMapped={true}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function ShuffleCards() {
  const faceUrl = useMemo(() => {
    const s = CARD_SRC.trim();
    return s.startsWith('<svg') ? svgToDataUrl(s) : s;
  }, []);

  const tableMap = useMemo(() => {
    if (!THEME.tableSvg) return null;

    const src = THEME.tableSvg.trim().startsWith('<svg')
      ? svgToDataUrl(THEME.tableSvg)
      : THEME.tableSvg;

    const tex = new THREE.TextureLoader().load(src);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    const [rx, ry] = THEME.tableRepeat;
    tex.repeat.set(rx, ry);
    return tex;
  }, []);

  const STAGE_Y = -2.0;
  const TABLE_GAP = -0.55;

  return (
    <div className="w-full min-h-screen" style={{ background: THEME.canvasBg }}>
      <div className="relative mx-auto pt-47" style={{ height: '80vh' }}>
        <Canvas
          shadows
          camera={{ position: [0, 15, 0], fov: 28 }}
          style={{ height: '80vh', background: THEME.canvasBg }}
          gl={{
            outputColorSpace: THREE.SRGBColorSpace,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.25,
          }}
        >
          <hemisphereLight intensity={0.6} groundColor={0x223322} />
          <directionalLight
            position={[3, 6, 4]}
            intensity={1.5}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <spotLight
            position={[-2, 6, 4]}
            angle={0.35}
            penumbra={0.5}
            intensity={1.35}
            castShadow
          />

          <group position={[0, STAGE_Y, 0]} rotation={[0.35, 0, -0.04]} scale={0.9}>
            <Deck3D faceUrl={faceUrl} />
          </group>

          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, STAGE_Y + TABLE_GAP, 0]}
            receiveShadow
          >
            <planeGeometry args={[26, 26]} />
            <meshStandardMaterial
              color={THEME.tableColor}
              map={tableMap ?? undefined}
              roughness={0.95}
              metalness={0}
            />
          </mesh>
        </Canvas>
      </div>
    </div>
  );
}
