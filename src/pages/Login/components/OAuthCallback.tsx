import { insertProfile, selectProfile } from '@/common/api/Profile/profile';
import supabase from '@/common/api/supabase/supabase';
import { useAuth } from '@/common/store/authStore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/shallow';

function OAuthCallback() {
  const { setUserInfo, reset } = useAuth(
    useShallow((state) => ({
      setUserInfo: state.setUserInfo,
      reset: state.reset,
      userInfo: state.userInfo,
    }))
  );
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase가 URL 해시/코드를 자동 파싱해 세션 저장 (detectSessionInUrl: true)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
        const currentProvider = new URLSearchParams(location.search).get('provider') as
          | 'google'
          | 'github'
          | null;
        // 전역 상태 갱신
        setUserInfo({
          userId: session.user.id,
          provider: (currentProvider ?? 'email') as 'email' | 'github' | 'google',
        });

        const userInfo = await selectProfile(session.user.id);
        //회원이 아닐경우 profile테이블에 insert
        if (!userInfo || userInfo.length === 0) insertProfile(session.user.id);

        // URL에서 #access_token / ?code 흔적 제거
        window.history.replaceState({}, '', '/');
        navigate('/', { replace: true });
      } else if (event === 'SIGNED_OUT') {
        window.history.replaceState({}, '', '/auth/login');
        reset();
        navigate('/auth/login', { replace: true });
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  return <div>로그인 처리 중…</div>; // 스피너 등 아무거나
}
export default OAuthCallback;
