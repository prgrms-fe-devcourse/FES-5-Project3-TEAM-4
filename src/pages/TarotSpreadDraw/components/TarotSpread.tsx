// src/pages/TarotSpread/index.tsx
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

// 이미지 프리로드
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

// 덱의 “내용”이 바뀌면 항상 다른 키가 되도록 해시(충돌 거의 없음)
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

  // 1) 데이터 로드 완료
  const dataReady = !loading && !error && deck.length > 0;

  // 2) 이미지 프리로드 완료
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

  // 레이아웃 계산
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

  // 모든 준비가 끝나고 transforms 길이도 맞을 때만 렌더/애니
  const ready = dataReady && assetsReady && transforms.length === deck.length;

  // ✅ 이전 스프레드 완전 언마운트 유도용 키 (덱 내용 기반)
  const spreadKey = useMemo(
    () => (ready ? `spread-${hashDeck(deck.map((d) => String(d.id)))}` : 'spread-pending'),
    [ready, deck]
  );

  // ✅ 컨테이너만 페이드인 (카드 단위 X) — 초기 프레임에서 절대 보이지 않게
  const spreadHostRef = useRef<HTMLDivElement | null>(null);
  const [didShow, setDidShow] = useState(false);

  // 초기 렌더 자체를 opacity:0으로 시작 → 카드/래퍼가 보였다가 겹치는 첫 프레임 제거
  // (inline style이 CSS보다 우선이므로 깔끔)
  useLayoutEffect(() => {
    if (!ready || !spreadHostRef.current) return;
    // 초기값 강제 세팅 (첫 페인트에 보이지 않음)
    spreadHostRef.current.style.opacity = '0';
    spreadHostRef.current.style.visibility = 'hidden';
  }, [ready]);

  useLayoutEffect(() => {
    if (!ready || didShow || !spreadHostRef.current) return;

    // 레이아웃 확정 직후, 컨테이너만 0→1
    requestAnimationFrame(() => {
      gsap.to(spreadHostRef.current!, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
        onStart: () => {
          // 보이기 시작 시 visibility 토글
          spreadHostRef.current!.style.visibility = 'visible';
        },
        onComplete: () => {
          // 인라인 정리(원하면 유지해도 무방)
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
          // ✅ key 로 이전 스프레드 완전 언마운트 → 겹쳐 보일 일 자체가 없음
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
