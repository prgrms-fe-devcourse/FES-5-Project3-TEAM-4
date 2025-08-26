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
      console.error('profile select 실패!', selectProfileError?.message);
      return;
    }
    if (!profileData) return;
    return profileData;
  } catch (error) {
    console.error('selectProfile 에러 ', error);
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
      console.error('profile insert 실패!', insertProfileError?.message);
      return { ok: false };
    }
    return { ok: true };
  } catch (error) {
    console.error('insertProfile 에러 ', error);
    return { ok: false };
  }
}
