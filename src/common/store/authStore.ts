import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { type Session } from '@supabase/supabase-js'; // 이미 래핑해둔 supabase 클라이언트를 import 하세요.

type Provider = 'email' | 'google' | 'github';

type AuthState = {
  isReady: boolean; // 초기 세션 로딩 완료 여부
  userId: string | null;
  provider: Provider | null;
  session: Session | null;
  setFromSession: (s: Session | null) => void;
  setProvider: (provider: Provider | null) => void;
  reset: () => void;
};

export const useAuth = create<AuthState>()(
  devtools((set) => ({
    isReady: false,
    userId: null,
    provider: null,
    session: null,
    setFromSession: (session) => {
      const user = session?.user ?? null;
      set({
        session,
        userId: user?.id ?? null,
        isReady: true,
      });
    },
    setProvider: (provider: Provider) => {
      const providerValue = provider ?? null;
      set({
        provider: providerValue,
      });
    },
    reset: () =>
      set({
        isReady: true,
        userId: null,
        provider: null,
        session: null,
      }),
  }))
);
