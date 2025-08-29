import supabase from '../supabase/supabase';

export type SortKey = 'new' | 'old' | 'like-desc' | 'like-asc';

export interface Post {
  id: number | string;
  created_at: string;
  title: string;
  likes: number;
}

type GetListParams = {
  page: number; // 1-base
  pageSize: number; // 상수 가능
  sort: SortKey;
  q?: string; // 검색어(옵션)
};

export async function getPostList({ page, pageSize, sort, q }: GetListParams) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // 기본 쿼리
  let query = supabase
    .from('community')
    .select('id, created_at, title, likes', { count: 'exact' }) // count 포함
    .range(from, to);

  // 정렬
  if (sort === 'new') query = query.order('created_at', { ascending: false });
  if (sort === 'old') query = query.order('created_at', { ascending: true });
  if (sort === 'like-desc') query = query.order('likes', { ascending: false });
  if (sort === 'like-asc') query = query.order('likes', { ascending: true });

  // 검색(제목 기준 예시)
  if (q && q.trim()) {
    query = query.ilike('title', `%${q.trim()}%`);
  }

  const { data, count, error } = await query;
  if (error) throw error;

  return {
    items: (data ?? []) as Post[],
    total: count ?? 0,
  };
}
