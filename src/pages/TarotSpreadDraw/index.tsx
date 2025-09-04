import { useRef, useState, useMemo } from 'react';
import TarotSpread from './components/TarotSpread';
import DrawSlotPair from './components/DrawSlotPair';
import { tarotStore, SLOTS } from '@/pages/Tarot/store/tarotStore';
import { isAmbiguous } from '../TarotResult/utils/ambiguous';

const SLOT_LABELS = ['Past', 'Present', 'Future'] as const;

export default function TarotSpreadDraw() {
  const pastMainRef = useRef<HTMLDivElement>(null);
  const pastSubRef = useRef<HTMLDivElement>(null);
  const presentMainRef = useRef<HTMLDivElement>(null);
  const presentSubRef = useRef<HTMLDivElement>(null);
  const futureMainRef = useRef<HTMLDivElement>(null);
  const futureSubRef = useRef<HTMLDivElement>(null);

  const slotRefs = useMemo(
    () =>
      [
        pastMainRef,
        pastSubRef,
        presentMainRef,
        presentSubRef,
        futureMainRef,
        futureSubRef,
      ] as const,
    []
  );

  const slots = tarotStore((s) => s.slots);
  const clarifyMode = tarotStore((s) => s.clarifyMode);
  const setCard = tarotStore((s) => s.setCard);

  const [filledMain, setFilledMain] = useState<Array<number | string | null>>([null, null, null]);
  const [filledSub, setFilledSub] = useState<Array<number | string | null>>([null, null, null]);

  const requireClarifyByIndex = useMemo(
    () =>
      SLOTS.map((key) => {
        const m = slots[key].main;
        return Boolean(m && isAmbiguous(m.name ?? String(m.id)));
      }),
    [slots]
  );

  const canAccept = (flatIdx: number) => {
    const pairIdx = Math.floor(flatIdx / 2);
    const isSub = flatIdx % 2 === 1;

    if (!clarifyMode) {
      if (!isSub) {
        return filledMain[pairIdx] === null;
      }
      return false;
    }

    if (!isSub) return false;

    const slotKey = SLOTS[pairIdx];
    const mainExists = Boolean(slots[slotKey].main);
    const subEmpty = !slots[slotKey].sub && filledSub[pairIdx] === null;
    const needed = requireClarifyByIndex[pairIdx];

    return needed && mainExists && subEmpty;
  };

  const handleSnap = (flatIdx: number, cardId: number | string) => {
    const pairIdx = Math.floor(flatIdx / 2);
    const isSub = flatIdx % 2 === 1;
    if (!canAccept(flatIdx)) return;

    if (!clarifyMode) {
      if (!isSub) {
        setFilledMain((prev) => {
          const next = [...prev];
          next[pairIdx] = cardId;
          return next;
        });
      }
      return;
    }

    if (isSub) {
      setFilledSub((prev) => {
        const next = [...prev];
        next[pairIdx] = cardId;
        return next;
      });

      const slotKey = SLOTS[pairIdx];
      setCard(slotKey, 'sub', { id: cardId });
    }
  };

  return (
    <div className="min-h-screen text-main-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-10 space-y-10">
        <section className="relative z-20">
          <TarotSpread slotRefs={slotRefs} onSnap={handleSnap} canAccept={canAccept} />
        </section>

        <section className="relative z-10 flex items-center justify-center gap-6 md:gap-10">
          {SLOT_LABELS.map((label, i) => {
            const showSub = clarifyMode && requireClarifyByIndex[i];
            return (
              <DrawSlotPair
                key={label}
                label={label}
                mainRef={slotRefs[i * 2]}
                subRef={slotRefs[i * 2 + 1]}
                mainFilled={Boolean(slots[SLOTS[i]].main) || filledMain[i] !== null}
                subFilled={Boolean(slots[SLOTS[i]].sub) || filledSub[i] !== null}
                width={'clamp(200px, 22vw, 260px)'}
                mainHeight={420}
                subHeight={420}
                overlap={80}
                subHidden={!showSub}
                subOffsetX={150}
                subOffsetY={-310}
                subZ={0}
              />
            );
          })}
        </section>
      </div>
    </div>
  );
}
