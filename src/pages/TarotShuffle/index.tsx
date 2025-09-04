import { useNavigate, useLocation } from 'react-router-dom';
import ShuffleCards from './components/ShuffleCards';
import StopShuffleBtn from './components/StopShuffleBtn';

type Props = {
  onProceed?: () => void;
};

export default function TarotShuffle({ onProceed }: Props) {
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: { question?: string; topic?: string } };

  const goNext = () => {
    if (onProceed) onProceed();
    else navigate('/tarot/spread', { state });
  };

  return (
    <div className="flex flex-col py-16 w-full h-[90vh] justify-center items-center gap-10 text-main-white">
      <ShuffleCards />
      <h2>질문을 마음 속으로 충분히 그려보신 뒤 카드 뽑기를 시작하세요.</h2>
      <StopShuffleBtn onClick={goNext} />
    </div>
  );
}
