import { useEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import Spreading from './components/Spreading';
import { useElementSize } from './hooks/useElementSize';
import { computeEllipseAxes, getFanTransformsEllipse } from './utils/ellipse';
import type { TarotCardModel } from '../Tarot/types/tarot';
import CardFront from '@/assets/Tarot/tarot_front.svg';

function TarotSpread() {
  const { ref: stageRef, size: stageSize } = useElementSize<HTMLDivElement>();

  const deck = useMemo<TarotCardModel[]>(
    () =>
      Array.from({ length: 78 }).map((_, i) => ({
        id: i + 1,
        name: `Card ${i + 1}`,
        frontSrc: CardFront,
      })),
    []
  );

  // 카드 너비
  const cardWidth = useMemo(() => {
    const w = stageSize.width || 1024;
    return Math.round(Math.max(86, Math.min(128, w / 12)));
  }, [stageSize.width]);

  // 스프레드 각도
  const maxThetaDeg = useMemo(() => {
    const w = stageSize.width;
    if (w >= 1280) return 54;
    if (w >= 768) return 56;
    return 58;
  }, [stageSize.width]);

  // 타원 세로 비율
  const verticalRatio = useMemo(() => {
    const w = stageSize.width;
    if (w >= 1280) return 0.36;
    if (w >= 768) return 0.42;
    return 0.5;
  }, [stageSize.width]);

  const sideMarginRatio = 0.12;

  // 타원 축
  const { a, b } = useMemo(
    () => computeEllipseAxes(stageSize.width, maxThetaDeg, sideMarginRatio, verticalRatio),
    [stageSize.width, maxThetaDeg, sideMarginRatio, verticalRatio]
  );

  // 겹침/보강
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

  useEffect(() => {
    if (!stageRef.current) return;
    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>('[data-anim]');
      gsap.from(targets, {
        y: -18,
        rotation: -6,
        autoAlpha: 0,
        duration: 0.55,
        ease: 'power2.out',
        stagger: 0.01,
        overwrite: 'auto',
      });
    }, stageRef);
    return () => ctx.revert();
  }, [stageRef]);

  return (
    <div className="mx-auto w-full max-w-[1100px] px-4 py-5">
      <div
        ref={stageRef}
        style={{ height: stageH }}
        className="relative isolate mx-auto transform-gpu -top-50"
      >
        <Spreading deck={deck} cardWidth={cardWidth} transforms={transforms} />
      </div>
    </div>
  );
}

export default TarotSpread;
