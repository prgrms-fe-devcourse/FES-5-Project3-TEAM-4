import { useEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import tw from '@/common/utils/tw';

interface Props {
  parentTimeline: RefObject<gsap.core.Timeline | null>;
  children: React.ReactNode;
  className?: string;

  startLabel?: string;
  endLabel?: string;
}

function SplitAnswer({ parentTimeline, startLabel, endLabel, children, className }: Props) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const ctx = gsap.context(() => {
      if (!parentTimeline.current) return;
      parentTimeline.current.fromTo(
        textRef.current,
        { opacity: 0, letterSpacing: '0.35rem', y: -16 },
        {
          opacity: 1,
          letterSpacing: '0rem',
          y: 0,
          ease: 'power2.out',
          duration: 2,
          overwrite: 'auto',
        },
        startLabel
      );
    }, textRef);

    return () => ctx.revert();
  }, [parentTimeline, startLabel, endLabel]);

  return (
    <div
      ref={textRef}
      className={tw('text-main-white text-center tracking-[0.35rem] opacity-0', className)}
    >
      {children}
    </div>
  );
}
export default SplitAnswer;
