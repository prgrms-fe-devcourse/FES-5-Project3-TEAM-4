import gsap from 'gsap';
import { useLayoutEffect, type RefObject } from 'react';

interface BookSpreadProps {
  pagesRef: RefObject<HTMLDivElement | null>;
  coverRef: RefObject<HTMLDivElement | null>;
  duration?: number;
  stagger?: number;
  onCompleteCallback?: () => void;
  type?: 'write' | 'read' | 'result';
}

export function useBookSpread({
  pagesRef,
  coverRef,
  duration = 1,
  stagger = 0.08,
  onCompleteCallback,
  type,
}: BookSpreadProps) {
  useLayoutEffect(() => {
    if (!pagesRef || !coverRef) return;
    const ctx = gsap.context(() => {
      const pageEls = Array.from(pagesRef.current?.querySelectorAll<HTMLElement>('.page') ?? []);
      gsap.set([coverRef.current, pagesRef.current], {
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      });
      gsap.set([coverRef.current, ...pageEls], {
        transformOrigin: 'left center',
        rotateY: 0,
        // 페이지 두께 감 (약간의 Z축 겹침)
        z: (i) => i * 2,
      });
      gsap.set(coverRef.current, {
        backfaceVisibility: 'hidden',
      });
      gsap.set(pageEls, { z: (i: number) => (pageEls.length - i) * 2 });
      gsap.set(coverRef.current, { z: pageEls.length * 2 + 10 });

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'power2.out' },
        onComplete: () => {
          if (!onCompleteCallback) return;
          if (type !== 'result') return;
          onCompleteCallback();
        },
      });
      tl.to(coverRef.current, {
        rotateY: -175,
        duration: duration,
      });
      tl.to(
        pageEls,
        {
          rotateY: -175,
          duration: duration,
          stagger: stagger,
        },
        0.08
      );
      tl.play();
    });
    return () => ctx.revert();
  }, []);
}
