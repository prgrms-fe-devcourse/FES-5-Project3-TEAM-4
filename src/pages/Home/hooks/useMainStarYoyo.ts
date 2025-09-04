import { useEffect } from 'react';
import gsap from 'gsap';

export function useMainStarYoyo<T extends HTMLElement>(ref: React.RefObject<T | null>) {
  useEffect(() => {
    if (!ref) return;
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        {
          scale: 1,
          rotate: -20,
        },
        {
          scale: 0.8,
          rotate: 60,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: 'steps(6)',
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [ref]);
}
