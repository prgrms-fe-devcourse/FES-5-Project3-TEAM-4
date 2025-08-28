import { useState } from 'react';
import TopicButton from './components/TopicButton';
import TopicPrompt from './components/TopicPrompt';
import { TOPIC_LABEL_LIST, type TopicLabel } from '@/common/types/TarotTopics';
import CrystalBallStage from './components/CrystalBallStage';
import CrystalSphere from '@/assets/Tarot/crystal_sphere.png';
import QuestionExamples from './components/QuestionExamples';

export default function TarotQuestion() {
  const [selectedTopic, setSelectedTopic] = useState<TopicLabel | null>(null);
  const [pickedQuestion, setPickedQuestion] = useState<string>('');

  return (
    <div className="mx-auto w-full md:max-w-screen-md lg:max-w-screen-lg px-4 md:px-5 lg:px-6 space-y-3 lg:space-y-4 pb-2 md:pb-3 lg:pb-4">
      <section
        className="
          relative isolate z-0 mx-auto aspect-square
          w-[clamp(440px,80vw,520px)]
          md:w-[clamp(460px,72vw,580px)]
          lg:w-[clamp(500px,46vw,680px)]
          -mb-8 md:-mb-12 lg:-mb-16
        "
      >
        <img
          src={CrystalSphere}
          aria-hidden
          alt=""
          className="pointer-events-none absolute inset-0 z-0 w-full h-full object-contain top-8"
        />
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <CrystalBallStage selectedTopic={selectedTopic} />
        </div>
      </section>

      <section
        className="
          relative z-30 w-full mx-auto
          max-w-[min(92vw,560px)]
          md:max-w-[min(92vw,640px)]
          lg:max-w-[min(92vw,720px)]
        "
      >
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 lg:gap-4">
          {TOPIC_LABEL_LIST.map((t) => (
            <TopicButton
              key={t}
              topic={t}
              selected={selectedTopic === t}
              onSelect={(topic) => setSelectedTopic((prev) => (prev === topic ? null : topic))}
            />
          ))}
        </div>
      </section>

      <section
        className="
          relative z-30 w-full mx-auto
          max-w-[min(92vw,560px)]
          md:max-w-[min(92vw,640px)]
          lg:max-w-[min(92vw,720px)]
        "
      >
        <TopicPrompt selectedTopic={selectedTopic} presetValue={pickedQuestion} />
      </section>

      <section
        className="
          relative z-20 w-full mx-auto
          max-w-[min(92vw,600px)]
          md:max-w-[min(92vw,670px)]
          lg:max-w-[min(92vw,760px)]
        "
      >
        <QuestionExamples
          selectedTopic={selectedTopic}
          onPick={(text) => setPickedQuestion(text)}
        />
      </section>
    </div>
  );
}
