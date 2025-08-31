import { forwardRef, useEffect, useImperativeHandle, useRef, useState, useCallback } from 'react';
import clsx from 'clsx';
import CardBackUrl from '@/assets/Tarot/tarot_back.svg?url';
import type { TarotCardHandle, TarotCardProps } from '../types/CardProps';

import useApplyTransforms from '../hooks/useApplyTransforms';
import useCardFlip from '../hooks/useCardFlip';
import useCardHover from '../hooks/useCardHover';
import useCardDrag from '../hooks/useCardDrag';

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

  const [isLocked, setIsLocked] = useState(locked);

  const { isFaceUp, setIsFaceUp, flip, animatingRef } = useCardFlip({
    id,
    faceUpProp: faceUp,
    flipDir,
    onFlip,
    cardRef,
    frontRef,
    backRef,
  });

  useApplyTransforms({
    rootRef,
    cardRef,
    frontRef,
    backRef,
    isFaceUp,
    flipDir,
    reversed,
  });

  const { draggingRef, isLockedRef, onPtrDown, onPtrMove, onPtrUp, moveTo, reset, lock, unlock } =
    useCardDrag({
      id,
      lockedProp: locked,
      isFaceUp,
      hoverBackScale,
      onDragStart,
      onDragEnd,
      rootRef,
      cardRef,
    });

  const { onHoverMove, onHoverLeave } = useCardHover({
    isFaceUp,
    flipDir,
    hoverBackScale,
    animatingRef,
    draggingRef,
    cardRef,
    backRef,
  });

  useEffect(() => {
    setIsFaceUp(faceUp);
  }, [faceUp, setIsFaceUp]);

  useEffect(() => {
    setIsLocked(locked);
    isLockedRef.current = locked;
  }, [locked, isLockedRef]);

  const onBtnClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (animatingRef.current || draggingRef.current) return;
      onClick?.(id);
      if (isFaceUp && !isLocked) onOpenModal?.(id);
      e.currentTarget.blur();
    },
    [animatingRef, draggingRef, isFaceUp, isLocked, id, onClick, onOpenModal]
  );

  useImperativeHandle(
    ref,
    () => ({
      flip,
      lock: () => {
        setIsLocked(true);
        lock();
      },
      unlock: () => {
        setIsLocked(false);
        unlock();
      },
      moveTo,
      reset,
      isFaceUp: () => isFaceUp,
      rootEl: rootRef.current,
      cardEl: cardRef.current,
    }),
    [flip, lock, unlock, moveTo, reset, isFaceUp]
  );

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
          className="absolute inset-0 rounded-md bg-center bg-cover [backface-visibility:hidden]"
          style={{
            backgroundImage: `url(${frontSrc})`,
            transform: 'rotateY(0deg) translateZ(0.2px)',
          }}
          aria-label={name}
        />
        <div
          ref={backRef}
          className="absolute inset-0 rounded-md bg-center bg-cover [backface-visibility:hidden]"
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
