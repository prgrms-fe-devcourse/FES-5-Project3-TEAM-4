import { useEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import tw from '@/common/utils/tw';
import cardBack from '@/assets/Tarot/tarot_back.svg';
import BoxGlowEffect from './BoxGlowEffect';

interface Props {
  parentTimeline: RefObject<gsap.core.Timeline | null>;
  label?: string;
  className?: string;
  imgFront: string;
  imgBack?: string;
  x?: number;
  y?: number;
}

function CardSpin({
  parentTimeline,
  label,
  className,
  imgFront,
  imgBack = cardBack,
  x = 0,
  y = 0,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cxt = gsap.context(() => {
      gsap.set(cardRef.current, { transformStyle: 'preserve-3d' });
      if (!parentTimeline.current) return;
      parentTimeline.current.from(
        cardRef.current,
        { y: y, x: x, rotationY: '680', opacity: 0, duration: 4, ease: 'power3.Out' },
        label
      );
    }, cardRef);

    return () => cxt.revert();
  }, [parentTimeline, label, x, y]);
  return (
    <div
      ref={cardRef}
      className={tw(
        'relative min-w-42 min-h-72 shadow-lg rounded-xl flex items-center justify-center transform-3d',
        className
      )}
    >
      <BoxGlowEffect className="w-full h-full">
        <div className="min-w-42 min-h-72"></div>
      </BoxGlowEffect>
      <div
        className="absolute inset-0 grid place-items-center rounded-2xl"
        style={{
          backfaceVisibility: 'hidden',
        }}
      >
        <img src={imgFront} />
      </div>
      <div
        className="absolute inset-0 grid place-items-center rounded-2xl"
        style={{
          transform: 'rotateY(180deg)',
          backfaceVisibility: 'hidden',
        }}
      >
        <img src={imgBack} className="min-w-42 min-h-72 inset-0" />
      </div>
    </div>
  );
}
export default CardSpin;
