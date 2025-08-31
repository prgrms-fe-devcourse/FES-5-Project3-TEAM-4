import { useCallback, useRef } from 'react';
import { gsap } from 'gsap';

type DivRef = { current: HTMLDivElement | null };

function safeGetNumber(target: Element, prop: string, fallback = 0) {
  const v = Number(gsap.getProperty(target, prop));
  return Number.isFinite(v) ? v : fallback;
}

type DragEndPayload = {
  clientX: number;
  clientY: number;
  translate: { x: number; y: number };
  cardRect: DOMRect;
};

type Params = {
  id: number | string;
  lockedProp: boolean;
  isFaceUp: boolean;
  hoverBackScale: number;
  onDragStart?: (id: number | string) => void;
  onDragEnd?: (id: number | string, payload: DragEndPayload) => void;
  rootRef: DivRef;
  cardRef: DivRef;
};

export default function useCardDrag({
  id,
  lockedProp,
  isFaceUp,
  hoverBackScale,
  onDragStart,
  onDragEnd,
  rootRef,
  cardRef,
}: Params) {
  const draggingRef = useRef(false);
  const isLockedRef = useRef(lockedProp);

  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const startTransRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const transRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const preAngleRef = useRef<number>(0);
  const hadPreAngleRef = useRef(false);

  const moveTo = useCallback(
    (x: number, y: number, ms = 380) => {
      if (!rootRef.current) return;
      transRef.current = { x, y };
      gsap.to(rootRef.current, { x, y, duration: ms / 1000, ease: 'power3.out' });
    },
    [rootRef]
  );

  const reset = useCallback(
    (ms = 280) => {
      moveTo(0, 0, ms);
      if (rootRef.current) gsap.set(rootRef.current, { zIndex: 1 });
      if (hadPreAngleRef.current && rootRef.current) {
        gsap.to(rootRef.current, {
          rotationZ: preAngleRef.current,
          duration: ms / 1000,
          ease: 'power3.out',
        });
      }
      if (rootRef.current) {
        gsap.to(rootRef.current, { scale: 1, duration: ms / 1000, ease: 'power3.out' });
      }
    },
    [moveTo, rootRef]
  );

  const applyFitScale = useCallback(
    (containerWidth: number, ratio = 0.9, ms = 280) => {
      if (!rootRef.current) return;
      const desired = containerWidth * ratio;
      const currentScale = safeGetNumber(rootRef.current, 'scale', 1);
      const currentWidth = rootRef.current.getBoundingClientRect().width;
      const nextScale = currentScale * (desired / currentWidth);
      gsap.to(rootRef.current, { scale: nextScale, duration: ms / 1000, ease: 'power3.out' });
    },
    [rootRef]
  );

  const lock = useCallback(() => {
    isLockedRef.current = true;
    if (rootRef.current) gsap.set(rootRef.current, { zIndex: 60 });
    const w = rootRef.current?.dataset.fitw;
    if (w) {
      const cw = Number(w);
      if (!Number.isNaN(cw)) applyFitScale(cw, 0.9, 320);
      delete rootRef.current!.dataset.fitw;
    }
  }, [rootRef, applyFitScale]);

  const unlock = useCallback(() => {
    isLockedRef.current = false;
    if (rootRef.current) gsap.set(rootRef.current, { zIndex: 1 });
  }, [rootRef]);

  const onPtrDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (isLockedRef.current || isFaceUp) return;
      draggingRef.current = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

      const root = rootRef.current!;
      const rect = cardRef.current!.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const tx = safeGetNumber(root, 'x', transRef.current.x);
      const ty = safeGetNumber(root, 'y', transRef.current.y);

      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      const nx = tx + dx;
      const ny = ty + dy;

      preAngleRef.current = safeGetNumber(root, 'rotationZ', 0);
      hadPreAngleRef.current = true;

      transRef.current = { x: nx, y: ny };
      startTransRef.current = { x: nx, y: ny };
      startPosRef.current = { x: e.clientX, y: e.clientY };

      gsap.set(root, { x: nx, y: ny, zIndex: 60 });
      gsap.to(root, { rotationZ: 0, duration: 0.12, ease: 'power2.out' });
      gsap.to(cardRef.current, { scale: hoverBackScale, duration: 0.1 });

      onDragStart?.(id);
    },
    [cardRef, rootRef, hoverBackScale, onDragStart, id, isFaceUp]
  );

  const onPtrMove = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!draggingRef.current || !rootRef.current || !startPosRef.current) return;
      const dx = e.clientX - startPosRef.current.x;
      const dy = e.clientY - startPosRef.current.y;
      const nx = startTransRef.current.x + dx;
      const ny = startTransRef.current.y + dy;
      transRef.current = { x: nx, y: ny };
      gsap.to(rootRef.current, { x: nx, y: ny, duration: 0, overwrite: 'auto' });
    },
    [rootRef]
  );

  const onPtrUp = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      gsap.to(cardRef.current, { scale: 1, duration: 0.12 });
      const rect = cardRef.current!.getBoundingClientRect();
      onDragEnd?.(id, {
        clientX: e.clientX,
        clientY: e.clientY,
        translate: { ...transRef.current },
        cardRect: rect,
      });
    },
    [cardRef, onDragEnd, id]
  );

  return {
    draggingRef,
    isLockedRef,
    onPtrDown,
    onPtrMove,
    onPtrUp,
    moveTo,
    reset,
    lock,
    unlock,
    applyFitScale,
    transRef,
  };
}
