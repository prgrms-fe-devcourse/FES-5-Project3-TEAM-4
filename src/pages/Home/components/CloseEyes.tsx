import gsap from 'gsap';
import { useEffect, useRef, type RefObject } from 'react';

interface Props {
  children: React.ReactNode;
  parentTimeline: RefObject<gsap.core.Timeline | null>;
  label?: string;
}

function CloseEyes({ parentTimeline, label, children }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!parentTimeline.current) return;
      gsap.set([topRef.current, bottomRef.current], { height: 0 });
      gsap.set(blurRef.current, { filter: 'blur(0px)' });

      parentTimeline.current
        .to(blurRef.current, { filter: 'blur(12px)', duration: 0.35 }, label)
        .to(topRef.current, { height: '50vh', duration: 0.7 }, label)
        .to(bottomRef.current, { height: '60vh', duration: 0.7 }, label);
    }, wrapRef);

    return () => ctx.revert();
  }, [parentTimeline, label]);

  return (
    <div ref={wrapRef}>
      <div
        ref={topRef}
        className="absolute left-0 top-0 w-full h-0 bg-main-black z-20 pointer-events-none will-change-[height] shadow-lg shadow-main-black"
      />
      <div ref={blurRef} className="absolute inset-0 will-change-[filter]">
        {children}
      </div>
      <div
        ref={bottomRef}
        className="absolute left-0 -bottom-10 w-full h-0 bg-main-black z-20 pointer-events-none will-change-[height] shadow-[0_-10px_15px_-3px] shadow-main-black"
      />
    </div>
  );
}
export default CloseEyes;
