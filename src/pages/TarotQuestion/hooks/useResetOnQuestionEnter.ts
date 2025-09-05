import { useEffect } from 'react';
import { tarotStore } from '@/pages/Tarot/store/tarotStore';

export default function useResetOnQuestionEnter() {
  useEffect(() => {
    sessionStorage.removeItem('tarot:justReloaded');
    tarotStore.getState().clearAll();
  }, []);
}
