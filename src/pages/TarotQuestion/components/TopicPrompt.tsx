import { useState, useEffect } from 'react';
import LikeIcon from '@/assets/Tarot/icons/liked.svg';
import SubmitIcon from '@/assets/Tarot/icons/submit.svg';
import WorkIcon from '@/assets/Tarot/icons/work.svg';
import StudyIcon from '@/assets/Tarot/icons/study.svg';
import MoneyIcon from '@/assets/Tarot/icons/money.svg';
import HealthIcon from '@/assets/Tarot/icons/health.svg';
import QuestionIcon from '@/assets/Tarot/icons/question.svg';
import { TOPIC_LABEL, type TopicLabel } from '../types/TarotTopics';

type TopicPromptProps = {
  selectedTopic: TopicLabel | null;
  onSubmit?: (value: string, topic: TopicLabel | null) => void;
  presetValue?: string;
};

function resolveTopicMeta(topic: TopicLabel | null) {
  if (!topic) return { icon: QuestionIcon, label: '주제를 선택하고 질문을 입력하세요' };
  if (topic === TOPIC_LABEL.LOVE) return { icon: LikeIcon, label: '연애/관계에 대한 질문' };
  if (topic === TOPIC_LABEL.MONEY) return { icon: MoneyIcon, label: '금전/재물에 대한 질문' };
  if (topic === TOPIC_LABEL.CAREER) return { icon: WorkIcon, label: '직업/진로에 대한 질문' };
  if (topic === TOPIC_LABEL.HEALTH) return { icon: HealthIcon, label: '건강/힐링에 대한 질문' };
  if (topic === TOPIC_LABEL.GROWTH) return { icon: StudyIcon, label: '자기계발/성장에 대한 질문' };
  return { icon: QuestionIcon, label: `${topic}에 대한 질문` };
}

export default function TopicPrompt({ selectedTopic, onSubmit, presetValue }: TopicPromptProps) {
  const { icon, label } = resolveTopicMeta(selectedTopic);
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof presetValue === 'string') {
      setValue(presetValue);
      if (presetValue.trim()) setError(null);
    }
  }, [presetValue]);

  const inputId = 'topic-prompt-input';
  const errorId = 'topic-prompt-error';

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError('🚨질문을 입력하세요.🚨');
      return;
    }
    setError(null);
    onSubmit?.(trimmed, selectedTopic);
  };

  return (
    <div className="gap-1 w-full">
      <form
        onSubmit={handleSubmit}
        className={[
          'flex items-center gap-3 md:gap-4 rounded-full border w-full',
          'px-4 md:px-6 lg:px-8 md:py-1',
          'max-w-[min(92vw,560px)] md:max-w-[min(92vw,640px)] lg:max-w-[min(92vw,720px)] mx-auto',
          'border-main-white',
          error ? 'ring-1 ring-red-400/50 border-red-400' : '',
        ].join(' ')}
        noValidate
      >
        <img src={icon} alt="" aria-hidden className="shrink-0 size-5 md:size-6 lg:size-7" />

        <input
          id={inputId}
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          placeholder="그대의 질문을 입력하세요 ..."
          className="bg-transparent outline-none w-full text-main-white placeholder:text-center text-sm md:text-base lg:text-lg"
          aria-label={label}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        />

        <button
          type="submit"
          className="cursor-pointer shrink-0 ml-1 md:ml-2 lg:ml-3 p-1.5 md:p-2"
          aria-label="질문 전송"
        >
          <img src={SubmitIcon} alt="" aria-hidden className="size-5 md:size-6 lg:size-7" />
        </button>
      </form>

      {error && (
        <p
          id={errorId}
          role="alert"
          aria-live="polite"
          className="mt-2 text-[11px] md:text-xs lg:text-sm text-red-400 text-center w-full"
        >
          {error}
        </p>
      )}
    </div>
  );
}
