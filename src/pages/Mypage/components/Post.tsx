import BoardItem from './BoardItem';
import type { Tables } from '@/common/api/supabase/database.types';
import { Link, useLoaderData } from 'react-router';

function Post() {
  const communityListData = useLoaderData() as Tables<'community'>[];
  return (
    <section className=" w-[750px] h-[85vh] flex flex-col gap-5 pt-10">
      <h1 className="text-main-white pt-14 text-2xl font-semibold">Post</h1>

      <div className="flex flex-col ">
        {communityListData && communityListData?.length > 0 && (
          <>
            <span className="text-main-white text-end mb-4">
              작성한 글 : {communityListData?.length ?? 0}개
            </span>
            <ul className="h-[65vh] border-t border-b border-main-white pt-4.5 overflow-y-auto scrollbar-thin scrollbar-thumb-main-white scrollbar-track-transparent">
              {communityListData.map((communityData) => (
                <BoardItem
                  id={communityData.id}
                  createdAt={communityData.created_at?.slice(0, 10) ?? ''}
                  likes={communityData.likes}
                  title={communityData.title}
                />
              ))}
            </ul>
          </>
        )}
        {!communityListData ||
          (communityListData && communityListData.length === 0 && (
            <div className="flex flex-col gap-4 text-main-white items-center justify-center h-[65vh] border-t border-b border-main-white">
              <p>아직 작성한 글이 없어요.</p>
              <Link to={'/community'} className="underline p-1">
                커뮤니티에서 글을 작성해보세요
              </Link>
            </div>
          ))}
      </div>
    </section>
  );
}
export default Post;
