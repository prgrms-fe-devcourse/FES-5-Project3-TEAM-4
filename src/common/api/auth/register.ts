import { showAlert } from '@/common/utils/sweetalert';
import supabase from '../supabase/supabase';
/**
 * 회원가입 함수
 * @param email
 * @param password
 * @returns
 */
export async function registUser(email: string, password: string) {
  try {
    const {
      data: { user },
      error: signUpError,
    } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError || !user) {
      showAlert('error', '회원가입 실패', signUpError?.message);
      return;
    }
    return user;
  } catch (error) {
    if (error instanceof Error) {
      showAlert('error', '회원가입 실패', error.message);
    } else if (typeof error === 'string') {
      showAlert('error', '회원가입 실패', error);
    }
  }
}
