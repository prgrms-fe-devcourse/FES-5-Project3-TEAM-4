import CrystalBallLetters from './CrystalBallLetters';
import { LABEL_TO_KEY, type TopicLabel, type TopicKey } from '@/common/types/TarotTopics';

type Props = {
  selectedTopic: TopicLabel | null;
  size?: number;
  rimPadding?: number;
};

export default function CrystalBallStage({ selectedTopic, size = 400, rimPadding = 70 }: Props) {
  const selectedKey: TopicKey | null = selectedTopic ? LABEL_TO_KEY[selectedTopic] : null;

  return (
    <div className="flex flex-col items-center gap-4 md:gap-5 lg:gap-6">
      <div
        className="
        aspect-square 
        w-[clamp(260px,62vw,380px)]
        md:w-[clamp(320px,60vw,440px)]
        lg:w-[clamp(360px,32vw,540px)]
      "
      >
        <CrystalBallLetters
          selectedKey={selectedKey}
          size={size}
          rimPadding={rimPadding}
          className="w-full"
        />
      </div>
    </div>
  );
}
