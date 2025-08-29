import { useEffect, useState } from 'react';
import BoardItem from './BoardItem';

import { useAuth } from '@/common/store/authStore';
import { selectCommunityListByUserId } from '@/common/api/Community/community';
import type { Tables } from '@/common/api/supabase/database.types';

function Post() {
  const userInfo = useAuth((state) => state.userInfo);
  const [communityListData, setCommunityListData] = useState<Tables<'community'>[] | null>(null);

  useEffect(() => {
    const selectCommunity = async () => {
      const communitydata = await selectCommunityListByUserId(userInfo.userId, 'created_at', false);
      setCommunityListData(communitydata);
    };
    selectCommunity();
  }, []);
  return (
    <section className=" w-[750px] h-[85vh] flex flex-col gap-5 pt-10">
      <h1 className="text-main-white pt-14 text-2xl font-semibold">Post</h1>

      <div className="flex flex-col ">
        <span className="text-main-white text-end mb-4">
          작성한 글 :{' '}
          {communityListData && communityListData?.length > 0 ? communityListData?.length : 0}개
        </span>
        <ul className="h-[65vh] border-t border-b border-main-white pt-4.5 overflow-y-auto scrollbar-thin scrollbar-thumb-main-white scrollbar-track-transparent">
          {communityListData &&
            communityListData?.length > 0 &&
            communityListData.map((communityData) => (
              <BoardItem
                id={communityData.id}
                createdAt={communityData.created_at?.slice(0, 10) ?? ''}
                likes={communityData.likes}
                title={communityData.title}
              />
            ))}
        </ul>
      </div>
    </section>
  );
}
export default Post;
