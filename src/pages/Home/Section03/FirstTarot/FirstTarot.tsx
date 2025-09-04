import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

// import card from '@/assets/home/Ace_of_Pentacles.webp';
import FirstQ from './FirstQ';

import AceOfPentacles from './AceOfPentacles';
import MainStar from '../../components/MainStar';
import CardSpin from '../CardSpin';
import SplitAnswer from '../SplitAnswer';
import { useFilterCardName } from '@/common/store/cardStore';

interface Props {
  ref?: React.RefObject<HTMLElement | null>;
  register: (adder: (tl: gsap.core.Timeline) => void) => void;
}

function FirstTarot({ ref: outerRef, register }: Props) {
  const sectionRef03 = useRef<HTMLDivElement>(null);
  const parentTLRef = useRef<gsap.core.Timeline | null>(null);
  const textBoxRef = useRef<HTMLImageElement>(null);

  const scopeRef = outerRef ?? sectionRef03;

  const cardImg = useFilterCardName('Ace of Pentacles')[0].image_url;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      register((tl) => {
        parentTLRef.current = tl;
        // tl.addLabel('text', '>').addLabel('spin', 'text+=2');
        tl.addLabel('firstQuestion', 0)
          .addLabel('spin', 'firstQuestion+=6')
          .addLabel('cardName', 'spin+=0.5')
          .addLabel('textBox', 'cardName+=1')
          .from(textBoxRef.current, { opacity: 0, y: 100, duration: 1 }, 'textBox')
          .addLabel('text1', 'textBox+=1')
          .addLabel('text2', 'text1+=1')
          .addLabel('endStar', 'text2+=4');
      });
    }, scopeRef);

    return () => ctx.revert();
  }, [scopeRef, register]);

  return (
    <section
      ref={scopeRef}
      className=" h-screen w-screen relative overflow-hidden flex flex-col justify-center items-center "
    >
      <MainStar
        parentTimeline={parentTLRef}
        className="absolute top-[5vh]"
        to={[
          { x: '20vw', y: '20vh' },
          { x: '-30vw', y: '50vh' },
          { x: '30vw', y: '60vh' },
          { x: '30vw', y: '95vh' },
        ]}
        curviness={1.5}
        endLabel="endStar"
      />
      <div className="absolute w-screen z-0 flex flex-col justify-center items-center gap-10">
        <FirstQ parentTimeline={parentTLRef} label="firstQuestion" />

        <div className="w-screen flex flex-row justify-center items-center gap-9 ">
          <CardSpin
            parentTimeline={parentTLRef}
            label="spin"
            imgFront={cardImg}
            x={-200}
            y={-100}
          />

          <div>
            <AceOfPentacles parentTimeline={parentTLRef} label="cardName" />
            <div
              ref={textBoxRef}
              className="min-w-115 flex flex-col items-center justify-center bg-main-white/25 shadow-main-white shadow-[10px,-10px,10px,-10px] rounded-lg gap-1"
            >
              <SplitAnswer parentTimeline={parentTLRef} startLabel="text1" className="mt-4">
                돈과 관련해 새로운 기회와 시작이 주어진다.
              </SplitAnswer>

              <SplitAnswer parentTimeline={parentTLRef} startLabel="text2" className="mb-4">
                그것이 곧 안정적이고 지속적인 부로 이어진다.
              </SplitAnswer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default FirstTarot;
