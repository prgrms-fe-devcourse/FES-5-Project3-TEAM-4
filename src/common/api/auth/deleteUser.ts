import { showAlert } from '@/common/utils/sweetalert';
import supabase from '../supabase/supabase';

export async function deleteUser() {
  try {
    const { data, error: deleteError } = await supabase.functions.invoke('dynamic-worker', {
      method: 'POST',
    });
    if (deleteError) {
      showAlert('error', '회원탈퇴를 실패하였습니다', deleteError.message);
      return;
    }
    return data;
  } catch (error) {
    if (error instanceof Error) {
      showAlert('error', '회원탈퇴 실패', error.message);
    } else if (typeof error === 'string') {
      showAlert('error', '회원탈퇴 실패', error);
    }
  }
}
