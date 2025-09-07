import { useNavigate } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import { CommunityListHeader } from './components/index/CommunityListHeader';
import { CommunityToolbar } from './components/index/CommunityToolbar';
import { CommunityListView } from './components/index/CommunityListView';
import { CommunityFooter } from './components/index/CommunityFooter';
import type { SortKey } from './components/index/SortBar';
import type { CommunityRowUI, CommunitySortKey } from '@/common/types/community';
import { formatDate } from '@/common/utils/format';
import { debounce } from '@/common/utils/debounce';
import { useToggleLike } from '@/common/hooks/useToggleLike';
import type { Post } from '@/common/components/ListItem';
import { fetchCommunityPageWithLiked } from './components/index/service';

const PAGE_SIZE = 10;
const sortMap: Record<SortKey, { column: CommunitySortKey; ascending: boolean }> = {
  new: { column: 'created_at', ascending: false },
  old: { column: 'created_at', ascending: true },
  'like-desc': { column: 'likes', ascending: false },
  'like-asc': { column: 'likes', ascending: true },
};

export default function Community() {
  const navigate = useNavigate();

  const { toggleLike } = useToggleLike();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortKey>('new');
  const [inputValue, setInputValue] = useState('');
  const [keyword, setKeyword] = useState('');
  const [rows, setRows] = useState<CommunityRowUI[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const debouncedSetKeyword = useMemo(
    () =>
      debounce((v: string) => {
        setKeyword(v);
        setPage(1);
      }, 400),
    []
  );

  const listForUI: Post[] = useMemo(
    () =>
      rows.map((r) => ({
        id: r.id,
        date: formatDate(r.created_at ?? ''),
        title: r.title ?? '',
        likes: r.likes ?? 0,
        liked: !!r.likedByMe,
      })),
    [rows]
  );

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      try {
        const { column, ascending } = sortMap[sort];
        const { items, total } = await fetchCommunityPageWithLiked({
          sort: { column, ascending },
          page,
          pageSize: PAGE_SIZE,
          keyword,
        });

        if (!alive) return;
        setRows(items);
        setTotal(total);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [page, sort, keyword]);

  const handleClickLike = async (communityId: string) => {
    const next = await toggleLike(communityId);
    if (!next) return;
    setRows((prev) =>
      prev.map((r) =>
        r.id === communityId ? { ...r, likes: next.count, likedByMe: next.liked } : r
      )
    );
  };

  return (
    <>
      <CommunityToolbar
        inputValue={inputValue}
        onInputChange={(v) => {
          setInputValue(v);
          debouncedSetKeyword(v);
        }}
        sort={sort}
        onSortChange={(s) => {
          setSort(s);
          setPage(1);
        }}
      />

      <CommunityListHeader />

      <CommunityListView
        posts={listForUI}
        loading={loading}
        onClick={(id) => {
          const row = rows.find((r) => r.id === id);
          navigate(`/community/${id}`, { state: { row } });
        }}
        onLike={handleClickLike}
      />

      <CommunityFooter
        total={total}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        onClickWrite={() => navigate('/community/write')}
      />
    </>
  );
}
