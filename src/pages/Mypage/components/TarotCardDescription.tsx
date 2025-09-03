import type { Tables } from '@/common/api/supabase/database.types';
import { useFilterCardName } from '@/common/store/cardStore';
import tw from '@/common/utils/tw';
import { useMemo, useState } from 'react';

interface Props {
  name: string | null;
  infoId: string | null;
  result: string | null;
  subInfo?: Tables<'tarot_info'>[] | null;
}

function TarotCardDescription({ name, infoId, result, subInfo }: Props) {
  const [flipped, setFlipped] = useState(false);

  const subCard = useMemo(
    () => subInfo?.find((it) => it.parent_id === infoId) ?? null,
    [subInfo, infoId]
  );

  const mainCardInfo = useFilterCardName(name ?? null);
  const subCardInfo = useFilterCardName(subCard?.name ?? null);

  const hasSub = !!subCard;
  const handleSwap = () => {
    if (hasSub) setFlipped((p) => !p);
  };

  const glowWrapper =
    'md:hover:brightness-125 md:hover:drop-shadow-[0_0_30px_rgba(255,215,0,1)] ' +
    'md:hover:drop-shadow-[0_0_60px_rgba(255,223,100,0.9)] md:hover:drop-shadow-[0_0_90px_rgba(255,255,150,0.8)]';
  const scroll = 'scrollbar scrollbar-thin scrollbar-thumb-black/60 scrollbar-track-transparent';
  return (
    <div className="relative min-h-[30%] flex gap-10 w-[95%]">
      {/* 카드 영역 */}
      <div className="relative min-w-[33%]">
        <div
          onClick={handleSwap}
          title={hasSub ? '카드를 눌러 메인/서브 전환' : '서브카드 없음'}
          className={tw(
            'group relative h-[90%] aspect-[3/5] transition-transform duration-300 will-change-transform',
            glowWrapper,
            hasSub ? 'cursor-pointer md:hover:scale-105' : 'cursor-default md:hover:scale-100'
          )}
        >
          {/* 스택 힌트: 서브카드 있으면 뒤에 살짝 깔린 프레임 */}
          {hasSub && (
            <div className="absolute inset-0 translate-x-2 translate-y-2 rounded bg-black/10 border border-white/20 pointer-events-none" />
          )}

          {/* 서브 뱃지 */}
          {hasSub && (
            <span className="absolute -top-2 -right-2 z-20 rounded-full bg-amber-300 text-black text-[11px] px-2 py-0.5 shadow">
              서브
            </span>
          )}

          {/* 앞면(메인) */}
          <img
            src={mainCardInfo[0]?.image_url}
            alt={`${mainCardInfo[0]?.name ?? '메인'} 카드`}
            loading="lazy"
            className={tw(
              'absolute inset-0 w-full h-full object-contain rounded z-10 transition-opacity duration-300',
              hasSub ? (flipped ? 'opacity-0' : 'opacity-100') : 'opacity-100'
            )}
          />

          {/* 뒷면(서브) : 있을 때만 렌더 */}
          {hasSub && (
            <img
              src={subCardInfo[0]?.image_url}
              alt={`${subCardInfo[0]?.name ?? '서브'} 카드`}
              loading="lazy"
              className={tw(
                'absolute inset-0 w-full h-full object-contain rounded z-10 transition-opacity duration-300',
                flipped ? 'opacity-100' : 'opacity-0'
              )}
            />
          )}
        </div>
      </div>

      {/* 설명 영역 */}
      <div className="flex-1">
        {/* 라벨: 서브카드 포함/없음 */}
        <div className="mb-1">
          {hasSub ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-300/80 text-black px-2 py-[2px] text-[11px]">
              서브카드 포함
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 border-1 border-main-black rounded-full bg-white/50 text-main-black px-2 py-[2px] text-[11px]">
              서브카드 없음
            </span>
          )}
        </div>

        <p className="text-xl font-semibold">{hasSub ? (flipped ? name : subCard?.name) : name}</p>
        <p className={`text-sm max-h-[128px] overflow-y-auto break-all ${scroll}`}>
          {hasSub ? (flipped ? result : subCard?.result) : result}
        </p>
      </div>
    </div>
  );
}

export default TarotCardDescription;
