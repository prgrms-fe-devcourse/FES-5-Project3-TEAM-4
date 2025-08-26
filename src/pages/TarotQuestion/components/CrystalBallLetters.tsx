import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import sphereOverlay from '@/assets/crystal_sphere_overlay.svg';
import sphereMask from '@/assets/crystal_sphere_mask.svg';

type TopicKey = 'LOVE' | 'MONEY' | 'CAREER' | 'HEALTH' | 'GROWTH';

type Props = {
  selectedKey: TopicKey | null;
  size?: number;
  rimPadding?: number;
};

export default function CrystalBallLetters({ selectedKey, size = 400, rimPadding = 60 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  const letters = useMemo(() => (selectedKey ? selectedKey.split('') : []), [selectedKey]);
  const clipRadius = size / 2 - 2;

  useEffect(() => {
    if (!containerRef.current || !maskRef.current) return;

    const R = size / 2 - rimPadding;
    const baseScaleByCount = (len: number) => (len <= 4 ? 1.1 : len >= 6 ? 0.9 : 1);
    const k = 1.0;
    const safeR = R - 2;

    const randPointInCircle = (radius: number) => {
      const t = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * radius;
      return { x: r * Math.cos(t), y: r * Math.sin(t) };
    };

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLSpanElement>('.letter-particle');

      const baseScaleMap = new WeakMap<HTMLSpanElement, number>();
      const curScaleMap = new WeakMap<HTMLSpanElement, number>();
      const setScaleXMap = new WeakMap<HTMLSpanElement, (v: number) => void>();
      const setScaleYMap = new WeakMap<HTMLSpanElement, (v: number) => void>();
      const posMap = new WeakMap<HTMLSpanElement, { x: number; y: number }>();
      const velMap = new WeakMap<HTMLSpanElement, { vx: number; vy: number }>();
      const setXMap = new WeakMap<HTMLSpanElement, (v: number) => void>();
      const setYMap = new WeakMap<HTMLSpanElement, (v: number) => void>();

      gsap.fromTo(
        items,
        { autoAlpha: 0, scale: 0.95 },
        { autoAlpha: 1, scale: 1, duration: 0.6, stagger: 0.05, ease: 'power1.out' }
      );

      items.forEach((el) => {
        const start = randPointInCircle(safeR);
        const base = baseScaleByCount(letters.length);

        baseScaleMap.set(el, base);
        curScaleMap.set(el, base);

        setScaleXMap.set(el, gsap.quickSetter(el, 'scaleX') as (v: number) => void);
        setScaleYMap.set(el, gsap.quickSetter(el, 'scaleY') as (v: number) => void);
        setXMap.set(el, gsap.quickSetter(el, 'x', 'px') as (v: number) => void);
        setYMap.set(el, gsap.quickSetter(el, 'y', 'px') as (v: number) => void);
        posMap.set(el, { x: start.x, y: start.y });

        const ang = Math.random() * Math.PI * 2;
        const speed = gsap.utils.random(40, 80);
        velMap.set(el, { vx: Math.cos(ang) * speed, vy: Math.sin(ang) * speed });

        gsap.set(el, {
          xPercent: -50,
          yPercent: -50,
          x: start.x,
          y: start.y,
          rotate: gsap.utils.random(-12, 12),
          scaleX: base,
          scaleY: base,
          transformOrigin: '50% 50%',
          force3D: true,
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        });
      });

      const smooth = 0.08;

      const ticker = () => {
        const dr = gsap.ticker.deltaRatio(60);
        const dt = dr / 60;

        items.forEach((el) => {
          const p = posMap.get(el)!;
          const v = velMap.get(el)!;
          const setX = setXMap.get(el)!;
          const setY = setYMap.get(el)!;

          p.x += v.vx * dt;
          p.y += v.vy * dt;

          const dist = Math.hypot(p.x, p.y);
          if (dist > safeR) {
            const nx = p.x / dist;
            const ny = p.y / dist;
            const dot = v.vx * nx + v.vy * ny;
            v.vx = v.vx - 2 * dot * nx;
            v.vy = v.vy - 2 * dot * ny;
            p.x = nx * safeR - nx * 0.5;
            p.y = ny * safeR - ny * 0.5;
          }

          const wobble = 0.6;
          const ang = (Math.random() - 0.5) * wobble * dt;
          const cos = Math.cos(ang);
          const sin = Math.sin(ang);
          const vx = v.vx * cos - v.vy * sin;
          const vy = v.vx * sin + v.vy * cos;
          v.vx = vx;
          v.vy = vy;

          setX(p.x);
          setY(p.y);

          const t = 1 - Math.min(Math.hypot(p.x, p.y) / R, 1);
          const base = baseScaleMap.get(el) ?? 1;
          const target = base * (1 + k * t);
          const cur = curScaleMap.get(el) ?? base;
          const next = cur + (target - cur) * smooth;
          curScaleMap.set(el, next);

          const setScaleX = setScaleXMap.get(el);
          const setScaleY = setScaleYMap.get(el);
          setScaleX?.(next);
          setScaleY?.(next);
        });
      };

      gsap.ticker.add(ticker);
      return () => gsap.ticker.remove(ticker);
    }, containerRef);

    return () => ctx.revert();
  }, [letters, size, rimPadding]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <div
        ref={maskRef}
        className="absolute inset-0 flex items-center justify-center rounded-full overflow-hidden"
        style={{
          WebkitMaskImage: `url(${sphereMask})`,
          maskImage: `url(${sphereMask})`,
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
          clipPath: `circle(${clipRadius}px at 50% 50%)`,
        }}
      >
        {letters.map((ch, i) => (
          <span
            key={`${ch}-${i}`}
            className="letter-particle absolute font-bold tracking-wide select-none"
            style={{
              top: '50%',
              left: '50%',
              color: 'rgba(255,255,255,0.95)',
              textShadow: '0 0 8px rgba(147,197,253,0.85), 0 0 16px rgba(59,130,246,0.6)',
              fontSize: Math.max(14, Math.min(size * 0.12, 48)),
              lineHeight: 1,
              whiteSpace: 'nowrap',
              willChange: 'transform',
            }}
          >
            {ch}
          </span>
        ))}
      </div>

      <img
        src={sphereOverlay}
        alt=""
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
        draggable={false}
      />
    </div>
  );
}
