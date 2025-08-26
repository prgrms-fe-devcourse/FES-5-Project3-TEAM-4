import { useAuth } from '@/common/store/authStore';
import supabase from '../supabase/supabase';
import type { Provider } from '@supabase/supabase-js';

export async function login(email: string, password: string) {
  try {
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (loginError) {
      console.error('로그인 실패!', loginError.message);
      return;
    }
    if (data) {
      return data.user;
    }
  } catch (error) {
    console.error('로그인 중 에러 발생', error);
    return;
  }
}

export async function loginWithOAuth(provider: Provider) {
  await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback?provider=${provider}`,
      scopes: 'openid email profile',
      // refresh token이 필요하면:
      queryParams: { access_type: 'offline', prompt: 'consent' },
    },
  });
}

export async function logout() {
  try {
    const reset = useAuth((state) => state.reset);

    await supabase.auth.signOut();
    reset();
  } catch (error) {
    console.error('로그아웃 에러');
  }
}
