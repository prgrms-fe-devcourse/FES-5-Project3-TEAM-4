import { showAlert } from '@/common/utils/sweetalert';
import supabase from '../supabase/supabase';
import type { Provider } from '@supabase/supabase-js';

export async function login(email: string, password: string) {
  try {
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      showAlert('error', '로그인 실패', loginError.message);
      return;
    }
    if (data) {
      return data.user;
    }
  } catch (error) {
    if (error instanceof Error) {
      showAlert('error', '로그인 실패', error.message);
    } else if (typeof error === 'string') {
      showAlert('error', '로그인 실패', error);
    }
  }
}

export async function loginWithOAuth(provider: Provider) {
  try {
    await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?provider=${provider}`,
        scopes: 'openid email profile',
        // refresh token이 필요하면:
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      showAlert('error', `${provider} 로그인 요청 실패`, error.message);
    } else if (typeof error === 'string') {
      showAlert('error', `${provider} 로그인 요청 실패`, error);
    }
  }
}

export async function logout() {
  try {
    await supabase.auth.signOut({ scope: 'global' });
  } catch (error) {
    if (error instanceof Error) {
      showAlert('error', '로그아웃 실패', error.message);
    } else if (typeof error === 'string') {
      showAlert('error', '로그아웃 실패', error);
    }
  }
}
