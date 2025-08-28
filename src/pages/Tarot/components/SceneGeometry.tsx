import { useEffect, useState } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import {
  TextureLoader,
  SRGBColorSpace,
  RepeatWrapping,
  ClampToEdgeWrapping,
  DoubleSide,
} from 'three';

function useSRGBTexture(url: string) {
  const tex = useLoader(TextureLoader, url);
  const { gl } = useThree();
  useEffect(() => {
    tex.colorSpace = SRGBColorSpace;
    tex.wrapS = RepeatWrapping;
    tex.wrapT = RepeatWrapping;
    tex.repeat.set(1, 1);
    tex.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy?.() || 1);
    tex.needsUpdate = true;
  }, [tex, gl]);
  return tex;
}

function useSRGBClampTexture(url: string) {
  const tex = useLoader(TextureLoader, url);
  const { gl } = useThree();
  useEffect(() => {
    tex.colorSpace = SRGBColorSpace;
    tex.wrapS = ClampToEdgeWrapping;
    tex.wrapT = ClampToEdgeWrapping;
    tex.repeat.set(1, 1);
    tex.anisotropy = Math.min(16, gl.capabilities.getMaxAnisotropy?.() || 1);
    tex.needsUpdate = true;
  }, [tex, gl]);
  return tex;
}

function Wall({
  url,
  height = 8,
  position = [0, 4, -8] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
}) {
  const tex = useSRGBTexture(url);
  const [size, setSize] = useState<[number, number] | null>(null);

  useEffect(() => {
    const img = tex.image as HTMLImageElement;
    if (!img?.width || !img?.height) return;
    const aspect = img.width / img.height;
    setSize([height * aspect, height]);
  }, [tex, height]);

  if (!size) return null;

  return (
    <mesh position={position} rotation={rotation} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial map={tex} side={DoubleSide} />
    </mesh>
  );
}

function TableTop({
  url,
  depth = 4,
  y = 1.1,
  position = [0, 0, 0] as [number, number, number],
  rotation = [-Math.PI / 2, 0, 0] as [number, number, number],
}) {
  const tex = useSRGBClampTexture(url);
  const [size, setSize] = useState<[number, number] | null>(null);

  useEffect(() => {
    const img = tex.image as HTMLImageElement;
    if (!img?.width || !img?.height) return;
    const aspect = img.width / img.height;
    setSize([depth * aspect, depth]);
  }, [tex, depth]);

  if (!size) return null;

  return (
    <mesh position={[position[0], y, position[2]]} rotation={rotation} castShadow receiveShadow>
      <planeGeometry args={size} />
      <meshPhysicalMaterial
        map={tex}
        roughness={0.5}
        metalness={0}
        sheen={1}
        sheenRoughness={0.7}
        side={DoubleSide}
      />
    </mesh>
  );
}

export default function SceneGeometry() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#120832" />
      </mesh>

      <TableTop url="/velvet.png" depth={4} y={1.1} />

      <Wall url="/wall.png" position={[0, 3, -6]} rotation={[0, 0, 0]} />
    </>
  );
}
