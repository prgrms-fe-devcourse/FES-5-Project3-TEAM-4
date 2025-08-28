function BoardItem() {
  return (
    <li className="flex justify-around gap-11 rounded-xl bg-[#0E0823] h-[48px] items-center shadow-[0_2px_4px_0_rgba(255,255,255,0.25)]">
      <span className="text-main-white ml-6">2025-08-24</span>
      <span className="text-main-white flex-1">안녕하세요 반갑습니다.</span>
      <span className="text-main-white flex mr-2">
        <img src="/icons/likes.svg" alt="" />1
      </span>
    </li>
  );
}
export default BoardItem;
