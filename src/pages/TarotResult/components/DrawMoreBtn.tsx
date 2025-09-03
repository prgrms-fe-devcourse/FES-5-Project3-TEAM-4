import DrawIcon from '@/assets/Tarot/icons/draw.svg';

function DrawMoreBtn() {
  return (
    <button
      type="button"
      className="flex py-1 px-3 gap-2.5 rounded-full border border-main-white text-main-white bg-[#1F1F1F] bg-[linear-gradient(90deg,#0E0724_10%,rgba(235,54,120,0.5)_100%)] cursor-pointer"
    >
      <img src={DrawIcon} alt="" />
      Draw More
    </button>
  );
}
export default DrawMoreBtn;
