import type { Tables } from '@/common/api/supabase/database.types';
import tw from '@/common/utils/tw';
import { useEffect, useId, useRef, useState } from 'react';
import gsap from 'gsap';

gsap.registerPlugin(Flip);

interface Props {
  name: string | null;
  infoId: string | null;
  result: string | null;
  imageUrl?: string | null;
  subInfo?: Tables<'tarot_info'>[] | null;
}

function TarotCardDescription({ name, infoId, result, imageUrl = '35', subInfo }: Props) {
  const [subCard, setSubCard] = useState<Tables<'tarot_info'> | null>(null);
  const [flipped, setFlipped] = useState(false);
  const descriptionRef = useRef<HTMLDivElement | null>(null);
  const id = useId();

  useEffect(() => {
    if (subInfo) {
      const subMatch = subInfo.filter((item) => infoId === item.parent_id);
      if (subMatch.length > 0) {
        setSubCard(subMatch[0]);
      }
    }
  });

  const handleSwap = () => setFlipped((prev) => !prev);

  const glow =
    'hover:brightness-125 hover:scale-105 ' +
    'hover:drop-shadow-[0_0_30px_rgba(255,215,0,1)] ' +
    'hover:drop-shadow-[0_0_60px_rgba(255,223,100,0.9)] ' +
    'hover:drop-shadow-[0_0_90px_rgba(255,255,150,0.8)]';

  if (subCard) {
    return (
      <div className="relative min-h-[30%] flex gap-10 w-[95%]" key={id}>
        <div className="flex relative min-w-[29%]">
          <img
            src={`/images/${imageUrl}.png`}
            alt="타로카드1"
            onClick={handleSwap}
            className={tw(
              `h-full object-contain  translate-x-1 ${glow} hover:animate-pulse`,
              flipped ? 'z-50' : 'z-0'
            )}
          />
          <img
            src={`/images/${imageUrl}.png`}
            alt="타로카드2"
            onClick={handleSwap}
            className={tw(
              `h-full object-contain -translate-x-1 -ml-14 ${glow} hover:animate-pulse`,
              flipped ? 'z-0' : 'z-50'
            )}
          />
        </div>
        <div className="flex-1" ref={descriptionRef}>
          <p className="text-xl font-semibold">{flipped ? name : subCard.name}</p>
          <p className="text-sm max-h-[128px] overflow-y-auto break-all">
            {flipped ? result : subCard.result}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[30%] flex gap-10 w-[95%]" key={id}>
      <div className="flex relative min-w-[29%]">
        <img
          src={`/images/${imageUrl}.png`}
          alt="타로카드1"
          className="h-full object-contain translate-x-1 hover:brightness-125 hover:drop-shadow-[0_0_15px_rgba(255,255,200,0.8)] hover:scale-105 hover:animate-pulse"
        />
      </div>
      <div className="flex-1">
        <p className="text-xl font-semibold">{name}</p>
        <p className="text-sm max-h-[128px] overflow-y-auto break-all">{result}</p>
      </div>
    </div>
  );
}
export default TarotCardDescription;
