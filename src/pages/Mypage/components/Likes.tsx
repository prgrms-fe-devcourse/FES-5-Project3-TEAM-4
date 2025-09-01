import { useEffect, useState } from 'react';
import BoardItem from './BoardItem';
import { useAuth } from '@/common/store/authStore';
import type { Tables } from '@/common/api/supabase/database.types';
import { selectLikeListWithCommunity } from '@/common/api/Likes/likes';
import { Link } from 'react-router';

type LikeListProps = Tables<'likes'> & { community: Tables<'community'> };

function Likes() {
  const userInfo = useAuth((state) => state.userInfo);
  const [likesListData, setLikesListData] = useState<LikeListProps[] | null>(null);

  useEffect(() => {
    const selectCommunity = async () => {
      const likesData = await selectLikeListWithCommunity(userInfo.userId);
      setLikesListData(likesData);
    };
    selectCommunity();
  }, []);
  return (
    <section className=" w-[750px] h-[85vh] flex flex-col gap-5 pt-10">
      <h1 className="text-main-white pt-14 text-2xl font-semibold">Likes</h1>
      <div className="flex flex-col ">
        {likesListData && likesListData.length > 0 && (
          <>
            <span className="text-main-white text-end mb-4">
              좋아요한 글 : {likesListData?.length ?? 0}개
            </span>
            <ul className="h-[65vh] border-t border-b border-main-white pt-4.5 overflow-y-auto scrollbar-thin scrollbar-thumb-main-white scrollbar-track-transparent">
              {likesListData.map(({ community }) => (
                <BoardItem
                  id={community.id}
                  createdAt={community.created_at}
                  title={community.title}
                  likes={community.likes}
                />
              ))}
            </ul>
          </>
        )}
        {!likesListData ||
          (likesListData && likesListData.length === 0 && (
            <div className="flex flex-col gap-4 text-main-white items-center justify-center h-[65vh] border-t border-b border-main-white font-semibold">
              <p>아직 좋아요한 글이 없어요.</p>
              <Link to={'/community'} className="underline p-1">
                커뮤니티에서 마음에 드는 글을 찾아보세요
              </Link>
            </div>
          ))}
      </div>
    </section>
  );
}
export default Likes;
