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
    <div
      className="flex flex-col w-full min-h-screen items-center text-main-white bg-[url('/velvet.png')]"
      style={{
        backgroundImage: "url('/velvet.png')",
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%', // 강제로 div 크기에 맞춤
      }}
    >
      <div className="flex flex-col items-center gap-10 flex-grow justify-center">
        <ShuffleCards />
      </div>

      <div className="flex flex-col gap-5 mb-10">
        <h2>질문을 마음속으로 충분히 그려보신 뒤, 멈추고 싶을 때 멈추시면 됩니다.</h2>

        <StopShuffleBtn onClick={goNext} />
      </div>
    </div>
  );
}
