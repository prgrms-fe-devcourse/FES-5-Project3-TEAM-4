import LikeIcon from '/icons/liked.svg';
import SubmitIcon from '/icons/submit.svg';
import WorkIcon from '/icons/work.svg';
import StudyIcon from '/icons/study.svg';
import MoneyIcon from '/icons/money.svg';
import HealthIcon from '/icons/health.svg';
import QuestionIcon from '/icons/question.svg';

import { TOPIC_LABEL, type TopicLabel } from '@/pages/TarotQuestion/constants/topic';

type TopicPromptProps = {
  selectedTopic: TopicLabel | null;
};

function resolveTopicMeta(topic: TopicLabel | null) {
  if (!topic) {
    return { icon: QuestionIcon, label: '주제를 선택하고 질문을 입력하세요' };
  }

  if (topic === TOPIC_LABEL.LOVE) return { icon: LikeIcon, label: '연애/관계에 대한 질문' };
  if (topic === TOPIC_LABEL.MONEY) return { icon: MoneyIcon, label: '금전/재물에 대한 질문' };
  if (topic === TOPIC_LABEL.CAREER) return { icon: WorkIcon, label: '직업/진로에 대한 질문' };
  if (topic === TOPIC_LABEL.HEALTH) return { icon: HealthIcon, label: '건강/힐링에 대한 질문' };
  if (topic === TOPIC_LABEL.GROWTH) return { icon: StudyIcon, label: '자기계발/성장에 대한 질문' };

  return { icon: QuestionIcon, label: `${topic}에 대한 질문` };
}

export default function TopicPrompt({ selectedTopic }: TopicPromptProps) {
  const { icon, label } = resolveTopicMeta(selectedTopic);

  return (
    <div className="inline-flex items-center justify-center p-4 bg-[#0E0724]/80 rounded-tl-[32px] rounded-br-[32px]">
      <div className="flex justify-between items-center rounded-full border border-white px-8 py-2 w-[640px]">
        <img src={icon} alt="" aria-hidden className="shrink-0" />

        <input
          type="text"
          placeholder="그대의 질문을 입력하세요 ..."
          className="text-white w-full max-w-[420px] placeholder:text-center bg-transparent outline-none"
          aria-label={label}
        />

        <button type="submit" className="cursor-pointer" aria-label="질문 전송">
          <img src={SubmitIcon} alt="" aria-hidden />
        </button>
      </div>
    </div>
  );
}
