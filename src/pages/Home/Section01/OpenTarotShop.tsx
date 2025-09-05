import tarotShop from '@/assets/home/tarotShop3x.png';
import door from '@/assets/home/door.png';
import gsap from 'gsap';
import { useEffect, useRef, type RefObject } from 'react';

interface Props {
  parentTimeline: RefObject<gsap.core.Timeline | null>;
  label?: string;
}
function OpenTarotShop({ parentTimeline, label }: Props) {
  const tarotShopWrapperRef = useRef<HTMLDivElement>(null);
  const tarotShopRef = useRef<HTMLImageElement>(null);
  const doorRef = useRef<HTMLImageElement>(null);
  const insideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!parentTimeline.current) return;
      gsap.set(tarotShopWrapperRef.current, { transformPerspective: 800 });

      parentTimeline.current.to(
        doorRef.current,
        { rotationY: '85', duration: 3, ease: 'power3.inOut' },
        label
      );
    }, tarotShopWrapperRef);

    return () => ctx.revert();
  }, [parentTimeline, label]);

  return (
    <div ref={tarotShopWrapperRef} className="w-1/6 h-full relative">
      <div
        ref={insideRef}
        className="h-8/19 bg-amber-200 absolute z-20 right-20/81 bottom-4/81 w-2/10 origin-right"
      />
      <img
        ref={doorRef}
        src={door}
        alt="door"
        className="absolute z-20 right-20/81 bottom-4/81 w-2/10 origin-right"
      />
      <img
        ref={tarotShopRef}
        src={tarotShop}
        alt="hero"
        className="object-contain"
        draggable={false}
      />
    </div>
  );
}
export default OpenTarotShop;
