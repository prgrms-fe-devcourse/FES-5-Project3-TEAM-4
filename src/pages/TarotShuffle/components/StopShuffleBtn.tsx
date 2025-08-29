import SpreadIcon from '@/assets/Tarot/icons/spread.svg';

type Props = {
  onClick?: () => void;
};

function StopShuffleBtn({ onClick }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-main-white">
      <button
        type="button"
        onClick={onClick}
        className="px-5 py-3 flex gap-3 rounded-full border-1 border-main-white cursor-pointer bg-[linear-gradient(90deg,#0E0724_10%,rgba(235,54,120,0.5)_100%)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0E0724] hover:shadow-[0_0_12px_#ffffff] hover:-translate-y-0.5 hover:bg-white/5"
      >
        <img src={SpreadIcon} alt="카드 스프레드하고 뽑는 아이콘" className="w-6 h-6" />
        <p className="text-lg ">Spread & Draw</p>
      </button>
    </div>
  );
}
export default StopShuffleBtn;
