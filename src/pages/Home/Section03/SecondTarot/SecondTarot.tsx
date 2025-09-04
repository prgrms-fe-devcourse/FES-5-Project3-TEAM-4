import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// import card from '@/assets/home/Wheel_of_Fortune.webp';
import SecondQ1 from './SecondQ1';
import SecondQ2 from './SecondQ2';
import MainStar from '../../components/MainStar';
import CardSpin from '../CardSpin';
import WheelOfFortune from './WheelOfFortune';
import SplitAnswer from '../SplitAnswer';
import { useFilterCardName } from '@/common/store/cardStore';

interface Props {
  ref?: React.RefObject<HTMLElement | null>;
  register: (adder: (tl: gsap.core.Timeline) => void) => void;
}

function SecondTarot({ ref: outerRef, register }: Props) {
  const sectionRef03 = useRef<HTMLDivElement>(null);
  const parentTLRef = useRef<gsap.core.Timeline | null>(null);
  const textBoxRef = useRef<HTMLImageElement>(null);

  const scopeRef = outerRef ?? sectionRef03;

  const cardImg = useFilterCardName('Wheel of Fortune')[0].image_url;

  useEffect(() => {
    const ctx = gsap.context(() => {
      register((tl) => {
        parentTLRef.current = tl;
        tl.addLabel('startStar', 0)
          .addLabel('secondQuestion1', 'startStar+=3')
          .addLabel('secondQuestion2', 'secondQuestion1+=3')
          .addLabel('spin', 'secondQuestion2+=6')
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
        className="absolute top-[5vh] translate-x-[30vw]"
        from={{ y: '-35vh', opacity: 1, x: 0 }}
        to={[
          { x: '-5vw', y: '60vh' },
          { x: '-40vw', y: '10vh' },
          { x: '-70vw', y: '70vh' },
          { x: '-70vw', y: '95vh' },
        ]}
        curviness={1.5}
        startLabel="startStar"
        endLabel="endStar"
      />
      <div className="absolute w-screen z-0 flex flex-col justify-center items-center gap-10">
        <SecondQ1 parentTimeline={parentTLRef} label="secondQuestion1" />
        <SecondQ2 parentTimeline={parentTLRef} label="secondQuestion2" />

        <div className="w-screen flex flex-row justify-center items-center gap-9 ">
          <CardSpin
            parentTimeline={parentTLRef}
            label="spin"
            imgFront={cardImg}
            x={-200}
            y={-100}
          />

          <div>
            <WheelOfFortune parentTimeline={parentTLRef} label="cardName" />
            <div
              ref={textBoxRef}
              className="min-w-140 flex flex-col items-center justify-center bg-main-white/25 shadow-main-white shadow-[10px,-10px,10px,-10px] rounded-lg gap-1"
            >
              <SplitAnswer parentTimeline={parentTLRef} startLabel="text1" className="mt-4">
                회사를 그만두든 남아있든 지금 상황은 크게 바뀔 것이고
              </SplitAnswer>

              <SplitAnswer parentTimeline={parentTLRef} startLabel="text2" className="mb-4">
                그 변화의 흐름은 당신이 통제하기 어렵다.
              </SplitAnswer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default SecondTarot;
