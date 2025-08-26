import { useMemo } from 'react';
import { LABEL_TO_KEY, type TopicLabel } from '@/pages/TarotQuestion/constants/topic';

type Props = {
  selectedTopic: TopicLabel | null;
  durationSec?: number;
};

export default function QuestionExamples({ selectedTopic, durationSec = 40 }: Props) {
  const baseText = useMemo(() => {
    const topicKey = selectedTopic ? LABEL_TO_KEY[selectedTopic] : null;
    return topicKey ? `${topicKey}의 예시 질문입니다.` : '기본 예시 질문입니다.';
  }, [selectedTopic]);

  const chunk = useMemo(() => {
    const body = Array.from({ length: 12 })
      .map(() => baseText)
      .join('  |  ');
    return body + '  |  ';
  }, [baseText]);

  return (
    <div className="relative w-[670px] overflow-hidden text-sm text-white/80">
      <div className="pointer-events-none absolute inset-0 z-10 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]" />

      <style>{`
        @keyframes examples-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .examples-track { animation: none !important; transform: none !important; }
        }
      `}</style>

      <div
        className="examples-track flex w-max"
        style={{
          animation: `examples-marquee ${durationSec}s linear infinite`,
          gap: 0,
          willChange: 'transform',
        }}
      >
        <span className="shrink-0 whitespace-nowrap">{chunk}</span>
        <span className="shrink-0 whitespace-nowrap">{chunk}</span>
      </div>
    </div>
  );
}
