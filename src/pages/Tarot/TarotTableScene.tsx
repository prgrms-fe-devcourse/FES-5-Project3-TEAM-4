import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { Group } from 'three';
import { forwardRef, useImperativeHandle, useRef, useState, Suspense } from 'react';
import { gsap } from 'gsap';
import SceneGeometry from './SceneGeometry';

export type TarotTableSceneHandle = {
  lookDown: () => Promise<void>;
  resetView: () => Promise<void>;
};

const TarotTableScene = forwardRef<TarotTableSceneHandle>((_, ref) => {
  const rig = useRef<Group>(null);
  const [busy, setBusy] = useState(false);

  useImperativeHandle(ref, () => ({
    lookDown() {
      if (busy || !rig.current) return Promise.resolve();
      setBusy(true);
      const tl = gsap.timeline();
      tl.to(rig.current.position, { y: 2.2, duration: 1.5, ease: 'power2.out' }, 0)
        .to(rig.current.rotation, { x: -Math.PI / 2.6, duration: 1.5, ease: 'power2.inOut' }, '<')
        .to(rig.current.position, { y: 1.9, z: 1.5, duration: 1.5, ease: 'power2.inOut' }, '<');
      return new Promise<void>((res) =>
        tl.eventCallback('onComplete', () => {
          setBusy(false);
          res();
        })
      );
    },
    resetView() {
      if (busy || !rig.current) return Promise.resolve();
      setBusy(true);
      const tl = gsap.timeline();
      tl.to(rig.current.rotation, { x: 0, duration: 1.0, ease: 'power2.inOut' }, 0).to(
        rig.current.position,
        { y: 1.6, z: 3, duration: 1.0, ease: 'power2.inOut' },
        0
      );
      return new Promise<void>((res) =>
        tl.eventCallback('onComplete', () => {
          setBusy(false);
          res();
        })
      );
    },
  }));

  return (
    <div className="fixed inset-0 z-0">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, toneMappingExposure: 1.3 }}>
        <color attach="background" args={['#0E0724']} />
        <group ref={rig} position={[0, 1.6, 3]} rotation={[0, 0, 0]}>
          <PerspectiveCamera makeDefault fov={45} />
        </group>

        <ambientLight intensity={0.35} />
        <hemisphereLight intensity={0.7} color="#e2e8f0" groundColor="#0E0724" />
        <directionalLight
          castShadow
          position={[3, 6, 3]}
          intensity={1.6}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <Suspense fallback={null}>
          <SceneGeometry />
        </Suspense>
      </Canvas>
    </div>
  );
});

export default TarotTableScene;
