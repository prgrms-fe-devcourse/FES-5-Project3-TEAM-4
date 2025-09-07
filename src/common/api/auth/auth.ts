import supabase from '@/common/api/supabase/supabase';
import { showAlert } from '@/common/utils/sweetalert';
import type { User } from '@supabase/supabase-js';

export async function getAuthedUser(): Promise<User | null> {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;
    if (!user) throw new Error('로그인이 필요합니다.');

    return user;
  } catch (error) {
    if (error instanceof Error) {
      showAlert('error', '로그인 확인 중 오류 발생', error.message);
    } else if (typeof error === 'string') {
      showAlert('error', '로그인 확인 중 오류 발생', error);
    }
    return null;
  }
}
