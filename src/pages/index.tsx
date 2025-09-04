import { selectCardsInfo } from '@/common/api/Card/card';
import supabase from '@/common/api/supabase/supabase';
import Footer from '@/common/layouts/Footer';
import Header from '@/common/layouts/Header';
import { useAuth } from '@/common/store/authStore';
import { useCardInfo } from '@/common/store/cardStore';
import { useEffect } from 'react';
import { Outlet } from 'react-router';
import { useShallow } from 'zustand/shallow';

function Root() {
  const setFromSession = useAuth((s) => s.setFromSession);
  const { setCards, initialized } = useCardInfo(
    useShallow((state) => ({ setCards: state.setCards, initialized: state.initialized }))
  );
  useEffect(() => {
    if (initialized) return;
    const getCardInfo = async () => {
      const cardList = await selectCardsInfo();
      if (!cardList) return;
      setCards(cardList);
    };
    getCardInfo();
  }, []);

  useEffect(() => {
    // 1) 첫 세션 로드
    supabase.auth.getSession().then(({ data }) => setFromSession(data.session ?? null));

    // 2) 세션 변경 구독 (로그인/로그아웃/토큰갱신/탭 간 동기화 포함)
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setFromSession(session ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, [setFromSession]);

  return (
    <div>
      <Header />

      <main>
        <Outlet></Outlet>
      </main>

      <Footer />
    </div>
  );
}
export default Root;
