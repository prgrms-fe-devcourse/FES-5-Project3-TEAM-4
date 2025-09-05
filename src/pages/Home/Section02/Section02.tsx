import gsap from 'gsap';
import { useLayoutEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MainStar from '../components/MainStar';
import GlowTextSpacingChange from '../components/GlowTextSpacingChange';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  ref?: React.RefObject<HTMLElement | null>;
  register: (adder: (tl: gsap.core.Timeline) => void) => void;
}

function Section02({ ref: outerRef, register }: Props) {
  const sectionRef02 = useRef<HTMLDivElement>(null);
  const parentTLRef = useRef<gsap.core.Timeline | null>(null);

  const scopeRef = outerRef ?? sectionRef02;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      register((tl) => {
        parentTLRef.current = tl;

        tl.addLabel('text1', 0)
          .addLabel('starStart', 0)
          .addLabel('text1End', 'text1+=2.5')
          .addLabel('text2', 'text1End+=1.5')
          .addLabel('text2End', 'text2+=2.5')

          .addLabel('text3', 'text2End+=1.5')
          .addLabel('starEnd', 'text3+=3');
      });
    }, scopeRef);

    return () => ctx.revert();
  }, [scopeRef, register]);

  return (
    <section
      ref={scopeRef}
      className="section overflow-hidden w-screen h-screen relative flex flex-col justify-center items-center [perspective:1000px]"
    >
      <MainStar
        parentTimeline={parentTLRef}
        startLabel="starStart"
        endLabel="starEnd"
        from={{ opacity: 0, x: 0, y: -100 }}
        to={[{ x: 0, y: 600 }]}
        toDuration={1}
      />
      <div className="relative">
        <GlowTextSpacingChange
          parentTimeline={parentTLRef}
          startLabel="text1"
          endLabel="text1End"
          className="absolute top-0 left-0 translate-x-[50%] text-center"
        >
          "혹시 고민이 있나요?"
        </GlowTextSpacingChange>
        <GlowTextSpacingChange
          parentTimeline={parentTLRef}
          startLabel="text2"
          endLabel="text2End"
          className="absolute top-0 left-0 translate-x-1/2"
        >
          "내게 질문 해 보세요."
        </GlowTextSpacingChange>
        <GlowTextSpacingChange parentTimeline={parentTLRef} startLabel="text3">
          "제가 당신이 가야 할 길을 보여줄게요."
        </GlowTextSpacingChange>
      </div>
    </section>
  );
}
export default Section02;
