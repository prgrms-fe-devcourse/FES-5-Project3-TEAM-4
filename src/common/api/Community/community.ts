import { showAlert } from '@/common/utils/sweetalert';
import type {
  CommunityOptions,
  CommunityRow,
  CommunitySortKey,
  ListResult,
} from '@/common/types/community';
import supabase from '../supabase/supabase';

/**
 * community 테이블 select 내부 공통 실행 함수
 * - 정렬, 페이지네이션, 검색 적용
 */
async function runCommunitySelect(
  sortedColumn: CommunitySortKey,
  ascending: boolean,
  options?: CommunityOptions,
  filter?: { profileId?: string }
): Promise<ListResult<CommunityRow>> {
  const { page, pageSize, keyword } = options ?? {};
  const usePaging = Boolean(page && pageSize);

  try {
    let query = supabase
      .from('community')
      .select('*', { count: 'exact' })
      .order(sortedColumn, { ascending });

    // 특정 유저 필터
    if (filter?.profileId) {
      query = query.eq('profile_id', filter.profileId);
    }

    // 검색
    if (keyword && keyword.trim()) {
      const k = keyword.trim();
      query = query.or(`title.ilike.%${k}%,contents.ilike.%${k}%`);
    }

    // 페이지네이션
    if (usePaging) {
      const from = (page! - 1) * pageSize!;
      const to = from + pageSize! - 1;
      query = query.range(from, to);
    }

    const { data, count, error } = await query;
    if (error) throw error;

    return { items: (data ?? []) as CommunityRow[], total: count ?? 0 };
  } catch (err) {
    showAlert('error', '게시글 조회 실패', (err as Error).message);

    return { items: [], total: 0 };
  }
}

/**
 * community 테이블 전체 select 함수
 */
export function selectCommunityList(
  sortedColumn: CommunitySortKey,
  ascending = false,
  options?: CommunityOptions
) {
  return runCommunitySelect(sortedColumn, ascending, options);
}

/**
 * community 테이블 select 함수
 * 특정 유저 기준 (profile_id)
 */
export function selectCommunityListByUserId(
  profile_id: string,
  sortedColumn: CommunitySortKey,
  ascending = false,
  options?: CommunityOptions
) {
  return runCommunitySelect(sortedColumn, ascending, options, { profileId: profile_id });
}

/**
 * community 테이블 select 함수
 * 검색 전용 (keyword)
 */
export function selectCommunityListWithKeyword(
  keyword: string,
  sortedColumn: CommunitySortKey,
  ascending = false,
  options?: CommunityOptions
) {
  return runCommunitySelect(sortedColumn, ascending, { ...options, keyword });
}

/**
 * community 테이블 단건 조회 (id 기준)
 * @param id community.id
 * @returns CommunityRow | null
 */
export async function selectCommunityById(id: string): Promise<CommunityRow | null> {
  try {
    const { data, error } = await supabase.from('community').select('*').eq('id', id).single();
    if (error) throw error;

    return (data ?? null) as CommunityRow | null;
  } catch (err) {
    showAlert('error', '게시글 조회 실패', (err as Error).message);

    return null;
  }
}
