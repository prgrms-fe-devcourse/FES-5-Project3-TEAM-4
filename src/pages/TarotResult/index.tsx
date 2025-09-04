import { useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DrawMoreMsg from './components/DrawMoreMsg';
import ResultPair from './components/ResultCardPair';
import TarotFront from '@/assets/Tarot/tarot_front.svg';
import { isAmbiguous } from './utils/ambiguous';

import { tarotStore, SLOTS, type SlotPack } from '@/pages/Tarot/store/tarotStore';

type CardLike = {
  id: string | number;
  name: string;
  frontSrc: string;
  width?: number;
  reversed?: boolean;
};
type ResultPairItem = {
  main: CardLike;
  sub?: CardLike;
};

export default function TarotResult() {
  const location = useLocation();
  const slots = tarotStore((s) => s.slots);

  useEffect(() => {
    // 필요 시 readingId로 Supabase refetch
  }, [location.key]);

  const pairs = useMemo<ResultPairItem[]>(() => {
    return SLOTS.map((key) => {
      const pack: SlotPack = slots[key];

      const main = pack.main
        ? {
            id: pack.main.id,
            name: pack.main.name ?? String(pack.main.id),
            frontSrc: pack.main.frontSrc ?? TarotFront,
            width: 210,
            reversed: pack.main.reversed ?? false,
          }
        : undefined;

      const sub = pack.sub
        ? {
            id: pack.sub.id,
            name: pack.sub.name ?? String(pack.sub.id),
            frontSrc: pack.sub.frontSrc ?? TarotFront,
            width: 210,
            reversed: pack.sub.reversed ?? false,
          }
        : undefined;

      const safeMain: CardLike = main ?? {
        id: `placeholder-${key}`,
        name: '',
        frontSrc: TarotFront,
        width: 210,
        reversed: false,
      };

      return sub ? { main: safeMain, sub } : { main: safeMain };
    });
  }, [slots]);

  const hasWarn = useMemo(() => pairs.some((p) => isAmbiguous(p.main.name) && !p.sub), [pairs]);

  return (
    <div className="py-45 flex flex-col gap-10">
      <div>{hasWarn && <DrawMoreMsg />}</div>

      <div className="relative mx-auto max-w-[90vw]">
        <div className="flex flex-wrap items-start justify-center gap-5 md:gap-8">
          {pairs.map((p, i) => (
            <ResultPair key={i} {...p} index={i} />
          ))}
        </div>
      </div>

      <p className="flex justify-center items-center text-main-white py-5">
        👆🏻카드 클릭 시 해석을 확인할 수 있습니다.👆🏻
      </p>
    </div>
  );
}
