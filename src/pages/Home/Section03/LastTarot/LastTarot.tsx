import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

// import card1 from '@/assets/home/Three_of_Swords.webp';
// import card2 from '@/assets/home/Two_of_Cups.webp';
import LastQ from './LastQ';

import ThreeOfSwords from './ThreeOfSwords';
import TwoOfCups from './TwoOfCups';
import MainStar from '../../components/MainStar';
import CardSpin from '../../components/CardSpin';
import SplitAnswer from '../components/SplitAnswer';
import { useFilterCardName } from '@/common/store/cardStore';

interface Props {
  ref?: React.RefObject<HTMLElement | null>;
  register: (adder: (tl: gsap.core.Timeline) => void) => void;
}

function LastTarot({ ref: outerRef, register }: Props) {
  const sectionRef03 = useRef<HTMLDivElement>(null);
  const parentTLRef = useRef<gsap.core.Timeline | null>(null);

  const textBoxRef = useRef<HTMLImageElement>(null);

  const scopeRef = outerRef ?? sectionRef03;

  const card1Img = useFilterCardName('Three of Swords')[0].image_url;
  const card2Img = useFilterCardName('Two of Cups')[0].image_url;

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      register((tl) => {
        parentTLRef.current = tl;
        tl.addLabel('startStar', 0)
          .addLabel('lastQuestion', 'startStar+=3')
          .addLabel('spin1', 'lastQuestion+=3')
          .addLabel('spin2', 'spin1+=0.5')
          .addLabel('cardName1', 'spin2+=0.5')
          .addLabel('cardName2', 'cardName1+=0.5')
          .addLabel('textBox', 'cardName2+=0.5')
          .from(textBoxRef.current, { opacity: 0, y: 100, duration: 1 }, 'textBox')
          .addLabel('text1', 'textBox+=0.5')
          .addLabel('text2', 'text1+=0.5')
          .addLabel('endStar', 'text2+=1.5');
      });
    }, scopeRef);

    return () => ctx.revert();
  }, [scopeRef, register]);

  return (
    <section
      ref={scopeRef}
      className="section h-screen w-screen relative overflow-hidden flex flex-col justify-center items-center "
    >
      <MainStar
        parentTimeline={parentTLRef}
        className="absolute top-[5vh] left-[20vw]"
        from={{ y: '-35vh', opacity: 1, x: 0 }}
        to={[
          { x: '50vw', y: '20vh' },
          { x: '0vw', y: '40vh' },
          { x: '20vw', y: '65vh' },
        ]}
        curviness={1.5}
        startLabel="startStar"
        endLabel="endStar"
      />
      <div className="absolute w-screen z-0 flex flex-col justify-center items-center gap-10">
        <LastQ parentTimeline={parentTLRef} label="lastQuestion" />

        <div className="w-screen flex flex-row justify-center items-center gap-9 ">
          <CardSpin
            parentTimeline={parentTLRef}
            label="spin1"
            imgFront={card1Img}
            x={-200}
            y={-100}
          />

          <div>
            <ThreeOfSwords parentTimeline={parentTLRef} label="cardName1" />
            <TwoOfCups parentTimeline={parentTLRef} label="cardName2" />
            <div
              ref={textBoxRef}
              className="min-w-115 flex flex-col items-center justify-center bg-main-white/25 shadow-main-white shadow-[10px,-10px,10px,-10px] rounded-lg gap-1"
            >
              <SplitAnswer parentTimeline={parentTLRef} startLabel="text1" className="mt-4">
                지금 마음 준 사람은 이미 다른 곳을 보고 있지만
              </SplitAnswer>

              <SplitAnswer parentTimeline={parentTLRef} startLabel="text2" className="mb-4">
                곧 당신과 진심으로 이어질 새로운 인연이 다가온다.
              </SplitAnswer>
            </div>
          </div>
          <CardSpin
            parentTimeline={parentTLRef}
            label="spin2"
            imgFront={card2Img}
            x={200}
            y={-100}
          />
        </div>
      </div>
    </section>
  );
}
export default LastTarot;
