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
  onDragStart?: (id: number | string, payload: DragEndPayload) => void;
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
    const el = rootRef.current;
    const w = el?.dataset.fitw;
    const r = el?.dataset.fitr ? Number(el.dataset.fitr) : 0.9;
    if (w) {
      const cw = Number(w);
      if (!Number.isNaN(cw)) applyFitScale(cw, Number.isFinite(r) ? r : 0.9, 320);
      if (el) {
        delete el.dataset.fitw;
        delete el.dataset.fitr;
      }
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
      const cardEl = cardRef.current!;

      const tx = safeGetNumber(root, 'x', transRef.current.x);
      const ty = safeGetNumber(root, 'y', transRef.current.y);

      preAngleRef.current = safeGetNumber(root, 'rotationZ', 0);
      hadPreAngleRef.current = true;

      gsap.set(root, { rotationZ: 0, x: tx, y: ty, zIndex: 60 });
      gsap.set(cardEl, { rotateX: 0 });
      gsap.to(cardEl, { scale: hoverBackScale, duration: 0.1 });

      requestAnimationFrame(() => {
        const rectNow = cardEl.getBoundingClientRect();
        const cx = rectNow.left + rectNow.width / 2;
        const cy = rectNow.top + rectNow.height / 2;

        const nx = tx + (e.clientX - cx);
        const ny = ty + (e.clientY - cy);

        transRef.current = { x: nx, y: ny };
        startTransRef.current = { x: nx, y: ny };
        startPosRef.current = { x: e.clientX, y: e.clientY };
        gsap.set(root, { x: nx, y: ny });

        onDragStart?.(id, {
          clientX: e.clientX,
          clientY: e.clientY,
          translate: { ...transRef.current },
          cardRect: rectNow,
        });
      });
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
