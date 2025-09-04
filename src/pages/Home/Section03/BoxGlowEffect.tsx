import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import tw from '@/common/utils/tw';

interface Props {
  children?: React.ReactNode; // div에 넣을 내부 콘텐츠(Optional)
  className?: string;
}

const LAYERS = [
  { inset: '-inset-10', bg: 'bg-amber-50/50', blur: 'blur-[30px]', rounded: 'rounded-4xl' },
  { inset: '-inset-8', bg: 'bg-amber-100/50', blur: 'blur-[24px]', rounded: 'rounded-4xl' },
  { inset: '-inset-6', bg: 'bg-amber-200/50', blur: 'blur-[18px]', rounded: 'rounded-4xl' },
  { inset: '-inset-4', bg: 'bg-amber-500/50', blur: 'blur-[14px]', rounded: 'rounded-4xl' },
  { inset: '-inset-2', bg: 'bg-amber-400/60', blur: 'blur-[10px]', rounded: 'rounded-4xl' },
  { inset: '-inset-1', bg: 'bg-main-white/70', blur: 'blur-[6px]', rounded: 'rounded-4xl' },
] as const;

function BoxGlowEffect({ children, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(containerRef);
      const layers = q<HTMLElement>('.glow-layer');
      const N = Math.max(layers.length - 1, 1);

      gsap.set(layers, {
        transformOrigin: '50% 50%',
        willChange: 'transform,opacity',
        opacity: (i) => 0.18 + (i / N) * 0.35,
        scale: (i) => 0.98 + (i / N) * 0.08,
      });

      gsap
        .timeline({
          repeat: -1,
          yoyo: true,
          defaults: { ease: 'power2.inOut', duration: 1.2 },
        })
        .to(
          layers,
          {
            opacity: (i) => 0.28 + (i / N) * 0.45,
            scale: (i) => 1.0 + (i / N) * 0.09,
            stagger: { each: 0.06, from: 'center' },
          },
          0
        );
    },
    { scope: containerRef, dependencies: [] }
  );

  return (
    <div ref={containerRef} className={tw('relative inline-block rounded-4xl', className)}>
      <div className="relative z-10 w-full h-full">{children}</div>
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        {LAYERS.map(({ inset, bg, blur, rounded }, i) => (
          <div
            key={i}
            className={tw('glow-layer absolute rounded-[inherit]', inset, bg, blur, rounded)}
          />
        ))}
      </div>
    </div>
  );
}

export default BoxGlowEffect;
