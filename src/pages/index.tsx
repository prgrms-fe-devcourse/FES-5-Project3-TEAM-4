import { selectCardsInfo } from '@/common/api/Card/card';
import Footer from '@/common/layouts/Footer';
import Header from '@/common/layouts/Header';
import { useCardInfo } from '@/common/store/cardStore';
import { useEffect } from 'react';
import { Outlet } from 'react-router';
import { useShallow } from 'zustand/shallow';

function Root() {
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
