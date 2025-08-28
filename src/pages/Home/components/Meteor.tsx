import { getRandom } from '@/common/utils/getRandom';
import { useEffect, useRef } from 'react';

type Meteor = {
  x: number;
  y: number;
  length: number;
  vx: number;
  vy: number;
  life: number;
  lifeSpeed: number;
  defaultLength: number;
  maxLength: number;
};

function Meteor() {
  const meteorCanvasRef = useRef<HTMLCanvasElement>(null);
  const meteorRef = useRef<Meteor[]>([]);
  const rAFRef = useRef<number>(0);

  useEffect(() => {
    const canvas = meteorCanvasRef.current!;
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

    //유성우 생성 함수
    const spawnMeteor = () => {
      const defaultLength = getRandom(5, 10);
      meteorRef.current.push({
        x: getRandom(0, canvas.width),
        y: getRandom(0, canvas.height * 0.4),
        length: getRandom(100, 150),
        vx: getRandom(8, 12),
        vy: getRandom(4, 8),
        life: 0,
        lifeSpeed: getRandom(0.005, 0.015),
        defaultLength: defaultLength,
        maxLength: defaultLength * getRandom(2, 10),
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      //spawn 유성우 빈도
      if (getRandom(0, 1) < 0.005) {
        spawnMeteor();
      }

      //유성우 그리기
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      for (let i = meteorRef.current.length - 1; i >= 0; i--) {
        const m = meteorRef.current[i];
        m.x += m.vx;
        m.y += m.vy;

        m.life += m.lifeSpeed;
        const t = Math.min(m.life, 1);
        const a = 1 - t;

        const easeOut = 1 - Math.pow(1 - t, 3);
        const currLength = m.defaultLength + (m.maxLength - m.defaultLength) * easeOut;

        //유성우 꼬리 각도(벡터) 계산
        const velocityLength = Math.sqrt(m.vx * m.vx + m.vy * m.vy);
        const dx = (m.vx / velocityLength) * currLength;
        const dy = (m.vy / velocityLength) * currLength;

        ctx.strokeStyle = `rgba(255,255,255,${a})`;
        ctx.lineCap = 'round';
        //Glow 효과
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(255,255,255,${a})`;

        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x + dx, m.y + dy);
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';

        if (t >= 1) {
          meteorRef.current.splice(i, 1);
        }
      }

      requestAnimationFrame(draw);
    };

    resizeCanvas();

    rAFRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rAFRef.current);
  }, []);

  return <canvas ref={meteorCanvasRef} className="w-full h-full absolute -z-1" />;
}
export default Meteor;
