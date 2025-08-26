import { useState } from 'react';
import TopicButton from './components/TopicButton';
import TopicPrompt from './components/TopicPrompt';
import { TOPIC_LABEL_LIST, type TopicLabel } from '@/pages/TarotQuestion/constants/topic';
import CrystalBallStage from './components/CrystalBallStage';
import CrystalSphere from '@/assets/crystal_sphere.png';
import QuestionExamples from './components/QuestionExamples';

export default function TarotQuestion() {
  const [selectedTopic, setSelectedTopic] = useState<TopicLabel | null>(null);

  return (
    <div className="relative flex justify-center flex-wrap gap-6">
      <img
        src={CrystalSphere}
        className="pointer-events-none absolute mx-auto w-[540px] h-[540px] object-contain z-0 -top-10"
        alt=""
        aria-hidden
      />

      <div className="relative z-10">
        <CrystalBallStage selectedTopic={selectedTopic} />
      </div>

      <div className="relative z-10 flex flex-col justify-center items-center gap-2">
        <div className="flex flex-wrap gap-5">
          {TOPIC_LABEL_LIST.map((t) => (
            <TopicButton
              key={t}
              topic={t}
              selected={selectedTopic === t}
              onSelect={(topic) => setSelectedTopic((prev) => (prev === topic ? null : topic))}
            />
          ))}
        </div>
        <TopicPrompt selectedTopic={selectedTopic} />
        <QuestionExamples selectedTopic={selectedTopic} />
      </div>
    </div>
  );
}
