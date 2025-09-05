import { useEffect, useRef, type RefObject } from 'react';
import { useYellowGlowText } from '../hooks/useYellowGlowText';
import gsap from 'gsap';
import tw from '@/common/utils/tw';

interface Props {
  parentTimeline: RefObject<gsap.core.Timeline | null>;
  children: React.ReactNode;
  className?: string;

  startLabel?: string;
  endLabel?: string;
}

function GlowTextSpacingChange_({
  parentTimeline,
  startLabel,
  endLabel,
  children,
  className,
}: Props) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useYellowGlowText(textRef);

  useEffect(() => {
    if (!textRef.current) return;

    const ctx = gsap.context(() => {
      if (!parentTimeline.current) return;
      parentTimeline.current
        .fromTo(
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
        )
        .to(textRef.current, { opacity: 0, duration: 1, ease: 'power2.inOut' }, endLabel);
    }, textRef);

    return () => ctx.revert();
  }, [parentTimeline, startLabel, endLabel]);

  return (
    <h1
      ref={textRef}
      className={tw('text-main-white text-center tracking-[0.35rem] opacity-0', className)}
    >
      {children}
    </h1>
  );
}
export default GlowTextSpacingChange_;
