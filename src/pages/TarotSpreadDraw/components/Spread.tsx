import { useRef, useCallback, useEffect, useState, type RefObject } from 'react';
import { gsap } from 'gsap';
import TarotCard from '@/pages/Tarot/components/TarotCard';
import type { TarotCardModel, TarotCardHandle } from '../../Tarot/types/CardProps';

type Props = {
  deck: TarotCardModel[];
  cardWidth: number;
  transforms: string[];
  slotRefs?: readonly RefObject<HTMLDivElement | null>[];
  resizeKey?: number;
  onSnap?: (slotIdx: number, cardId: number | string) => void;
  canAccept?: (slotIdx: number) => boolean;
};

function Spread({ deck, cardWidth, transforms, slotRefs, resizeKey, onSnap, canAccept }: Props) {
  const wrapsRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(TarotCardHandle | null)[]>([]);
  const preWrapAngleRef = useRef<number[]>([]);
  const [filledBySlot, setFilledBySlot] = useState<Array<number | null>>([]);
  const [slotOfCard, setSlotOfCard] = useState<Array<number | null>>([]);
  const [flippedAll, setFlippedAll] = useState(false);

  const setWrapRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      wrapsRef.current[i] = el;
    },
    []
  );
  const setCardRef = useCallback(
    (i: number) => (el: TarotCardHandle | null) => {
      cardRefs.current[i] = el;
    },
    []
  );

  useEffect(() => {
    const n = slotRefs?.length ?? 0;
    if (n > 0 && filledBySlot.length !== n) setFilledBySlot(Array(n).fill(null));
  }, [slotRefs?.length, filledBySlot.length]);

  const realignOne = useCallback(
    (cardIdx: number, slotIdx: number, dur = 0) => {
      const ref = cardRefs.current[cardIdx];
      const slotEl = slotRefs?.[slotIdx]?.current || null;
      const root = ref?.rootEl || null;
      const cardEl = ref?.cardEl || null;
      if (!ref || !slotEl || !root || !cardEl) return;

      const cardRect = cardEl.getBoundingClientRect();
      const cX = cardRect.left + cardRect.width / 2;
      const cY = cardRect.top + cardRect.height / 2;

      const r = slotEl.getBoundingClientRect();
      const sX = r.left + r.width / 2;
      const sY = r.top + r.height / 2;

      const tx = Number(gsap.getProperty(root, 'x')) || 0;
      const ty = Number(gsap.getProperty(root, 'y')) || 0;

      const ratio = Number((root as HTMLElement).dataset.fitr) || 0.8;
      const desired = r.width * ratio;
      const currentScale = Number(gsap.getProperty(root, 'scale')) || 1;
      const currentWidth = (root as HTMLElement).getBoundingClientRect().width;
      const nextScale = currentScale * (desired / currentWidth);

      ref.moveTo(tx + (sX - cX), ty + (sY - cY), dur);
      const tl = gsap.timeline({
        onComplete: () => {
          const renderedWidth = (root as HTMLElement).getBoundingClientRect().width;

          (root as HTMLElement).style.width = `${Math.round(renderedWidth)}px`;

          gsap.set(root, { scale: 1, force3D: false, z: 0.01 });

          gsap.to(root, {
            width: desired,
            duration: Math.max(0.18, (dur / 1000) * 0.4),
            ease: 'power2.out',
          });
        },
      });

      tl.to(root, { scale: nextScale, duration: dur / 1000, ease: 'power3.out' });
    },
    [slotRefs]
  );

  const realignSnapped = useCallback(() => {
    if (!slotRefs) return;
    for (let i = 0; i < slotOfCard.length; i++) {
      const s = slotOfCard[i];
      if (s == null) continue;
      realignOne(i, s, 0);
    }
  }, [slotOfCard, slotRefs, realignOne]);

  const [slotResizeTick, setSlotResizeTick] = useState(0);
  useEffect(() => {
    if (!slotRefs || slotRefs.length === 0) return;
    const observers: ResizeObserver[] = [];
    slotRefs.forEach((ref) => {
      const el = ref?.current;
      if (!el) return;
      const ro = new ResizeObserver(() => setSlotResizeTick((t) => t + 1));
      ro.observe(el);
      observers.push(ro);
    });
    return () => observers.forEach((ro) => ro.disconnect());
  }, [slotRefs]);

  useEffect(() => {
    realignSnapped();
  }, [resizeKey, realignSnapped, slotRefs?.length, slotResizeTick]);

  const scheduleRealign = useCallback(
    (cardIdx: number, slotIdx: number, dur = 220) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          realignOne(cardIdx, slotIdx, dur);
        });
      });
    },
    [realignOne]
  );

  useEffect(() => {
    const n = slotRefs?.length ?? 0;
    if (!n || filledBySlot.length !== n || flippedAll) return;
    const allFilled = filledBySlot.every((v) => v !== null);
    if (!allFilled) return;

    const summary = filledBySlot.map((cardIdx, slotIdx) => {
      const card = cardIdx != null ? deck[cardIdx] : null;
      return {
        slotIndex: slotIdx,
        cardIndexInDeck: cardIdx ?? null,
        cardId: card?.id ?? null,
        cardName: card?.name ?? null,
        reversed: card?.reversed ?? false,
      };
    });
    console.log('[Tarot] All slots filled. Summary:', summary);

    filledBySlot.forEach((cardIdx, i) => {
      const ref = cardIdx != null ? cardRefs.current[cardIdx] : null;
      setTimeout(() => {
        ref?.flip(true);
      }, i * 150);
    });
    setFlippedAll(true);
  }, [filledBySlot, slotRefs?.length, flippedAll, deck]);

  const onDragEndFactory =
    (idx: number) =>
    (
      _id: number | string,
      payload: {
        clientX: number;
        clientY: number;
        translate: { x: number; y: number };
        cardRect: DOMRect;
      }
    ) => {
      const ref = cardRefs.current[idx];
      if (!ref) return;

      const restore = () => {
        const ang = preWrapAngleRef.current[idx] ?? 0;
        if (wrapsRef.current[idx]) {
          gsap.to(wrapsRef.current[idx]!, { rotation: ang, duration: 0.28, ease: 'power3.out' });
        }
        ref.reset(280);
      };

      if (!slotRefs || slotRefs.length === 0) {
        restore();
        return;
      }

      const cX = payload.cardRect.left + payload.cardRect.width / 2;
      const cY = payload.cardRect.top + payload.cardRect.height / 2;

      let hit: number | null = null;
      for (let i = 0; i < slotRefs.length; i++) {
        const el = slotRefs[i]?.current;
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (cX > r.left && cX < r.right && cY > r.top && cY < r.bottom) {
          hit = i;
          break;
        }
      }
      if (hit === null) {
        restore();
        return;
      }

      const occupiedLocal = filledBySlot[hit] !== null;
      if ((canAccept && !canAccept(hit)) || (!canAccept && occupiedLocal)) {
        restore();
        return;
      }

      const r0 = slotRefs[hit]!.current!.getBoundingClientRect();
      const sX0 = r0.left + r0.width / 2;
      const sY0 = r0.top + r0.height / 2;
      const nx = payload.translate.x + (sX0 - cX);
      const ny = payload.translate.y + (sY0 - cY);

      if (wrapsRef.current[idx]) gsap.set(wrapsRef.current[idx]!, { rotation: 0 });

      ref.moveTo(nx, ny, 140);
      ref.lock();

      setFilledBySlot((prev) => {
        const next = [...prev];
        next[hit!] = idx;
        return next;
      });
      setSlotOfCard((prev) => {
        const next = [...prev];
        next[idx] = hit!;
        return next;
      });

      const root = ref.rootEl as HTMLElement | null;
      if (root) root.dataset.fitr = '0.8';

      onSnap?.(hit, _id);

      scheduleRealign(idx, hit!, 220);
    };

  return (
    <>
      {deck.map((c, i) => {
        const snapped = slotOfCard[i] != null;
        return (
          <div
            key={c.id}
            data-card
            ref={setWrapRef(i)}
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 0,
              transform: snapped ? 'none' : transforms[i],
              transformOrigin: 'bottom center',
              zIndex: i + 1,
            }}
          >
            <div data-anim className="origin-bottom will-change-transform">
              <TarotCard
                ref={setCardRef(i)}
                id={c.id}
                name={c.name}
                frontSrc={c.frontSrc}
                width={cardWidth}
                reversed={c.reversed}
                flipDir={c.reversed ? 1 : -1}
                onDragStart={(_, payload) => {
                  const wrap = wrapsRef.current[i];
                  if (wrap) {
                    const ang = Number(gsap.getProperty(wrap, 'rotation')) || 0;
                    preWrapAngleRef.current[i] = ang;
                    gsap.set(wrap, { rotation: 0 });
                  }
                  if (!payload) return;
                  const { clientX, clientY, translate, cardRect } = payload;
                  const cx = cardRect.left + cardRect.width / 2;
                  const cy = cardRect.top + cardRect.height / 2;
                  const dx = cx - clientX;
                  const dy = cy - clientY;
                  const card = cardRefs.current[i];
                  if (card) card.moveTo(translate.x + dx, translate.y + dy, 0);
                }}
                onDragEnd={onDragEndFactory(i)}
              />
            </div>
          </div>
        );
      })}
    </>
  );
}

export default Spread;
