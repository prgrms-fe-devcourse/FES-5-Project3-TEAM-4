import { Link } from 'react-router';
import { ListItem, type Post } from '@/common/components/ListItem';
import { SearchInput } from '@/common/components/SearchInput';
import { SortBar, type SortKey } from './components/SortBar';
import { useEffect, useMemo, useState } from 'react';
import { ListHeader } from './components/ListHeader';
import Pagination from './components/Pagination';
import { getPostList } from '@/common/api/post/postList';

const PAGE_SIZE = 10; // 고정

export default function Community() {
  // 페이지네이션 상태
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortKey>('new');
  const [q, setQ] = useState('');
  const [items, setItems] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchList = async () => {
    setLoading(true);
    try {
      // TODO: 공통 api 사용
      const { items, total } = await getPostList({ page, pageSize: PAGE_SIZE, sort, q });
      setItems(items);
      setTotal(total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [page, sort, q]); // 페이지/정렬/검색어 변경 시 재요청

  const handleSearch = (value?: string) => {
    setQ(value ?? q);
    setPage(1); // 검색/정렬 변경 시 1페이지로
  };

  const handleClickList = (id: number | string) => console.log('게시글 클릭: ', id);
  const handleClickLike = (id: number | string) => console.log('좋아요 클릭: ', id);

  return (
    <>
      {/* 검색 */}
      <SearchInput
        placeholder="검색어를 입력해주세요"
        onChange={(e) => setQ(e.currentTarget.value)}
        onSearch={() => handleSearch()}
      />

      {/* 정렬 */}
      <SortBar
        value={sort}
        onChange={(s) => {
          setSort(s);
          setPage(1);
        }}
      />

      {/* 헤더 */}
      <ListHeader />

      {/* 리스트 */}
      {loading ? (
        <div className="mt-6 text-white/70">로딩 중…</div>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((post) => (
            <ListItem
              key={post.id}
              post={{
                id: post.id,
                date: post.create_at.slice(0, 10),
                title: post.title,
                likes: post.likes,
              }}
              onClick={(id) => handleClickList(id)}
              onLike={(id) => handleClickLike(id)}
            />
          ))}
          {items.length === 0 && <li className="text-white/60">검색 결과가 없습니다.</li>}
        </ul>
      )}

      {/* 페이지네이션 + 글쓰기 */}
      <div className="relative mt-8">
        <Pagination total={total} page={page} pageSize={PAGE_SIZE} onPageChange={setPage} />

        {/* 글쓰기 버튼 */}
        <Link
          to="/community/write"
          className="absolute right-0 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-transparent border border-white/40 
             text-white text-sm hover:border-white hover:bg-white/10 active:shadow-[0_0_8px_white] cursor-pointer"
        >
          글쓰기
        </Link>
      </div>
    </>
  );
}
