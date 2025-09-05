import supabase from '@/common/api/supabase/supabase';

export async function getAuthedUserOrThrow() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  if (!user) throw new Error('로그인이 필요합니다.');
  return user;
}
