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
      console.error('회원가입 실패!', signUpError?.message);
      return;
    }
  } catch (error) {
    console.error('회원가입에러', error);
  }
}
