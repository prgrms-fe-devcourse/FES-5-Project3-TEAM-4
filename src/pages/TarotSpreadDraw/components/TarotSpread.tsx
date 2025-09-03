import { useEffect, useMemo, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Spread from './Spread';
import { useElementSize } from '../hooks/useElementSize';
import { computeEllipseAxes, getFanTransformsEllipse } from '../utils/ellipse';
import { useTarotDeck } from '../hooks/useTarotDeck';

type Props = {
  slotRefs?: readonly React.RefObject<HTMLDivElement | null>[];
  onSnap?: (slotIdx: number, cardId: number | string) => void;
  canAccept?: (slotIdx: number) => boolean;
};

function preloadImages(urls: string[], timeoutMs = 8000): Promise<void> {
  if (!urls.length) return Promise.resolve();
  const uniq = Array.from(new Set(urls.filter(Boolean)));
  return new Promise((resolve) => {
    let done = 0,
      finished = false;
    const finish = () => {
      if (!finished) {
        finished = true;
        resolve();
      }
    };
    const timer = setTimeout(finish, timeoutMs);
    uniq.forEach((src) => {
      const img = new Image();
      const tick = () => {
        if (++done >= uniq.length) {
          clearTimeout(timer);
          finish();
        }
      };
      img.onload = tick;
      img.onerror = tick;
      img.src = src;
    });
  });
}

function hashDeck(ids: string[]) {
  let h = 2166136261;
  for (const id of ids) {
    for (let i = 0; i < id.length; i++) {
      h ^= id.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
  }
  return (h >>> 0).toString(36);
}

export default function TarotSpread({ slotRefs, onSnap, canAccept }: Props) {
  const { ref: stageRef, size: stageSize } = useElementSize<HTMLDivElement>();
  const { deck, loading, error } = useTarotDeck();

  const dataReady = !loading && !error && deck.length > 0;

  const [assetsReady, setAssetsReady] = useState(false);
  useEffect(() => {
    let alive = true;
    if (!dataReady) {
      setAssetsReady(false);
      return;
    }
    const urls = deck.map((c) => c.frontSrc).filter(Boolean);
    preloadImages(urls).then(() => {
      if (alive) setAssetsReady(true);
    });
    return () => {
      alive = false;
    };
  }, [dataReady, deck]);

  const cardWidth = useMemo(() => {
    const w = stageSize.width || 1024;
    return Math.round(Math.max(86, Math.min(128, w / 12)));
  }, [stageSize.width]);

  const maxThetaDeg = useMemo(() => {
    const w = stageSize.width;
    if (w >= 1280) return 54;
    if (w >= 768) return 56;
    return 58;
  }, [stageSize.width]);

  const verticalRatio = useMemo(() => {
    const w = stageSize.width;
    if (w >= 1280) return 0.36;
    if (w >= 768) return 0.42;
    return 0.5;
  }, [stageSize.width]);

  const sideMarginRatio = 0.12;

  const { a, b } = useMemo(
    () => computeEllipseAxes(stageSize.width, maxThetaDeg, sideMarginRatio, verticalRatio),
    [stageSize.width, maxThetaDeg, sideMarginRatio, verticalRatio]
  );

  const overlapTangentPx = useMemo(() => Math.round(-0.16 * cardWidth), [cardWidth]);
  const bowPx = useMemo(() => Math.round(0.1 * cardWidth), [cardWidth]);

  const stageH = useMemo(() => {
    const w = stageSize.width || 1024;
    return Math.round(Math.max(420, Math.min(660, w * 0.46)));
  }, [stageSize.width]);

  const baselinePx = useMemo(() => Math.max(0, b - stageH * 0.52), [b, stageH]);

  const transforms = useMemo(
    () =>
      getFanTransformsEllipse(
        deck.length,
        maxThetaDeg,
        a,
        b,
        0.68,
        overlapTangentPx,
        bowPx,
        baselinePx
      ),
    [deck.length, maxThetaDeg, a, b, overlapTangentPx, bowPx, baselinePx]
  );

  const ready = dataReady && assetsReady && transforms.length === deck.length;

  const spreadKey = useMemo(
    () => (ready ? `spread-${hashDeck(deck.map((d) => String(d.id)))}` : 'spread-pending'),
    [ready, deck]
  );

  const spreadHostRef = useRef<HTMLDivElement | null>(null);
  const [didShow, setDidShow] = useState(false);

  useLayoutEffect(() => {
    if (!ready || !spreadHostRef.current) return;
    spreadHostRef.current.style.opacity = '0';
    spreadHostRef.current.style.visibility = 'hidden';
  }, [ready]);

  useLayoutEffect(() => {
    if (!ready || didShow || !spreadHostRef.current) return;

    requestAnimationFrame(() => {
      gsap.to(spreadHostRef.current!, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
        onStart: () => {
          spreadHostRef.current!.style.visibility = 'visible';
        },
        onComplete: () => {
          spreadHostRef.current!.style.removeProperty('opacity');
          spreadHostRef.current!.style.removeProperty('visibility');
        },
      });
      setDidShow(true);
    });
  }, [ready, didShow]);

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-5">
      <div
        ref={stageRef}
        style={{ height: stageH }}
        className="relative isolate mx-auto transform-gpu -top-50"
      >
        {!ready ? (
          <div className="absolute inset-0 grid place-items-center text-white/70">
            {error ? `오류: ${error}` : 'Loading deck…'}
          </div>
        ) : (
          <div key={spreadKey} ref={spreadHostRef}>
            <Spread
              deck={deck}
              cardWidth={cardWidth}
              transforms={transforms}
              slotRefs={slotRefs}
              resizeKey={stageSize.width || 0}
              onSnap={onSnap}
              canAccept={canAccept}
            />
          </div>
        )}
      </div>
    </div>
  );
}
