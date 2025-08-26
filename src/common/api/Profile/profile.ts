import supabase from '../supabase/supabase';

/**
 * profile 테이블 insert 함수
 * @param id
 * @returns
 */
export async function insertProfile(id: string): Promise<{ ok: boolean }> {
  try {
    const { error: insertProfileError } = await supabase.from('profile').insert({
      id,
      provider: 'email',
    });
    if (insertProfileError) {
      console.error('profile insert 실패!', insertProfileError?.message);
      return { ok: false };
    }
    return { ok: true };
  } catch (error) {
    console.error('insertProfile 에러 ', error);
    return { ok: false };
  }
}
