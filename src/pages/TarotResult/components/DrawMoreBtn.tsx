import { useNavigate } from 'react-router-dom';
import DrawIcon from '@/assets/Tarot/icons/draw.svg';
import { tarotStore } from '@/pages/Tarot/store/tarotStore';

function DrawMoreBtn() {
  const navigate = useNavigate();
  const setClarifyMode = tarotStore((s) => s.setClarifyMode);
  const setStage = tarotStore((s) => s.setStage);

  return (
    <button
      type="button"
      onClick={() => {
        setClarifyMode(true);
        setStage('clarify');
        navigate('/tarot/spread', { replace: true });
      }}
      className="flex py-1 px-3 gap-2.5 rounded-full border border-main-white text-main-white hover:bg-[linear-gradient(90deg,#0E0724_10%,rgba(235,54,120,0.5)_100%)] hover:shadow-[0_0_12px_#ffffff] cursor-pointer"
    >
      <img src={DrawIcon} alt="" />
      Draw More
    </button>
  );
}
export default DrawMoreBtn;
