import tarotBuilding from '@/assets/home/tarotBuilding3x.png';
import leftBuilding from '@/assets/home/leftBuilding3x.png';
import door from '@/assets/home/door.png';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroGrowUniform() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const buildingsRef = useRef<HTMLDivElement>(null);
  const doorRef = useRef<HTMLImageElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      gsap.set(buildingsRef.current, { transformOrigin: '50% 100%' });
      gsap.set([topRef.current, bottomRef.current], { height: 0 });
      if (sectionRef.current) gsap.set(sectionRef.current, { filter: 'blur(0px)' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=800vh',
          scrub: 1.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          markers: true,
        },
        defaults: { ease: 'none' },
      });

      tl.to(buildingsRef.current, { scale: 1.6, ease: 'none', duration: 3 })
        .to(buildingsRef.current, { scale: 3.0, ease: 'none', duration: 2 })
        .to(doorRef.current, { rotationY: '20', duration: 4 })
        .to(doorRef.current, { rotationY: '85', duration: 2 })
        .add('close')
        .to(
          sectionRef.current ?? {},
          { filter: reduceMotion ? 'blur(0px)' : 'blur(12px)', duration: reduceMotion ? 0 : 0.35 },
          'close'
        )
        .to(topRef.current, { height: '50vh', duration: reduceMotion ? 0 : 0.45 }, 'close')
        .to(bottomRef.current, { height: '50vh', duration: reduceMotion ? 0 : 0.45 }, 'close');
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative fle flex-col justify-end h-screen">
      <div
        ref={topRef}
        className="fixed left-0 top-0 w-full h-0 bg-main-black z-50 pointer-events-none will-change-[height]"
      />
      <div className="w-full h-50"></div>
      <div
        ref={buildingsRef}
        id="buildings"
        className="flex flex-row justify-center items-end w-screen absolute bottom-0 origin-bottom transform-gpu select-none pointer-events-none"
      >
        <img src={leftBuilding} className="object-contain w-1/6" />
        <div id="tarot-building" className="w-1/6 h-full relative">
          <div className="h-[140px] bg-amber-200 absolute z-20 right-20/81 bottom-4/81 w-2/10 origin-right" />
          <img
            ref={doorRef}
            src={door}
            alt="door"
            className="absolute z-20 right-20/81 bottom-4/81 w-2/10 origin-right"
          />
          <img
            ref={imgRef}
            src={tarotBuilding}
            alt="hero"
            className="object-contain"
            draggable={false}
          />
        </div>
        <img src={leftBuilding} className="object-contain w-1/6" />
      </div>
      <div
        ref={bottomRef}
        className="fixed left-0 bottom-0 w-full h-0 bg-main-black z-50 pointer-events-none will-change-[height]"
      />
    </section>
  );
}
