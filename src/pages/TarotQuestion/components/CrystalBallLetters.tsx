import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import sphereOverlay from '@/assets/Tarot/crystal_sphere_overlay.svg';
import sphereMask from '@/assets/Tarot/crystal_sphere_mask.svg';
import { type TopicKey } from '../types/TarotTopics';

type Props = {
  selectedKey: TopicKey | null;
  size?: number;
  rimPadding?: number;
  className?: string;
};

type NumSetter = (v: number) => void;

export default function CrystalBallLetters({
  selectedKey,
  size = 400,
  rimPadding = 60,
  className = '',
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  const [boxSize, setBoxSize] = useState<number>(size);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      if (w > 0) setBoxSize(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const letters = useMemo(() => (selectedKey ? selectedKey.split('') : []), [selectedKey]);

  useEffect(() => {
    if (!maskRef.current || letters.length === 0) return;

    const scopeEl = maskRef.current;
    const R = boxSize / 2 - rimPadding;
    const baseScaleByCount = (len: number) => (len <= 4 ? 1.1 : len >= 6 ? 0.9 : 1);
    const k = 1.0;
    const safeR = R - 5;

    const randPointInCircle = (radius: number) => {
      const t = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * radius;
      return { x: r * Math.cos(t), y: r * Math.sin(t) };
    };

    const ctx = gsap.context(() => {
      const items = Array.from(scopeEl.querySelectorAll<HTMLSpanElement>('.letter-particle'));
      if (items.length === 0) return;

      const baseScaleMap = new WeakMap<HTMLSpanElement, number>();
      const curScaleMap = new WeakMap<HTMLSpanElement, number>();
      const setScaleXMap = new WeakMap<HTMLSpanElement, NumSetter>();
      const setScaleYMap = new WeakMap<HTMLSpanElement, NumSetter>();
      const positionMap = new WeakMap<HTMLSpanElement, { x: number; y: number }>();
      const velocityMap = new WeakMap<HTMLSpanElement, { vx: number; vy: number }>();
      const setXMap = new WeakMap<HTMLSpanElement, NumSetter>();
      const setYMap = new WeakMap<HTMLSpanElement, NumSetter>();

      gsap.fromTo(
        items,
        { autoAlpha: 0, scale: 0.95 },
        { autoAlpha: 1, scale: 1, duration: 0.6, stagger: 0.05, ease: 'power1.out' }
      );

      items.forEach((item) => {
        const start = randPointInCircle(safeR);
        const base = baseScaleByCount(letters.length);

        baseScaleMap.set(item, base);
        curScaleMap.set(item, base);

        setScaleXMap.set(item, gsap.quickSetter(item, 'scaleX') as NumSetter);
        setScaleYMap.set(item, gsap.quickSetter(item, 'scaleY') as NumSetter);
        setXMap.set(item, gsap.quickSetter(item, 'x', 'px') as NumSetter);
        setYMap.set(item, gsap.quickSetter(item, 'y', 'px') as NumSetter);
        positionMap.set(item, { x: start.x, y: start.y });

        const ang = Math.random() * Math.PI * 2;
        const speed = gsap.utils.random(40, 80);
        velocityMap.set(item, { vx: Math.cos(ang) * speed, vy: Math.sin(ang) * speed });

        gsap.set(item, {
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

        items.forEach((item) => {
          const position = positionMap.get(item)!;
          const velocity = velocityMap.get(item)!;
          const setX = setXMap.get(item)!;
          const setY = setYMap.get(item)!;

          position.x += velocity.vx * dt;
          position.y += velocity.vy * dt;

          const dist = Math.hypot(position.x, position.y);
          if (dist > safeR) {
            const nx = position.x / dist;
            const ny = position.y / dist;
            const dot = velocity.vx * nx + velocity.vy * ny;
            velocity.vx = velocity.vx - 2 * dot * nx;
            velocity.vy = velocity.vy - 2 * dot * ny;
            position.x = nx * safeR - nx * 0.5;
            position.y = ny * safeR - ny * 0.5;
          }

          const wobble = 0.6;
          const ang = (Math.random() - 0.5) * wobble * dt;
          const cos = Math.cos(ang);
          const sin = Math.sin(ang);
          const vx = velocity.vx * cos - velocity.vy * sin;
          const vy = velocity.vx * sin + velocity.vy * cos;
          velocity.vx = vx;
          velocity.vy = vy;

          setX(position.x);
          setY(position.y);

          const t = 1 - Math.min(Math.hypot(position.x, position.y) / R, 1);
          const base = baseScaleMap.get(item) ?? 1;
          const target = base * (1 + k * t);
          const cur = curScaleMap.get(item) ?? base;
          const next = cur + (target - cur) * smooth;
          curScaleMap.set(item, next);

          const setScaleX = setScaleXMap.get(item);
          const setScaleY = setScaleYMap.get(item);
          setScaleX?.(next);
          setScaleY?.(next);
        });
      };

      gsap.ticker.add(ticker);

      return () => {
        gsap.killTweensOf(items);
        gsap.ticker.remove(ticker);
      };
    }, scopeEl);

    return () => ctx.revert();
  }, [letters, boxSize, rimPadding]);

  return (
    <div
      ref={containerRef}
      className={['relative flex items-center justify-center aspect-square w-full', className].join(
        ' '
      )}
    >
      <div
        ref={maskRef}
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
        style={{
          WebkitMaskImage: `url(${sphereMask})`,
          maskImage: `url(${sphereMask})`,
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
          clipPath: `circle(${boxSize / 2 - 2}px at 50% 50%)`,
        }}
      >
        {letters.map((ch, i) => (
          <span
            key={`${ch}-${i}`}
            className="letter-particle absolute font-bold select-none"
            style={{
              top: '50%',
              left: '50%',
              color: 'rgba(255,255,255,0.95)',
              textShadow: '0 0 8px rgba(147,197,253,0.85), 0 0 16px rgba(59,130,246,0.6)',
              fontSize: Math.max(14, Math.min(boxSize * 0.12, 48)),
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
        className="absolute inset-0 pointer-events-none select-none w-full h-full"
        draggable={false}
      />
    </div>
  );
}
