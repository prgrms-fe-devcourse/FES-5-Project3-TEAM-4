import { gsap } from 'gsap';
import { useCallback } from 'react';

type DivRef = { current: HTMLDivElement | null };

function clamp(min: number, max: number, v: number) {
  return Math.min(max, Math.max(min, v));
}

type Params = {
  isFaceUp: boolean;
  flipDir: number;
  hoverBackScale: number;
  animatingRef: React.MutableRefObject<boolean>;
  draggingRef: React.MutableRefObject<boolean>;
  cardRef: DivRef;
  backRef: DivRef;
};

export default function useCardHover({
  isFaceUp,
  flipDir,
  hoverBackScale,
  animatingRef,
  draggingRef,
  cardRef,
  backRef,
}: Params) {
  const onHoverMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!cardRef.current || animatingRef.current || draggingRef.current) return;

      if (isFaceUp) {
        const r = cardRef.current.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        const rx = clamp(-8, 8, (-y / r.height) * 18);
        const ry = clamp(-8, 8, (x / r.width) * 18);
        gsap.to(cardRef.current, { rotateX: rx, rotateY: ry, z: 8, duration: 0.16 });
      } else if (backRef.current) {
        gsap.to(backRef.current, { scale: hoverBackScale, duration: 0.12 });
      }
    },
    [isFaceUp, hoverBackScale, animatingRef, draggingRef, cardRef, backRef]
  );

  const onHoverLeave = useCallback(() => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: isFaceUp ? 0 : 180 * flipDir,
      z: 0.01,
      duration: 0.18,
    });
    if (backRef.current) gsap.to(backRef.current, { scale: 1, duration: 0.12 });
  }, [isFaceUp, flipDir, cardRef, backRef]);

  return { onHoverMove, onHoverLeave };
}
