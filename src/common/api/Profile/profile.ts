import { showAlert } from '@/common/utils/sweetalert';
import supabase from '../supabase/supabase';

/**
 * profile 테이블 select 함수
 * @param id
 * @returns
 */
export async function selectProfile(id: string) {
  try {
    const { data: profileData, error: selectProfileError } = await supabase
      .from('profile')
      .select('*')
      .eq('id', id);
    if (selectProfileError) {
      showAlert('error', '회원조회실패', selectProfileError?.message);
      return;
    }
    if (!profileData) return;
    return profileData;
  } catch (error) {
    if (error instanceof Error) {
      showAlert('error', '회원조회실패', error.message);
    } else if (typeof error === 'string') {
      showAlert('error', '회원조회실패', error);
    }
  }
}

/**
 * profile 테이블 insert 함수
 * @param id
 * @returns
 */
export async function insertProfile(id: string): Promise<{ ok: boolean }> {
  try {
    const { error: insertProfileError } = await supabase.from('profile').insert({
      id,
    });
    if (insertProfileError) {
      showAlert('error', '회원등록 실패', insertProfileError?.message);
      return { ok: false };
    }
    return { ok: true };
  } catch (error) {
    if (error instanceof Error) {
      showAlert('error', '회원등록 실패', error.message);
    } else if (typeof error === 'string') {
      showAlert('error', '회원등록 실패', error);
    }
    return { ok: false };
  }
}
