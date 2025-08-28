import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';
import { gsap } from 'gsap';
import clsx from 'clsx';
import CardBack from '@/assets/Tarot/tarot_back.svg';

type TarotCardProps = {
  id: number;
  name: string;
  frontSrc: string;
  faceUp?: boolean;
  reversed?: boolean;
  width?: number | string;
  onFlip?: (id: number, faceUp: boolean) => void;
  onClick?: (id: number) => void;
  className?: string;
  clickMode?: 'flip' | 'none';
  flipDir?: 1 | -1;
};

export type TarotCardHandle = {
  flip: (to?: boolean) => void;
  rootEl: HTMLDivElement | null;
  cardEl: HTMLDivElement | null;
  isFaceUp: () => boolean;
};

const TarotCard = forwardRef<TarotCardHandle, TarotCardProps>(function TarotCard(
  {
    id,
    name,
    frontSrc,
    faceUp = false,
    reversed = false,
    width = 220,
    onFlip,
    onClick,
    className,
    clickMode = 'flip',
    flipDir = -1,
  },
  ref
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFaceUp, setIsFaceUp] = useState(faceUp);
  const animatingRef = useRef(false);

  useEffect(() => setIsFaceUp(faceUp), [faceUp]);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.set(cardRef.current, {
      transformStyle: 'preserve-3d',
      willChange: 'transform',
      z: 0.01,
    });
    gsap.set(cardRef.current, { rotateY: isFaceUp ? 0 : 180 * flipDir, force3D: false });
    gsap.set(cardRef.current, { rotateZ: reversed ? 180 : 0, force3D: false });
  }, [isFaceUp, reversed, flipDir]);

  const ratioH = useMemo(() => Math.round((Number(width) || 220) * 1.75), [width]);

  const runFlip = useCallback(
    (to?: boolean) => {
      if (!cardRef.current) return;
      if (animatingRef.current) return;
      const next = typeof to === 'boolean' ? to : !isFaceUp;
      animatingRef.current = true;
      gsap.to(cardRef.current, {
        rotateY: next ? 0 : 180 * flipDir,
        duration: 0.5,
        ease: 'power3.inOut',
        force3D: true,
        onComplete: () => {
          gsap.set(cardRef.current, {
            rotateX: 0,
            rotateY: next ? 0 : 180 * flipDir,
            z: 0.01,
            force3D: false,
          });
          animatingRef.current = false;
        },
      });
      setIsFaceUp(next);
      onFlip?.(id, next);
    },
    [isFaceUp, flipDir, id, onFlip]
  );

  useImperativeHandle(
    ref,
    () => ({
      flip: runFlip,
      rootEl: rootRef.current,
      cardEl: cardRef.current,
      isFaceUp: () => isFaceUp,
    }),
    [runFlip, isFaceUp]
  );

  const handleHover = (e: React.MouseEvent) => {
    if (!rootRef.current || !cardRef.current) return;
    if (animatingRef.current) return;
    const rect = rootRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rx = gsap.utils.clamp(-8, 8, (-y / rect.height) * 20);
    const ry = gsap.utils.clamp(-8, 8, (x / rect.width) * 20);
    gsap.to(cardRef.current, {
      rotateX: rx,
      rotateY: (isFaceUp ? 0 : 180 * flipDir) + ry,
      duration: 0.25,
      force3D: true,
    });
  };

  const handleLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: isFaceUp ? 0 : 180 * flipDir,
      duration: 0.35,
      ease: 'power2.out',
      onComplete: () => {
        gsap.set(cardRef.current, { z: 0.01, force3D: false });
        animatingRef.current = false;
      },
    });
  };

  return (
    <div
      ref={rootRef}
      style={{ width, height: ratioH }}
      className={clsx('relative select-none [perspective:1200px] group', 'rounded-2xl', className)}
    >
      <div
        ref={cardRef}
        className={clsx(
          'absolute inset-0 rounded-xl pointer-events-none',
          'shadow-[0_8px_30px_rgba(0,0,0,0.45)] transition-[box-shadow] duration-300',
          'group-hover:shadow-main-white'
        )}
      >
        <img
          src={frontSrc}
          alt={name}
          draggable={false}
          className={clsx(
            'absolute inset-0 w-full h-full object-cover rounded-xl',
            '[backface-visibility:hidden]'
          )}
          style={{ transform: 'rotateY(0deg)' }}
        />
        <img
          src={CardBack}
          alt="카드 뒷면"
          draggable={false}
          className={clsx(
            'absolute inset-0 w-full h-full object-cover rounded-xl',
            '[backface-visibility:hidden]'
          )}
          style={{ transform: `rotateY(${180 * flipDir}deg)` }}
        />
      </div>

      <button
        type="button"
        aria-label={`${name}${isFaceUp ? ' 앞면' : ' 뒷면'}`}
        onClick={(e) => {
          if (animatingRef.current) return;
          if (clickMode === 'flip') runFlip();
          onClick?.(id);
          e.currentTarget.blur();
        }}
        onMouseMove={handleHover}
        onMouseLeave={handleLeave}
        className="absolute inset-0 outline-none z-10"
      />
    </div>
  );
});

export default TarotCard;
