import { showAlert } from '@/common/utils/sweetalert';
import supabase from '../supabase/supabase';

export async function resetPassword(email: string) {
  try {
    const { error: resetPasswordError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/passwordReset`,
    });
    if (resetPasswordError) {
      showAlert('error', '이메일 검증 실패', resetPasswordError.message);
      return;
    }
    showAlert('success', '이메일 전송 완료!', '해당 이메일을 확인해 주세요.');
  } catch (error) {
    if (error instanceof Error) {
      showAlert('error', '이메일 검증 실패', error.message);
    } else if (typeof error === 'string') {
      showAlert('error', '이메일 검증 실패', error);
    }
  }
}

export async function updateUser(password: string) {
  try {
    const { error: updateUserError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateUserError) {
      showAlert('error', '비밀번호 재설정 실패', updateUserError.message);
      return;
    }
    return 'success';
  } catch (error) {
    if (error instanceof Error) {
      showAlert('error', '비밀번호 재설정 실패', error.message);
    } else if (typeof error === 'string') {
      showAlert('error', '비밀번호 재설정 실패', error);
    }
  }
}
