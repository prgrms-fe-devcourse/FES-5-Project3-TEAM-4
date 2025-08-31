import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

type DivRef = { current: HTMLDivElement | null };

type UseCardFlipParams = {
  id: number | string;
  faceUpProp: boolean;
  flipDir: number;
  onFlip?: (id: number | string, next: boolean) => void;
  cardRef: DivRef;
  frontRef: DivRef;
  backRef: DivRef;
};

export default function useCardFlip({
  id,
  faceUpProp,
  flipDir,
  onFlip,
  cardRef,
  frontRef,
  backRef,
}: UseCardFlipParams) {
  const [isFaceUp, setIsFaceUp] = useState(faceUpProp);
  const animatingRef = useRef(false);
  const delayedFlipRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => setIsFaceUp(faceUpProp), [faceUpProp]);

  useEffect(() => {
    return () => {
      delayedFlipRef.current?.kill();
      delayedFlipRef.current = null;
    };
  }, []);

  const flip = useCallback(
    (to?: boolean) => {
      if (!cardRef.current) return;
      if (animatingRef.current) return;

      const next = typeof to === 'boolean' ? to : !isFaceUp;
      animatingRef.current = true;

      delayedFlipRef.current?.kill();
      delayedFlipRef.current = gsap.delayedCall(1.0, () => {
        if (!cardRef.current) {
          animatingRef.current = false;
          return;
        }

        if (frontRef.current && backRef.current) {
          gsap.set([frontRef.current, backRef.current], { opacity: 1, visibility: 'visible' });
        }

        gsap.to(cardRef.current, {
          rotateY: next ? 0 : 180 * flipDir,
          duration: 1,
          ease: 'power3.inOut',
          force3D: true,
          onComplete: () => {
            gsap.set(cardRef.current, {
              rotateX: 0,
              rotateY: next ? 0 : 180 * flipDir,
              z: 0.01,
              force3D: false,
            });
            if (frontRef.current && backRef.current) {
              gsap.set(frontRef.current, {
                opacity: next ? 1 : 0,
                visibility: next ? 'visible' : 'hidden',
              });
              gsap.set(backRef.current, {
                opacity: next ? 0 : 1,
                visibility: next ? 'hidden' : 'visible',
              });
            }
            setIsFaceUp(next);
            animatingRef.current = false;
          },
        });
      });

      onFlip?.(id, next);
    },
    [isFaceUp, flipDir, id, onFlip, cardRef, frontRef, backRef]
  );

  return { isFaceUp, setIsFaceUp, flip, animatingRef };
}
