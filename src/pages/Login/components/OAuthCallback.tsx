import { insertProfile, selectProfileData } from '@/common/api/Profile/profile';
import supabase from '@/common/api/supabase/supabase';
import Loading from '@/common/components/Loading';
import { useAuth } from '@/common/store/authStore';
import { showAlert } from '@/common/utils/sweetalert';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

function OAuthCallback() {
  const setProvider = useAuth((state) => state.setProvider);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const currentProvider = urlParams.get('provider') as 'google' | 'github' | null;
    const from = urlParams.get('from') ?? '/';

    (async () => {
      const { data } = await supabase.auth.getSession(); // 이미 자동 감지되어 세션이 생김

      // 전역 상태 갱신
      setProvider(currentProvider);

      const userData = data.session?.user ?? '';
      if (!userData || typeof userData === 'string') {
        showAlert('error', '회원가입에 실패하였습니다', '다시 시도해주세요', () => {
          navigate('/auth/login');
        });
        return;
      }
      const userInfo = await selectProfileData(userData.id);
      //회원이 아닐경우 profile테이블에 insert
      if (!userInfo || userInfo.length === 0) insertProfile(userData.id);
      window.history.replaceState({}, '', '/');
      navigate(from, { replace: true });
    })();
  }, []);
  return <Loading message="로그인 시도 중..." />; // 스피너 등 아무거나
}
export default OAuthCallback;
