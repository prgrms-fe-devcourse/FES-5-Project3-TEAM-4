import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

import { ListItem, type Post } from '@/common/components/ListItem';
import { SearchInput } from '@/common/components/SearchInput';
import { SortBar, type SortKey } from './components/SortBar';
import { ListHeader } from './components/ListHeader';
import Pagination from './components/Pagination';

import { selectCommunityList } from '@/common/api/Community/community';
import type { CommunityRowUI, CommunitySortKey } from '@/common/types/community';
import { formatDate } from '@/common/utils/format';
import supabase from '@/common/api/supabase/supabase';
import { showAlert } from '@/common/utils/sweetalert';
import AuthOnlyButton from '@/common/components/AuthOnlyButton';
import { toggleLike } from '@/common/api/Community/like';

const PAGE_SIZE = 10;

const sortMap: Record<SortKey, { column: CommunitySortKey; ascending: boolean }> = {
  new: { column: 'created_at', ascending: false },
  old: { column: 'created_at', ascending: true },
  'like-desc': { column: 'likes', ascending: false },
  'like-asc': { column: 'likes', ascending: true },
};

export default function Community() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortKey>('new');
  const [q, setQ] = useState('');
  const [rows, setRows] = useState<CommunityRowUI[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [likingId, setLikingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      try {
        const { column, ascending } = sortMap[sort];
        const { items, total } = await selectCommunityList(column, ascending, {
          page,
          pageSize: PAGE_SIZE,
          keyword: q,
        });

        // 로그인 유저 가져오기
        const {
          data: { user },
        } = await supabase.auth.getUser();

        let likedSet = new Set<string>();
        if (user && items.length) {
          // 내가 좋아요한 community_id만 뽑기
          const { data: likedRows } = await supabase
            .from('likes')
            .select('community_id')
            .eq('profile_id', user.id)
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
  }, [page, sort, q]);

  const handleSearch = (value?: string) => {
    setQ((value ?? q).trim());
    setPage(1);
  };

  const handleClickList = (id: string) => {
    const row = rows.find((r) => r.id === id);

    navigate(`/community/${id}`, { state: { row } });
  };

  const handleClickLike = async (communityId: string) => {
    // 중복 클릭 방지
    if (likingId === communityId) return;
    setLikingId(communityId);

    try {
      const next = await toggleLike(communityId);
      setRows((prev) =>
        prev.map((r) =>
          r.id === communityId ? { ...r, likes: next.count, likedByMe: next.liked } : r
        )
      );
    } catch (e: unknown) {
      showAlert(
        'error',
        '좋아요 에러',
        e instanceof Error ? e.message : '좋아요 처리 중 오류가 발생했어요.'
      );
    } finally {
      setLikingId(null);
    }
  };

  // UI에 필요한 형태로만 매핑해서 ListItem에 넘김
  // UI에 필요한 형태
  const listForUI: Post[] = rows.map((r) => ({
    id: r.id,
    date: formatDate(r.created_at),
    title: r.title ?? '',
    likes: r.likes ?? 0,
    liked: !!r.likedByMe,
  }));

  return (
    <>
      <SearchInput
        placeholder="검색어를 입력해주세요"
        onChange={(e) => setQ(e.currentTarget.value)}
        onSearch={() => handleSearch()}
      />

      <SortBar
        value={sort}
        onChange={(s) => {
          setSort(s);
          setPage(1);
        }}
      />

      <ListHeader />

      {loading ? (
        <div className="mt-6 text-white/70">로딩 중…</div>
      ) : (
        <ul className="mt-4 space-y-3">
          {listForUI.map((post) => (
            <ListItem
              key={post.id}
              post={post}
              onClick={(id) => handleClickList(String(id))}
              onLike={(id) => handleClickLike(String(id))}
            />
          ))}
          {listForUI.length === 0 && (
            <li className="text-white/60 py-6 text-center">검색 결과가 없습니다.</li>
          )}
        </ul>
      )}

      <div className="relative mt-8">
        <Pagination total={total} page={page} pageSize={PAGE_SIZE} onPageChange={setPage} />

        <AuthOnlyButton
          variant="ghost"
          size="md"
          className="absolute right-0 top-1/2 -translate-y-1/2"
          onAuthed={() => navigate('/community/write')}
        >
          글쓰기
        </AuthOnlyButton>
      </div>
    </>
  );
}
