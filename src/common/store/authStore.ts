import { create } from 'zustand';

//UserInfo 타입 정의
interface UserInfo {
  userId: string;
  provider: string;
}

//초기값 설정
const USER_ID_INIT: UserInfo = {
  userId: '',
  provider: 'email',
};

type AuthState = {
  userInfo: UserInfo;
  setUserInfo: (userInfo: UserInfo) => void;
  reset: () => void;
};

export const useAuth = create<AuthState>()((set, _get, store) => ({
  userInfo: USER_ID_INIT,
  setUserInfo: (userInfo) => set({ userInfo }),
  reset: () => set(store.getInitialState()),
}));
