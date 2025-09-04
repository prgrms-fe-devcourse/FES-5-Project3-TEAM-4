import { useEffect } from 'react';
import gsap from 'gsap';

export function useYellowGlowText<T extends HTMLElement>(ref: React.RefObject<T | null>) {
  useEffect(() => {
    if (!ref) return;
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        {
          textShadow: `
        0 0 10px #f5f5f5,
        0 0 20px #f5f5f5,
        0 0 30px #ffcf32,
        0 0 40px #ffcf32,
        0 0 50px #ffcf32,
        0 0 60px #ffcf32,
        0 0 70px #ffcf32`,
        },
        {
          textShadow: `
          0 0 20px #f5f5f5,
          0 0 30px #ffda60,
          0 0 40px #ffda60,
          0 0 50px #ffda60,
          0 0 60px #ffda60,
          0 0 70px #ffda60,
          0 0 80px #ffda60
        `,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut',
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [ref]);
}
