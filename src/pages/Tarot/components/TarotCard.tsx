import { forwardRef, useEffect, useImperativeHandle, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import clsx from 'clsx';
import CardBackUrl from '@/assets/Tarot/tarot_back.svg?url';
import type { TarotCardHandle, TarotCardProps } from '../types/CardProps';

const TarotCard = forwardRef<TarotCardHandle, TarotCardProps>(function TarotCard(
  {
    id,
    name,
    frontSrc,
    width = 210,
    faceUp = false,
    reversed = false,
    flipDir = -1,
    locked = false,
    hoverBackScale = 1.06,
    onFlip,
    onClick,
    onOpenModal,
    onDragStart,
    onDragEnd,
    className,
  },
  ref
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const [isFaceUp, setIsFaceUp] = useState(faceUp);
  const [isLocked, setIsLocked] = useState(locked);

  const animatingRef = useRef(false);
  const draggingRef = useRef(false);
  const delayedFlipRef = useRef<GSAPTween | null>(null);

  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const startTransRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const transRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => setIsFaceUp(faceUp), [faceUp]);
  useEffect(() => setIsLocked(locked), [locked]);

  useEffect(() => {
    return () => {
      delayedFlipRef.current?.kill();
      delayedFlipRef.current = null;
    };
  }, []);

  // 마운트/상태변경 시 초기 3D 상태 세팅
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
  }, [isFaceUp, flipDir, reversed]);

  useEffect(() => {
    applyTransforms();
  }, [applyTransforms]);

  // 카드 넘기는 애니메이션
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
          gsap.set([frontRef.current, backRef.current], {
            opacity: 1,
            visibility: 'visible',
          });
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
    [isFaceUp, flipDir, id, onFlip]
  );

  // 카드의 루트 컨테이너 해당 장소로 이동
  const moveTo = useCallback((x: number, y: number, ms = 380) => {
    if (!rootRef.current) return;
    transRef.current = { x, y };
    gsap.to(rootRef.current, { x, y, duration: ms / 1000, ease: 'power3.out' });
  }, []);

  // 지정된 위치에 놓지 않을 경우 카드 원위치
  const reset = useCallback(
    (ms = 280) => {
      moveTo(0, 0, ms);
      if (rootRef.current) gsap.set(rootRef.current, { zIndex: 1 });
    },
    [moveTo]
  );

  // 카드 상호작용 잠금/해제 상태 토글
  const lock = useCallback(() => {
    setIsLocked(true);
    if (rootRef.current) gsap.set(rootRef.current, { zIndex: 60 });
  }, []);
  const unlock = useCallback(() => {
    setIsLocked(false);
    if (rootRef.current) gsap.set(rootRef.current, { zIndex: 1 });
  }, []);

  // 부모가 flip(), moveTo() 등 명령형으로 호출할 수 있도록
  useImperativeHandle(
    ref,
    () => ({
      flip,
      lock,
      unlock,
      moveTo,
      reset,
      isFaceUp: () => isFaceUp,
      rootEl: rootRef.current,
      cardEl: cardRef.current,
    }),
    [flip, moveTo, reset, isFaceUp, lock, unlock]
  );

  // 호버 중 반응
  const onHoverMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!cardRef.current || animatingRef.current || draggingRef.current) return;

    if (isFaceUp) {
      const r = cardRef.current.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      const rx = gsap.utils.clamp(-8, 8, (-y / r.height) * 18);
      const ry = gsap.utils.clamp(-8, 8, (x / r.width) * 18);
      gsap.to(cardRef.current, {
        rotateX: rx,
        rotateY: ry,
        z: 8,
        duration: 0.16,
      });
    } else {
      if (!backRef.current) return;
      gsap.to(backRef.current, {
        scale: hoverBackScale,
        duration: 0.12,
      });
    }
  };

  // 호버 종료 시 반응
  const onHoverLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: isFaceUp ? 0 : 180 * flipDir,
      z: 0.01,
      duration: 0.18,
    });
    if (backRef.current) {
      gsap.to(backRef.current, { scale: 1, duration: 0.12 });
    }
  };

  // 드래그 시작
  const onPtrDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (animatingRef.current || isLocked || isFaceUp) return;
    draggingRef.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    startPosRef.current = { x: e.clientX, y: e.clientY };
    startTransRef.current = { ...transRef.current };
    onDragStart?.(id);
    if (rootRef.current) gsap.set(rootRef.current, { zIndex: 60 });
    gsap.to(cardRef.current, { scale: hoverBackScale, duration: 0.1 });
  };

  // 드래그 이동
  const onPtrMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!draggingRef.current || !rootRef.current || !startPosRef.current) return;
    const dx = e.clientX - startPosRef.current.x;
    const dy = e.clientY - startPosRef.current.y;
    const nx = startTransRef.current.x + dx;
    const ny = startTransRef.current.y + dy;
    transRef.current = { x: nx, y: ny };
    gsap.to(rootRef.current, { x: nx, y: ny, duration: 0, overwrite: 'auto' });
  };

  // 드래그 종료
  const onPtrUp = (e: React.PointerEvent<HTMLButtonElement>) => {
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
  };

  // 클릭
  const onBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (animatingRef.current || draggingRef.current) return;
    onClick?.(id);
    if (isFaceUp && !isLocked) onOpenModal?.(id);
    e.currentTarget.blur();
  };

  return (
    <div
      ref={rootRef}
      style={{ width }}
      className={clsx(
        'relative select-none [perspective:1200px] aspect-[7/12]',
        'rounded-2xl',
        className
      )}
    >
      <div
        ref={cardRef}
        className={clsx(
          'absolute inset-0 rounded-xl pointer-events-none',
          'shadow-[0_8px_30px_rgba(0,0,0,0.45)] transition-[box-shadow] duration-300'
        )}
      >
        <div
          ref={frontRef}
          className="absolute inset-0 rounded-xl bg-center bg-cover [backface-visibility:hidden]"
          style={{
            backgroundImage: `url(${frontSrc})`,
            transform: 'rotateY(0deg) translateZ(0.2px)',
          }}
          aria-label={name}
        />
        <div
          ref={backRef}
          className="absolute inset-0 rounded-xl bg-center bg-cover [backface-visibility:hidden]"
          style={{
            backgroundImage: `url(${CardBackUrl})`,
            transform: 'rotateY(180deg) translateZ(0.2px)',
          }}
          aria-label="카드 뒷면"
        />
      </div>

      <button
        type="button"
        aria-label={`${name}${isFaceUp ? ' 앞면' : ' 뒷면'}`}
        onClick={onBtnClick}
        onMouseMove={onHoverMove}
        onMouseLeave={onHoverLeave}
        onPointerDown={onPtrDown}
        onPointerMove={onPtrMove}
        onPointerUp={onPtrUp}
        className={clsx(
          'absolute inset-0 outline-none z-10',
          isFaceUp || isLocked ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'
        )}
      />
    </div>
  );
});

export default TarotCard;
