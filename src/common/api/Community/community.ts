import { showAlert } from '@/common/utils/sweetalert';
import supabase from '../supabase/supabase';
import type { Tables } from '../supabase/database.types';

/**
 * profile 테이블 전체 select 함수
 * @param id
 * @returns
 */
export async function selectCommunityList(
  sortedColumn: 'created_at' | 'likes',
  sorted: boolean = false
): Promise<Tables<'community'>[] | null> {
  try {
    const { data: communityListData, error: selectCommunityError } = await supabase
      .from('community')
      .select('*')
      .order(sortedColumn, { ascending: sorted });
    if (selectCommunityError) {
      console.error('selectCommunityList', selectCommunityError.message);
      showAlert('error', '게시글 조회 실패', selectCommunityError?.message);
      return null;
    }
    if (!communityListData) return null;
    return communityListData;
  } catch (error) {
    if (error instanceof Error) {
      showAlert('error', '게시글 조회 실패', error.message);
    } else if (typeof error === 'string') {
      showAlert('error', '게시글 조회 실패', error);
    }
    return null;
  }
}

/**
 * profile 테이블 select 함수 (profile_id)
 * @param id
 * @returns
 */
export async function selectCommunityListByUserId(
  profile_id: string,
  sortedColumn: 'created_at' | 'likes',
  sorted: boolean = false
): Promise<Tables<'community'>[] | null> {
  try {
    const { data: communityListData, error: selectCommunityError } = await supabase
      .from('community')
      .select('*')
      .eq('profile_id', profile_id)
      .order(sortedColumn, { ascending: sorted });
    if (selectCommunityError) {
      console.error('selectCommunityListByUserId', selectCommunityError.message);
      showAlert('error', '게시글 조회 실패', selectCommunityError?.message);
      return null;
    }
    if (!communityListData) return null;
    return communityListData;
  } catch (error) {
    if (error instanceof Error) {
      showAlert('error', '게시글 조회 실패', error.message);
    } else if (typeof error === 'string') {
      showAlert('error', '게시글 조회 실패', error);
    }
    return null;
  }
}
