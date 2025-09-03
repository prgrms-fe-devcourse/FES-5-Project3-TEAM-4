import { loginWithOAuth } from '@/common/api/auth/login';
import type { Provider } from '@supabase/supabase-js';

function OAuthButton() {
  const handleOAuthLogin = (provider: Provider) => {
    loginWithOAuth(provider);
  };
  const button =
    'flex gap-2 justify-center items-center w-[90%] md:w-83 h-8 text-sm rounded-2xl cursor-pointer';
  return (
    <div className="flex flex-col gap-2 w-full items-center">
      <button
        type="button"
        className={`${button} bg-main-white`}
        onClick={() => handleOAuthLogin('google')}
      >
        <img src="/icons/google.svg" alt="구글 아이콘" />
        Sign in with Google
      </button>
      <button
        type="button"
        className={`${button} bg-main-black text-main-white`}
        onClick={() => handleOAuthLogin('github')}
      >
        <img src="/icons/github.svg" alt="깃허브 아이콘" /> Sign in with Github
      </button>
    </div>
  );
}
export default OAuthButton;
