import { useRef, useState, useMemo } from 'react';
import TarotSpread from './components/TarotSpread';
import DrawSlot from './components/DrawSlot';

const SLOT_LABELS = ['Past', 'Present', 'Future'] as const;

export default function TarotSpreadDraw() {
  const slotRef1 = useRef<HTMLDivElement>(null);
  const slotRef2 = useRef<HTMLDivElement>(null);
  const slotRef3 = useRef<HTMLDivElement>(null);
  const slotRefs = useMemo(() => [slotRef1, slotRef2, slotRef3] as const, []);

  const [filledBySlot, setFilledBySlot] = useState<Array<number | string | null>>([
    null,
    null,
    null,
  ]);
  const canAccept = (slotIdx: number) => filledBySlot[slotIdx] === null;
  const handleSnap = (slotIdx: number, cardId: number | string) => {
    setFilledBySlot((prev) => {
      if (prev[slotIdx] !== null) return prev;
      const next = [...prev];
      next[slotIdx] = cardId;
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-main-black text-main-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-10 space-y-10">
        <section className="relative">
          <TarotSpread slotRefs={slotRefs} onSnap={handleSnap} canAccept={canAccept} />
        </section>

        <section className="flex items-center justify-center gap-6 md:gap-10">
          {SLOT_LABELS.map((label, i) => (
            <DrawSlot
              key={label}
              ref={slotRefs[i]}
              label={label}
              width={'clamp(200px, 22vw, 260px)'}
              ratio={1.75}
              filled={filledBySlot[i] !== null}
            />
          ))}
        </section>
      </div>
    </div>
  );
}
