import { ListItem, type Post } from '@/common/components/ListItem';

import type { CommunityRowUI } from '@/common/types/community';
import { Link, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { CommunityListHeader } from '@/pages/Community/components/index/CommunityListHeader';
import { formatDate } from '@/common/utils/format';
import supabase from '@/common/api/supabase/supabase';
import { useToggleLike } from '@/common/hooks/useToggleLike';
import { selectCommunityListByUserId } from '@/common/api/Community/community';

import { useAuth } from '@/common/store/authStore';
import Loading from '@/common/components/Loading';
import { useShallow } from 'zustand/shallow';
import { showAlert } from '@/common/utils/sweetalert';

function Post() {
  const navigate = useNavigate();
  const { toggleLike } = useToggleLike();

  const [rows, setRows] = useState<CommunityRowUI[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { userId, isReady } = useAuth(
    useShallow((state) => ({ userId: state.userId, isReady: state.isReady }))
  );

  useEffect(() => {
    if (!isReady) return;
    if (!userId) {
      showAlert('error', '로그인 정보가 없습니다.', '다시 로그인을 시도 해주세요', () => {
        navigate('/auth/login');
      });
      return;
    }
    const fetchList = async () => {
      setLoading(true);
      try {
        const { items, total } = await selectCommunityListByUserId(userId, 'created_at', false);

        let likedSet = new Set<string>();
        if (userId && items.length) {
          // 내가 좋아요한 community_id만 뽑기
          const { data: likedRows } = await supabase
            .from('likes')
            .select('community_id')
            .eq('profile_id', userId)
            .in(
              'community_id',
              items.map((i) => i.id)
            );
          likedSet = new Set((likedRows ?? []).map((r) => r.community_id as string));
        }
        // rows에 likedByMe 플래그 합치기
        setRows(items.map((i) => ({ ...i, likedByMe: likedSet.has(i.id) })));
        setTotal(total);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [isReady]);

  const handleClickLike = async (communityId: string) => {
    const next = await toggleLike(communityId);
    if (!next) return;
    setRows((prev) =>
      prev.map((r) =>
        r.id === communityId ? { ...r, likes: next.count, likedByMe: next.liked } : r
      )
    );
  };

  const handleClickList = (id: string) => {
    const row = rows.find((r) => r.id === id);
    navigate(`/community/${id}`, { state: { row } });
  };

  // UI에 필요한 형태로만 매핑해서 ListItem에 넘김
  const listForUI: Post[] = rows.map((r) => ({
    id: r.id,
    date: formatDate(r.created_at ?? ''),
    title: r.title ?? '',
    likes: r.likes ?? 0,
    liked: !!r.likedByMe,
  }));

  return (
    <section className="w-full lg:w-[750px] h-[90vh] lg:h-[85vh] pt-10 pb-[86px] mx-auto max-w-[960px] px-6 text-main-white">
      <h1 className="text-main-white pt-14 text-2xl font-semibold mb-4 ">Post</h1>
      <span className="text-main-white text-end mb-4 ">작성한 글 : {total}개</span>
      <CommunityListHeader />

      {loading ? (
        <Loading mode="contents" />
      ) : (
        <ul className="mt-4 p-[1px] space-y-3 h-[80%] overflow-y-auto scrollbar-thin scrollbar-thumb-white/60 scrollbar-track-transparent">
          {listForUI.map((post) => (
            <ListItem
              key={post.id}
              post={post}
              onClick={(id) => handleClickList(String(id))}
              onLike={(id) => handleClickLike(String(id))}
            />
          ))}
          {listForUI.length === 0 && (
            <li className="text-white/60 py-6 text-center">
              <p>아직 작성한 글이 없어요.</p>
              <Link to={'/community'} className="underline p-1">
                커뮤니티에서 글을 작성해보세요
              </Link>
            </li>
          )}
        </ul>
      )}
    </section>
  );
}

export default Post;
