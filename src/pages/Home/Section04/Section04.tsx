import gsap from 'gsap';
import { useLayoutEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import flash from './flash.svg';

import MainStar from '../components/MainStar';
import GlowTextSpacingChange from '../components/GlowTextSpacingChange';

import CloseEyes from '../components/CloseEyes';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  ref?: React.RefObject<HTMLElement | null>;
  register: (adder: (tl: gsap.core.Timeline) => void) => void;
}

function Section04({ ref: outerRef, register }: Props) {
  const sectionRef04 = useRef<HTMLDivElement>(null);
  const parentTLRef = useRef<gsap.core.Timeline | null>(null);

  const flashRef = useRef<HTMLImageElement | null>(null);

  const scopeRef = outerRef ?? sectionRef04;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      register((tl) => {
        parentTLRef.current = tl;

        tl.addLabel('startStar', 0)
          .addLabel('text1', 'startStar+=2')
          .addLabel('flash', 'text1+=3')
          .fromTo(
            flashRef.current,
            { opacity: 0, scale: 0.2 },
            { opacity: 1, scale: 12, ease: 'power2.out', duration: 0.5 },
            'flash'
          )
          .addLabel('close', 'flash+=0.5');
      });
    }, scopeRef);

    return () => ctx.revert();
  }, [scopeRef, register]);

  return (
    <>
      <section ref={scopeRef} className="section overflow-hidden w-screen h-screen relative">
        <CloseEyes parentTimeline={parentTLRef} label={'close'}>
          <div className="flex flex-col justify-center items-center absolute top-1/2 left-1/2 -translate-1/2">
            <MainStar
              parentTimeline={parentTLRef}
              className=""
              startLabel="startStar"
              endLabel="endStar"
              from={{ y: '-100vh', opacity: 1, x: 0 }}
            />

            <GlowTextSpacingChange
              parentTimeline={parentTLRef}
              startLabel="text1"
              endLabel="text1End"
            >
              내가 너의 길을 비춰줄게
            </GlowTextSpacingChange>
            <img ref={flashRef} src={flash} alt="섬광효과" className="opacity-0 absolute" />
          </div>
        </CloseEyes>
      </section>
    </>
  );
}
export default Section04;
