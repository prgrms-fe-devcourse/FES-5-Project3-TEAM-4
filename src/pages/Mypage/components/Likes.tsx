import BoardItem from './BoardItem';

function Likes() {
  return (
    <>
      <h1 className="text-main-white pt-14 text-2xl font-semibold">Likes</h1>
      <div className="flex flex-col ">
        <span className="text-main-white text-end mb-4">좋아요한 글 : 4개</span>
        <ul className="h-[70vh] border-t border-b border-main-white flex flex-col pt-4.5 gap-4.5 overflow-auto">
          <BoardItem />
        </ul>
      </div>
    </>
  );
}
export default Likes;
