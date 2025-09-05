import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useLayoutEffect, useRef } from 'react';
import GlowTextSpacingChange from '../components/GlowTextSpacingChange';
import CrystalSphere from '@/assets/Tarot/crystal_sphere.png';
import cardBack from '@/assets/Tarot/tarot_back.svg';
// import OpenEyes from '../components/OpenEyes';
import BgImg from '/velvet.png';
import { NavLink } from 'react-router';

gsap.registerPlugin(ScrollToPlugin);

interface Props {
  ref?: React.RefObject<HTMLElement | null>;
  register: (adder: (tl: gsap.core.Timeline) => void) => void;
}

function Section05({ ref: outerRef, register }: Props) {
  const sectionRef05 = useRef<HTMLDivElement>(null);
  const parentTLRef = useRef<gsap.core.Timeline | null>(null);

  const CrystalSphereRef = useRef<HTMLImageElement | null>(null);

  const cardRef1 = useRef<HTMLDivElement | null>(null);
  const cardRef2 = useRef<HTMLDivElement | null>(null);

  const scopeRef = outerRef ?? sectionRef05;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      register((tl) => {
        parentTLRef.current = tl;

        tl.addLabel('open', 0).addLabel('text', 'open+=3');
      });
    }, scopeRef);

    return () => ctx.revert();
  }, [scopeRef, register]);

  const handleScrollUp = () => {
    gsap.to(window, { duration: 0.3, scrollTo: 0 });
  };

  return (
    <section ref={scopeRef} className="overflow-hidden w-screen h-screen relative">
      {/* <OpenEyes parentTimeline={parentTLRef}> */}
      <div
        className="w-screen h-screen"
        style={{
          backgroundImage: `url(${BgImg})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        <img
          ref={CrystalSphereRef}
          src={CrystalSphere}
          aria-hidden
          alt=""
          className="pointer-events-none absolute z-0 w-[400px] h-[400px] left-[50%] top-[40%] -translate-x-1/2 -translate-y-10/23 object-contain"
        />
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/3"
          style={{ perspective: 1000 }}
        >
          <GlowTextSpacingChange parentTimeline={parentTLRef} startLabel="text">
            너의 운명의 카드를 뽑아봐
          </GlowTextSpacingChange>
          <div className="flex flex-row gap-60 transform-3d">
            <div
              ref={cardRef1}
              className="relative min-w-42 min-h-72 shadow-lg rounded-xl flex items-center justify-center transform-3d"
              onClick={handleScrollUp}
            >
              <img src={cardBack} />
            </div>

            <NavLink to={'question'}>
              <div
                ref={cardRef2}
                className="relative min-w-42 min-h-72 shadow-lg rounded-xl flex items-center justify-center transform-3d cursor-pointer"
              >
                <img src={cardBack} />
              </div>
            </NavLink>
          </div>
        </div>
      </div>
      {/* </OpenEyes> */}
    </section>
  );
}
export default Section05;
