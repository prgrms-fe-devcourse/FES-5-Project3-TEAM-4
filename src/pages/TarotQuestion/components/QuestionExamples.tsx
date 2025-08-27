import { useLayoutEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { type TopicLabel } from '@/common/types/TarotTopics';

type Props = {
  selectedTopic: TopicLabel | null;
  intervalSec?: number;
  flipDurSec?: number;
  firstDelaySec?: number;
  onPick?: (text: string) => void;
};

const EXAMPLE_QUESTIONS: Record<'DEFAULT' | TopicLabel, string[]> = {
  DEFAULT: [
    '오늘 운세에서 유의할 점은?',
    '가장 먼저 집중해야 할 과제는?',
    '나에게 필요한 메시지는 무엇일까?',
  ],
  '연애 | 관계': [
    '이 관계에서 제가 유의해야 할 점은?',
    '상대의 진심을 어떻게 파악할 수 있을까?',
    '다음 만남을 위한 최고의 타이밍은?',
  ],
  '금전 | 재물': [
    '지금 투자/저축 중 어디에 더 집중해야 할까?',
    '가까운 시일 내 금전 흐름의 포인트는?',
    '원하지 않는 지출을 줄이는 팁은?',
  ],
  '직업 | 진로': [
    '커리어 전환의 적기는 언제일까?',
    '면접에서 강조할 나만의 강점은?',
    '지금 팀에서의 성장 포인트는?',
  ],
  '건강 | 힐링': [
    '컨디션 관리에 가장 필요한 루틴은?',
    '휴식과 일의 균형을 맞추는 키워드는?',
    '스트레스 완화를 위한 실천 팁은?',
  ],
  '자기계발 | 성장': [
    '이번 달 집중할 성장 과제는?',
    '지속 가능한 공부 루틴의 핵심은?',
    '나의 성장을 막는 가장 큰 장애물은?',
  ],
};

export default function QuestionExamples({
  selectedTopic,
  intervalSec = 3.2,
  flipDurSec = 0.5,
  firstDelaySec,
  onPick,
}: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const flipperRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const questions = useMemo(
    () => EXAMPLE_QUESTIONS[selectedTopic ?? 'DEFAULT'] ?? EXAMPLE_QUESTIONS.DEFAULT,
    [selectedTopic]
  );

  useLayoutEffect(() => {
    const stage = stageRef.current!;
    const flip = flipperRef.current!;
    const front = frontRef.current!;
    const back = backRef.current!;
    if (!stage || !flip || !front || !back) return;

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    let idx = 0;
    let currentText = questions[0] ?? '';
    front.textContent = currentText;
    back.textContent = questions[1 % questions.length] ?? '';

    gsap.set(stage, { perspective: 900, perspectiveOrigin: '50% 50%' });
    gsap.set(flip, {
      rotationX: 0,
      transformStyle: 'preserve-3d',
      transformOrigin: '50% 50%',
      force3D: true,
    });
    gsap.set(front, {
      rotationX: 0,
      z: 0.01,
      backfaceVisibility: 'hidden',
      willChange: 'transform, opacity',
    });
    gsap.set(back, {
      rotationX: 180,
      z: 0.01,
      backfaceVisibility: 'hidden',
      willChange: 'transform, opacity',
    });

    const doFlipOnce = () => {
      const next = questions[(idx + 1) % questions.length] ?? '';
      back.textContent = next;

      gsap.to(flip, {
        duration: reduce ? 0 : flipDurSec,
        rotationX: 180 - 0.001,
        ease: 'power2.inOut',
        onComplete: () => {
          front.textContent = back.textContent || '';
          currentText = front.textContent || '';
          gsap.set(flip, { rotationX: 0 });
          idx = (idx + 1) % questions.length;
        },
      });
    };

    const period = Math.max(1000, intervalSec * 1000);
    const firstDelay = Math.max(0, firstDelaySec ?? Math.min(intervalSec * 0.5, 0.8)) * 1000;

    let pending: ReturnType<typeof gsap.delayedCall> | null = null;
    const scheduleNext = (ms: number) => {
      pending = gsap.delayedCall(ms / 1000, () => {
        if (questions.length > 1) doFlipOnce();
        scheduleNext(period);
      });
    };
    scheduleNext(firstDelay);

    const handlePick = () => onPick?.(currentText);
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onPick?.(currentText);
      }
    };
    flip.addEventListener('click', handlePick);
    flip.addEventListener('keydown', handleKey);

    return () => {
      pending?.kill();
      gsap.killTweensOf([flip, front, back]);
      flip.removeEventListener('click', handlePick);
      flip.removeEventListener('keydown', handleKey);
    };
  }, [questions, intervalSec, flipDurSec, firstDelaySec, onPick]);

  return (
    <div
      ref={stageRef}
      className="relative w-full overflow-hidden text-sm text-main-white/80"
      style={{ height: '1.6em' }}
    >
      <div
        ref={flipperRef}
        className="relative mx-auto cursor-pointer outline-none"
        role="button"
        tabIndex={0}
        aria-label="예시 질문 선택"
      >
        <div
          ref={frontRef}
          className="absolute inset-x-0 top-0 text-center whitespace-nowrap leading-[1.2]"
          role="status"
          aria-live="polite"
        />
        <div
          ref={backRef}
          className="absolute inset-x-0 top-0 text-center whitespace-nowrap leading-[1.2]"
          aria-hidden
        />
      </div>
    </div>
  );
}
