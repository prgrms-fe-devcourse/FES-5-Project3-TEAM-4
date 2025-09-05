import leftBuilding from '@/assets/home/leftBuilding3x.png';
import gsap from 'gsap';
import React, { useLayoutEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CloseEyes from '../components/CloseEyes';
import OpenTarotShop from './OpenTarotShop';
import NightStarBackGround from '../components/NightStarBackGround';

import { preload } from 'react-dom';
import Title from './Title';
import { NavLink } from 'react-router';
preload(leftBuilding, { as: 'image' }); // 첫 씬 자원 선로딩

gsap.registerPlugin(ScrollTrigger);

interface Props {
  ref?: React.RefObject<HTMLElement | null>;
  register: (adder: (tl: gsap.core.Timeline) => void) => void;
}

function Section01({ ref: outerRef, register }: Props) {
  const sectionRef01 = useRef<HTMLDivElement>(null);
  const buildingsRef = useRef<HTMLDivElement>(null);

  const parentTLRef = useRef<gsap.core.Timeline | null>(null);

  const scopeRef = outerRef ?? sectionRef01;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(buildingsRef.current, { transformOrigin: '50% 100%' });

      register((tl) => {
        parentTLRef.current = tl;
        tl.addLabel('scaleUp', 0)
          .to(buildingsRef.current, { scale: 3, duration: 1, ease: 'power3.in' }, 'scaleUp')
          .addLabel('openDoor', 'scaleUp+=0.5')
          .addLabel('close', 'openDoor+=2');
      });
    }, scopeRef);
    return () => ctx.revert();
  }, [scopeRef, register]);

  return (
    <section
      ref={scopeRef}
      className="section bg-main-black h-screen w-screen relative flex flex-col justify-center items-center overflow-hidden"
    >
      <CloseEyes parentTimeline={parentTLRef} label="close">
        <div className="absolute left-1/2 top-3/10 -translate-x-1/2 flex flex-col justify-center items-center gap-5">
          <Title />
          <button className="border-2 text-main-white rounded-lg w-34 px-2 py-1 hover:shadow-main-white hover:shadow-lg">
            <NavLink to={'tarot'}>타로 뽑으러 가기</NavLink>
          </button>
        </div>
        <div
          ref={buildingsRef}
          id="buildings"
          className="flex flex-row justify-center items-end w-screen absolute bottom-0 origin-bottom transform-gpu select-none pointer-events-none"
        >
          <img src={leftBuilding} className="object-contain w-1/6" />
          <OpenTarotShop parentTimeline={parentTLRef} label="openDoor" />
          <img src={leftBuilding} className="object-contain w-1/6" />
        </div>
        <NightStarBackGround
          sizeX="100vw"
          sizeY="100vh"
          className="absolute inset-0 pointer-events-none"
        />
      </CloseEyes>
    </section>
  );
}
export default Section01;
