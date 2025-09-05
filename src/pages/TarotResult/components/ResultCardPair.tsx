import { useState } from 'react';
import ResultCardMain from './ResultCardMain';
import ResultCardSub from './ResultCardSub';
import NightStarPopup from '@/common/components/NightStarPopup';
import TarotPopupSlider from '@/pages/TarotShuffle/components/TarotPopupSlider';
import { tarotStore } from '@/pages/Tarot/store/tarotStore';
import { useShallow } from 'zustand/shallow';

type CardLike = {
  id: string | number;
  name: string;
  frontSrc: string;
  width?: number;
  reversed?: boolean;
};

type Props = {
  main: CardLike;
  sub?: CardLike;
  className?: string;
  subClassName?: string;
  index?: number;
};

export default function ResultPair({ main, sub, className, subClassName, index }: Props) {
  const [popOpen, setPopOpen] = useState(false);
  const { tarotId, geminiAnalysis } = tarotStore(
    useShallow((state) => ({ tarotId: state.tarotId, geminiAnalysis: state.geminiAnalysis }))
  );
  const offsetY = 320;
  const offsetX = 70;

  const handlePopOpen = () => {
    setPopOpen((prev) => !prev);
  };
  return (
    <>
      <div
        className={['flex flex-col items-center', className].filter(Boolean).join(' ')}
        onClick={handlePopOpen}
      >
        <ResultCardMain {...main} hasSub={!!sub} />
        <div
          className={['w-full flex justify-center', subClassName].filter(Boolean).join(' ')}
          style={{ marginTop: `-${offsetY}px`, marginLeft: `${offsetX}px` }}
        >
          {sub ? (
            <ResultCardSub {...sub} />
          ) : (
            <ResultCardSub
              id="sub-placeholder"
              name=""
              frontSrc=""
              width={main.width ?? 210}
              className="invisible pointer-events-none"
              nameClassName="invisible"
            />
          )}
        </div>
      </div>
      {popOpen && (
        <NightStarPopup onClose={() => setPopOpen((prev) => !prev)}>
          <TarotPopupSlider
            tarotAnalysisData={geminiAnalysis}
            tarotId={tarotId}
            clickedNumber={index}
          />
          {/* <TarotInterpretation /> */}
        </NightStarPopup>
      )}
    </>
  );
}
