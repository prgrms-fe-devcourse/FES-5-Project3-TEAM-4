import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router';
import { useAuth } from '../store/authStore';
import { useShallow } from 'zustand/shallow';
import { showAlert } from '../utils/sweetalert';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { userId, session, isReady } = useAuth(
    useShallow((state) => ({
      userId: state.userId,
      session: state.session,
      isReady: state.isReady,
    }))
  );

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isReady) return;
    if (!userId || !session) {
      //state: 로그인 성공 후 location.state.from
      //replace : 뒤로가기 방지
      //preventScrollReset : 스크롤 맨 위로 리셋하는 동작 차단
      showAlert('error', '로그인 후 이용하실 수 있습니다.', '로그인 후 다시 시도해주세요');
      navigate('/auth/login', {
        state: { from: location },
        replace: true,
        preventScrollReset: true,
      });
    }
  }, [userId, session, isReady]);

  if (!userId || !session) return null;
  return <>{children}</>;
}
export default RequireAuth;
