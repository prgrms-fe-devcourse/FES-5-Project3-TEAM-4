import { create } from 'zustand';
import type { Tables } from '../api/supabase/database.types';
import { useShallow } from 'zustand/shallow';
import { createJSONStorage, persist } from 'zustand/middleware';
import CardBackUrl from '@/assets/Tarot/tarot_back.svg?url';

type CardsState = {
  cardList: Tables<'card'>[];
  initialized: boolean;
  setCards: (cardsList: Tables<'card'>[]) => void;
  reset: () => void;
};

export const useCardInfo = create<CardsState>()(
  persist(
    (set, _get, store) => ({
      cardList: [],
      initialized: false,
      setCards: (cards) => set({ cardList: cards, initialized: true }),
      reset: () => set(store.getInitialState()),
    }),
    {
      name: 'card-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ cardList: s.cardList, initialized: s.initialized }),
      version: 1,
    }
  )
);

export const useFilterArcana = (arcana: string | null) => {
  if (!arcana) return [{ name: '이미지 없음', arcana: '이미지 없음', image_url: CardBackUrl }];
  const cardInfo = useCardInfo(
    useShallow((card) => card.cardList.filter((c) => c.arcana === arcana))
  );
  if (cardInfo.length === 0) {
    return [{ name: '이미지 없음', arcana: '이미지 없음', image_url: CardBackUrl }];
  }
  return cardInfo;
};

export const useFilterCardName = (cardName: string | null) => {
  if (!cardName) return [{ name: '이미지 없음', arcana: '이미지 없음', image_url: CardBackUrl }];
  const cardInfo = useCardInfo(
    useShallow((card) => card.cardList.filter((c) => c.name === cardName))
  );
  if (cardInfo.length === 0) {
    return [{ name: '이미지 없음', arcana: '이미지 없음', image_url: CardBackUrl }];
  }
  return cardInfo;
};
