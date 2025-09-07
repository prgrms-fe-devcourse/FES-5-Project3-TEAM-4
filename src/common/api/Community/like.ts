import supabase from '@/common/api/supabase/supabase';
import { showAlert } from '@/common/utils/sweetalert';
import type { Tables } from '../supabase/database.types';

export type ToggleLikeResult = {
  count: number;
  liked: boolean;
};

/** 좋아요 토글: 인증 확인 + RPC 호출 + 결과 정규화
 * = 개별 게시글의 좋아요 상태를 변경
 */
export async function toggleLike(communityId: string): Promise<ToggleLikeResult> {
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !user) {
    throw new Error('로그인이 필요합니다.');
  }

  const { data, error } = await supabase.rpc('toggle_like', { p_community_id: communityId });
  if (error) throw error;

  const payload = data?.[0];
  return {
    liked: Boolean(payload?.liked),
    count: Number(payload?.likes_count ?? 0),
  };
}

/**
 * 내가 좋아요한 게시글들 전체를 조회 + 게시글 전체 정보
 * @param id
 * @returns
 */
export async function selectLikeListWithCommunity(
  profile_id: string
): Promise<(Tables<'likes'> & { community: Tables<'community'> })[] | null> {
  try {
    const { data: LikeListData, error: selectLikeError } = await supabase
      .from('likes')
      .select('*,community(*)')
      .eq('profile_id', profile_id);
    if (selectLikeError) {
      showAlert('error', '글 조회 실패', selectLikeError?.message);
      return null;
    }
    if (!LikeListData) return null;
    return LikeListData;
  } catch (error) {
    if (error instanceof Error) {
      showAlert('error', '글 조회 실패', error.message);
    } else if (typeof error === 'string') {
      showAlert('error', '글 조회 실패', error);
    }
    return null;
  }
}

/** 주어진 글 ID들 중, 내가 좋아요한 community_id 목록만 반환 */
export async function selectMyLikedCommunityId(
  userId: string,
  communityIds: string[]
): Promise<Set<string>> {
  try {
    if (!userId || communityIds.length === 0) return new Set();

    const { data, error } = await supabase
      .from('likes')
      .select('community_id')
      .eq('profile_id', userId)
      .in('community_id', communityIds);

    if (error) throw error;

    return new Set((data ?? []).map((r) => r.community_id as string));
  } catch (err) {
    if (err instanceof Error) {
      showAlert('error', '좋아요 조회 실패', err.message);
    } else if (typeof err === 'string') {
      showAlert('error', '좋아요 조회 실패', err);
    }
    return new Set();
  }
}
