import CrystalBallLetters from './CrystalBallLetters';
import { LABEL_TO_KEY, type TopicLabel, type TopicKey } from '../constants/topic';

type Props = {
  selectedTopic: TopicLabel | null;
  size?: number;
  rimPadding?: number;
};

export default function CrystalBallStage({ selectedTopic, size = 400, rimPadding = 60 }: Props) {
  const selectedKey: TopicKey | null = selectedTopic ? LABEL_TO_KEY[selectedTopic] : null;

  return (
    <div className="flex flex-col items-center gap-6">
      <CrystalBallLetters selectedKey={selectedKey} size={size} rimPadding={rimPadding} />
    </div>
  );
}
