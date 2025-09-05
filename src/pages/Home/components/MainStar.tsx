import star from '@/assets/home/star.svg';
import gsap from 'gsap';
import { useEffect, useRef, type RefObject } from 'react';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useMainStarYoyo } from '../hooks/useMainStarYoyo';
import tw from '@/common/utils/tw';

gsap.registerPlugin(MotionPathPlugin);

interface Props {
  parentTimeline: RefObject<gsap.core.Timeline | null>;
  startLabel?: string;
  endLabel?: string;
  from?: { opacity?: number; x: number | string; y: number | string };
  fromDuration?: number;
  to?: { x: number | string; y: number | string }[];
  toDuration?: number;
  curviness?: number;
  className?: string;
}

function MainStar({
  parentTimeline,
  startLabel,
  endLabel,
  from = { opacity: 1, x: 0, y: 0 },
  fromDuration = 2,
  to = [{ x: 0, y: 0 }],
  toDuration = 3,
  curviness = 0,
  className,
}: Props) {
  const mainStarRef = useRef<HTMLImageElement>(null);
  const starRef = useRef<HTMLImageElement>(null);

  useMainStarYoyo(mainStarRef);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!parentTimeline.current) return;

      parentTimeline.current
        .from(mainStarRef.current, { ...from, duration: fromDuration }, startLabel)
        .to(
          mainStarRef.current,
          {
            motionPath: {
              path: [...to],
              curviness: curviness,
              autoRotate: true,
            },
            duration: toDuration,
            ease: 'power2.in',
          },
          endLabel
        );
    }, mainStarRef);

    return () => ctx.revert();
  }, [parentTimeline, startLabel, from, to, curviness, endLabel, fromDuration, toDuration]);

  return (
    <div
      ref={starRef}
      className={tw('flex justify-center items-center flex-col relative', className)}
    >
      <img ref={mainStarRef} src={star} alt="메인 별" className="w-[12rem]" />
    </div>
  );
}
export default MainStar;
