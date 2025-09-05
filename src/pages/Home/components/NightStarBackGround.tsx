import { getRandom } from '@/common/utils/getRandom';
import { useEffect, useRef } from 'react';
import Meteor from './Meteor';
import tw from '@/common/utils/tw';

type Star = {
  x: number;
  y: number;
  size: number;
  phase: number;
  freq: number;
};

interface Prop {
  sizeX?: string;
  sizeY?: string;
  className?: string;
  showMeteor?: boolean;
}

function NightStarBackGround({
  sizeX = '100%',
  sizeY = '100%',
  className,
  showMeteor = true,
}: Prop) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starListRef = useRef<Star[]>([]);
  const rAFRef = useRef<number>(0);

  useEffect(() => {
    const COUNT_STARS = 400;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    //css 상의 크기
    const { width: canvasX, height: canvasY } = canvas.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    //캔버스 크기 및 픽셀을 스크린 크기에 맞춤
    const resizeCanvas = () => {
      //내부 비트맵 크기
      canvas.width = Math.floor(canvasX * dpr);
      canvas.height = Math.floor(canvasY * dpr);
    };

    //별 무더기 생성
    if (starListRef.current.length === 0) {
      for (let i = 0; i < COUNT_STARS; i++) {
        starListRef.current.push({
          x: getRandom(0, canvasX * dpr),
          y: getRandom(0, canvasY * dpr),
          size: getRandom(0.8, 1.8),
          phase: getRandom(0, 2 * Math.PI),
          freq: getRandom(0.005, 0.01), //반짝이 속도
        });
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      //별무더기 그리기
      for (const s of starListRef.current) {
        s.phase += s.freq;

        const opacity = Math.sin(s.phase);

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(225,225,225,${opacity})`;
        ctx.fill();
      }

      requestAnimationFrame(draw);
    };

    resizeCanvas();
    rAFRef.current = requestAnimationFrame(draw);
  }, []);

  return (
    <div className="relative pointer-events-none" style={{ width: sizeX, height: sizeY }}>
      {showMeteor && <Meteor />}
      <canvas
        ref={canvasRef}
        className={tw(
          'w-full h-full -z-1 bg-linear-180 from-indigo-950 from-65% to-blue-800 pointer-events-none',
          className
        )}
      />
    </div>
  );
}
export default NightStarBackGround;
