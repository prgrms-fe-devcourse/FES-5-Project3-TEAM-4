import { useState } from 'react';
import TarotQuestion from '../TarotQuestion';
import TarotShuffle from '../TarotShuffle';
import TarotSpreadDraw from '../TarotSpreadDraw';
import { type TopicLabel } from '@/common/types/TarotTopics';

export default function Tarot() {
  const [stage, setStage] = useState<'question' | 'shuffle' | 'spread'>('question');
  const [question, setQuestion] = useState('');
  const [topic, setTopic] = useState<TopicLabel | null>(null);

  return (
    <div className="bg-gray-800">
      {stage === 'question' && (
        <TarotQuestion
          presetQuestion={question}
          selectedTopicInitial={topic}
          onSubmitQuestion={(q, t) => {
            setQuestion(q);
            setTopic(t);
            setStage('shuffle');
          }}
        />
      )}

      {stage === 'shuffle' && <TarotShuffle onProceed={() => setStage('spread')} />}

      {stage === 'spread' && <TarotSpreadDraw />}
    </div>
  );
}
