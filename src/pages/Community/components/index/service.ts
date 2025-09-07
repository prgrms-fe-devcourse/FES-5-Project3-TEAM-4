import supabase from '@/common/api/supabase/supabase';
import { selectCommunityList } from '@/common/api/Community/community';
import type { CommunityRowUI, CommunitySortKey } from '@/common/types/community';
import { selectMyLikedCommunityId } from '@/common/api/Community/like';

type FetchParams = {
  sort: { column: CommunitySortKey; ascending: boolean };
  page: number;
  pageSize: number;
  keyword: string;
};

export async function fetchCommunityPageWithLiked({
  sort,
  page,
  pageSize,
  keyword,
}: FetchParams): Promise<{ items: CommunityRowUI[]; total: number }> {
  const { items, total } = await selectCommunityList(sort.column, sort.ascending, {
    page,
    pageSize,
    keyword,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || items.length === 0) {
    return { items: items.map((i) => ({ ...i, likedByMe: false })), total };
  }

  const likedSet = await selectMyLikedCommunityId(
    user.id,
    items.map((i) => i.id)
  );

  return {
    items: items.map((i) => ({ ...i, likedByMe: likedSet.has(i.id) })),
    total,
  };
}
