interface Props {
  id: string;
  createdAt: string | null;
  title: string | null;
  likes: number | null;
}
/**
 * 임시컴포넌트 삭제 예정
 * @param param0
 * @returns
 */
function BoardItem({ id, createdAt, title, likes }: Props) {
  return (
    <li
      key={id}
      className="flex justify-around gap-11 rounded-xl bg-[#0E0823] h-[48px] mb-4.5 items-center shadow-[0_2px_4px_0_rgba(255,255,255,0.25)]"
    >
      <span className="text-main-white ml-6">{createdAt}</span>
      <span className="text-main-white flex-1">{title}</span>
      <span className="text-main-white flex mr-2">
        <img src="/icons/likes.svg" alt="" />
        {likes}
      </span>
    </li>
  );
}
export default BoardItem;
