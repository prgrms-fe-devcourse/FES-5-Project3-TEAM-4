function RecordItem() {
  return (
    <li className="flex items-center mb-3 rounded-3xl h-[32px] bg-white/5 shadow-[0_4px_50px_5px_rgba(0,0,0,0.20)] backdrop-blur-[30px]">
      <a className="flex gap-6.5 items-center" href="#">
        <span className="text-main-white text-xs ml-6">2025-08-22</span>
        <img src="/icons/timelineBtn.svg" alt="" />
        <span className="text-main-white text-xs">기록해보세요</span>
      </a>
    </li>
  );
}
export default RecordItem;
