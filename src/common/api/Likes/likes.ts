import { showAlert } from '@/common/utils/sweetalert';
import supabase from '../supabase/supabase';
import type { Tables } from '../supabase/database.types';

/**
 * like join community 테이블 select 함수
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
