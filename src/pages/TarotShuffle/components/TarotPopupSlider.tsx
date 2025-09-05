import type { Cards, TarotAnalysis } from '@/common/types/TarotAnalysis';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import InterPretaionText from './InterPretaionText';
import InterPretaionImage from './InterPretaionImage';
import gsap from 'gsap';
import RecordDetail from '@/pages/Mypage/components/RecordDetail';
import { useAuth } from '@/common/store/authStore';

interface Props {
  tarotAnalysisData: TarotAnalysis | null;
  tarotId: string | null;
  clickedNumber?: number;
}

function TarotPopupSlider({ tarotAnalysisData, tarotId, clickedNumber = 0 }: Props) {
  const userId = useAuth((state) => state.userId);
  const cardList = useMemo(() => tarotAnalysisData?.cards ?? [], [tarotAnalysisData]);
  const cardListLength = useMemo(() => {
    if (userId) {
      return cardList.length;
    } else {
      return cardList.length - 1;
    }
  }, [cardList]);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  // 현재 슬라이드 index
  const [index, setIndex] = useState(clickedNumber);
  const isAnimating = useRef(false);

  // index 변경될 때 트랙을 이동
  useLayoutEffect(() => {
    if (!viewportRef.current || !trackRef.current) return;
    const width = viewportRef.current.clientWidth; // 뷰포트 너비 = 한 슬라이드 폭
    isAnimating.current = true;

    gsap.killTweensOf(trackRef);
    const tween = gsap.to(trackRef.current, {
      x: -width * index,
      duration: 0.7,
      ease: 'power2.out',
      onComplete: () => {
        isAnimating.current = false;
      },
    });
    tween.eventCallback('onInterrupt', () => {
      isAnimating.current = false;
    });
  }, [index]);

  useEffect(() => {
    viewportRef.current?.focus();
  }, [cardListLength]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isAnimating.current) return;
    // 필요 시 페이지 스크롤 방지
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
    }
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  };

  const prev = () => {
    setIndex((i) => (i - 1 < 0 ? 0 : i - 1));
  };
  const next = () => {
    setIndex((i) => (i + 1 > cardListLength ? cardListLength : i + 1));
  };

  return (
    <section className="absolute w-full h-full z-1 flex justify-center items-center overflow-hidden text-main-white text-[16px]">
      <h2 className="a11y">타로해석 팝업</h2>
      {/* 뷰포트(마스크) */}
      <div
        ref={viewportRef}
        className="relative w-full h-full overflow-hidden"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        role="region"
        aria-roledescription="carousel"
        aria-label="타로 해석 슬라이더"
        onBlur={(e) => {
          // 컨테이너 밖으로 포커스가 나가면 다시 포커스
          const next = e.relatedTarget as Node | null;
          if (next && !e.currentTarget.contains(next)) {
            e.currentTarget.focus();
          }
        }}
      >
        <div ref={trackRef} className="flex h-full">
          {cardList &&
            cardList.map((cardInfo: Cards, index) => (
              <div className="min-w-full h-full flex gap-5 items-center justify-center" key={index}>
                <InterPretaionText
                  topText={cardInfo.emotional}
                  bottomText={cardInfo.keywordsInterpretation}
                  direction="left"
                  className="mb-10"
                />
                {cardInfo.subcards && (
                  <>
                    <InterPretaionImage
                      cardName={cardInfo.name}
                      time={index === 0 ? 'Past' : index === 1 ? 'The Present' : 'Future'}
                      subCardName={cardInfo.subcards.name}
                      position={cardInfo.position}
                      subPosition={cardInfo.subcards.position}
                    />
                    <InterPretaionText
                      topText={cardInfo.interpretation}
                      bottomText={cardInfo.subcards.interpretation}
                      direction="right"
                      className="pt-40"
                    />
                  </>
                )}
                {!cardInfo.subcards && (
                  <>
                    <InterPretaionImage
                      cardName={cardInfo.name}
                      time={index === 0 ? 'Past' : index === 1 ? 'The Present' : 'Future'}
                      position={cardInfo.position}
                    />
                    <InterPretaionText topText={cardInfo.interpretation} direction="right" />
                  </>
                )}
              </div>
            ))}
          <div
            className="min-w-full h-full flex gap-5 items-center justify-center"
            key={cardListLength + 1}
          >
            {userId && <RecordDetail tarotId={tarotId!} type="result" />}
          </div>
        </div>
        <button
          type="button"
          className="w-8 absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer"
          onClick={prev}
          disabled={index === 0 ? true : false}
        >
          <img
            src={index === 0 ? '/icons/left_inactive_arrow.svg' : '/icons/left_active_arrow.svg'}
            alt="이전버튼"
          />
        </button>
        <button
          type="button"
          className="w-8 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
          onClick={next}
          disabled={index === cardListLength ? true : false}
        >
          <img
            src={
              index === cardListLength
                ? '/icons/right_inactive_arrow.svg'
                : '/icons/right_active_arrow.svg'
            }
            alt="다음버튼"
          />
        </button>
      </div>
    </section>
  );
}
export default TarotPopupSlider;
