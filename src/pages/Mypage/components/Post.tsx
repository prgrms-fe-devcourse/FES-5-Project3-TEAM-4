import BoardItem from './BoardItem';

function Post() {
  return (
    <>
      <h1 className="text-main-white pt-14 text-2xl font-semibold">Post</h1>
      <div className="flex flex-col ">
        <span className="text-main-white text-end mb-4">작성한 글 : 4개</span>
        <ul className="h-[70vh] border-t border-b border-main-white flex flex-col pt-4.5 gap-4.5 overflow-auto">
          <BoardItem />
        </ul>
      </div>
    </>
  );
}
export default Post;
