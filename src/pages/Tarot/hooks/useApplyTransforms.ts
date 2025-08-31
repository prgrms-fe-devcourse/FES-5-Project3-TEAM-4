import { useCallback, useEffect } from 'react';
import { gsap } from 'gsap';

type DivRef = { current: HTMLDivElement | null };

type Params = {
  rootRef: DivRef;
  cardRef: DivRef;
  frontRef: DivRef;
  backRef: DivRef;
  isFaceUp: boolean;
  flipDir: number;
  reversed: boolean;
};

export default function useApplyTransforms({
  rootRef,
  cardRef,
  frontRef,
  backRef,
  isFaceUp,
  flipDir,
  reversed,
}: Params) {
  const applyTransforms = useCallback(() => {
    if (!cardRef.current || !frontRef.current || !backRef.current) return;

    gsap.set(rootRef.current, { perspective: 1200, transformStyle: 'preserve-3d' });
    gsap.set(cardRef.current, {
      transformStyle: 'preserve-3d',
      transformOrigin: '50% 50%',
      z: 0.01,
      rotateY: isFaceUp ? 0 : 180 * flipDir,
      rotateX: 0,
      rotateZ: reversed ? 180 : 0,
      x: 0,
      y: 0,
    });
    gsap.set(frontRef.current, {
      backfaceVisibility: 'hidden',
      willChange: 'transform,opacity,filter',
      transform: 'rotateY(0deg) translateZ(0.2px)',
      opacity: isFaceUp ? 1 : 0,
      visibility: isFaceUp ? 'visible' : 'hidden',
    });
    gsap.set(backRef.current, {
      backfaceVisibility: 'hidden',
      willChange: 'transform,opacity,filter',
      transform: 'rotateY(180deg) translateZ(0.2px)',
      opacity: isFaceUp ? 0 : 1,
      visibility: isFaceUp ? 'hidden' : 'visible',
    });
  }, [isFaceUp, flipDir, reversed, rootRef, cardRef, frontRef, backRef]);

  useEffect(() => {
    applyTransforms();
  }, [applyTransforms]);

  return { applyTransforms };
}
