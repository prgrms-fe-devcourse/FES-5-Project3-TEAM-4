import { useCallback, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

import Section01 from './Section01/Section01';
import Section02 from './Section02/Section02';
import FirstTarot from './Section03/FirstTarot/FirstTarot';
import SecondTarot from './Section03/SecondTarot/SecondTarot';
import LastTarot from './Section03/LastTarot/LastTarot';

import NightStarBackGround from './components/NightStarBackGround';

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollSmoother);

function Home() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const s1Ref = useRef<HTMLDivElement>(null);

  const s2Ref = useRef<HTMLDivElement>(null);
  const firstTarotRef = useRef<HTMLDivElement>(null);
  const secondTarotRef = useRef<HTMLDivElement>(null);
  const lastTarotRef = useRef<HTMLDivElement>(null);

  const s1TLRef = useRef<gsap.core.Timeline | null>(null);

  const s2TLRef = useRef<gsap.core.Timeline | null>(null);
  const firstTarotTLRef = useRef<gsap.core.Timeline | null>(null);
  const secondTarotTLRef = useRef<gsap.core.Timeline | null>(null);
  const lastTarotTLRef = useRef<gsap.core.Timeline | null>(null);

  const registerS1 = useCallback((adder: (tl: gsap.core.Timeline) => void) => {
    if (!s1TLRef.current) {
      s1TLRef.current = gsap.timeline({ defaults: { ease: 'none' }, paused: true });
    }
    adder(s1TLRef.current);
  }, []);

  const registerS2 = useCallback((adder: (tl: gsap.core.Timeline) => void) => {
    if (!s2TLRef.current) {
      s2TLRef.current = gsap.timeline({ defaults: { ease: 'none' }, paused: true });
    }
    adder(s2TLRef.current);
  }, []);

  const registerFirstTarot = useCallback((adder: (tl: gsap.core.Timeline) => void) => {
    if (!firstTarotTLRef.current) {
      firstTarotTLRef.current = gsap.timeline({ defaults: { ease: 'none' }, paused: true });
    }
    adder(firstTarotTLRef.current);
  }, []);

  const registerSecondTarot = useCallback((adder: (tl: gsap.core.Timeline) => void) => {
    if (!secondTarotTLRef.current) {
      secondTarotTLRef.current = gsap.timeline({ defaults: { ease: 'none' }, paused: true });
    }
    adder(secondTarotTLRef.current);
  }, []);

  const registerLastTarot = useCallback((adder: (tl: gsap.core.Timeline) => void) => {
    if (!lastTarotTLRef.current) {
      lastTarotTLRef.current = gsap.timeline({ defaults: { ease: 'none' }, paused: true });
    }
    adder(lastTarotTLRef.current);
  }, []);

  useGSAP(() => {
    ScrollTrigger.getById('sec01')?.kill();
    ScrollTrigger.getById('sec02')?.kill();
    ScrollTrigger.getById('firstTarot')?.kill();
    ScrollTrigger.getById('secondTarot')?.kill();
    ScrollTrigger.getById('lastTarot')?.kill();

    if (s1Ref.current && s1TLRef.current) {
      ScrollTrigger.create({
        id: 'sec01',
        trigger: s1Ref.current,
        start: 'top top',
        end: '+=1000vh',
        scrub: 1.5,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        animation: s1TLRef.current,
        // markers: true,
      });
    }
    if (s2Ref.current && s2TLRef.current) {
      ScrollTrigger.create({
        id: 'sec02',
        trigger: s2Ref.current,
        start: 'top top',
        end: '+=1000vh',
        scrub: 2,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        animation: s2TLRef.current,
        // markers: true,
      });
    }
    if (firstTarotRef.current && firstTarotTLRef.current) {
      ScrollTrigger.create({
        id: 'firstTarot',
        trigger: firstTarotRef.current,
        start: 'top top',
        end: '+=1000vh',
        scrub: 2,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        animation: firstTarotTLRef.current,
        // markers: true,
      });
    }
    if (secondTarotRef.current && secondTarotTLRef.current) {
      ScrollTrigger.create({
        id: 'secondTarot',
        trigger: secondTarotRef.current,
        start: 'top top',
        end: '+=1000vh',
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        animation: secondTarotTLRef.current,
        // markers: { startColor: 'green', endColor: 'red' },
      });
    }
    if (lastTarotRef.current && lastTarotTLRef.current) {
      ScrollTrigger.create({
        id: 'lastTarot',
        trigger: lastTarotRef.current,
        start: 'top top',
        end: '+=1000vh',
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        animation: lastTarotTLRef.current,
        // markers: { startColor: 'green', endColor: 'red' },
      });
    }
    // 한 프레임 뒤 측정값 정렬
    requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      ScrollTrigger.getById('sec01')?.kill();
      ScrollTrigger.getById('sec02')?.kill();
      ScrollTrigger.getById('firstTarot')?.kill();
      ScrollTrigger.getById('secondTarot')?.kill();
      ScrollTrigger.getById('lastTarot')?.kill();
    };
  }, []);

  return (
    <div ref={wrapperRef}>
      <div ref={contentRef} className="z-1 w-full">
        <Section01 ref={s1Ref} register={registerS1} />
        <Section02 ref={s2Ref} register={registerS2} />
        <div>
          <FirstTarot ref={firstTarotRef} register={registerFirstTarot} />
          <SecondTarot ref={secondTarotRef} register={registerSecondTarot} />
          <LastTarot ref={lastTarotRef} register={registerLastTarot} />
        </div>
        <NightStarBackGround
          sizeX="100vw"
          sizeY="100vh"
          className="fixed inset-0 bg-none bg-main-black"
        />
      </div>
    </div>
  );
}

export default Home;
