import { create } from 'zustand';
import { getCookie, setCookie, removeCookie } from '@/lib/cookies';
import { AuthApi } from '@/apis/auth.api';
import type { User } from '@/types/schema';
import type { AuthToken } from '@/types/api';
import { TOKEN_COOKIE_KEY, USER_COOKIE_KEY } from '@/config/env';

interface AuthState {
  auth: {
    user: User | null;
    token: AuthToken | null;
    setUser: (user: User | null) => void;
    setToken: (token: AuthToken | null) => void;
    refresh: () => Promise<boolean>;
    logout: () => Promise<boolean>;
    login: (identifier: string, password: string) => Promise<boolean>;
    register: (data: Partial<User>) => Promise<boolean>;
  };
}

export const useAuthStore = create<AuthState>()((set) => {
  const tokenCookie = getCookie(TOKEN_COOKIE_KEY);
  const userCookie = getCookie(USER_COOKIE_KEY);
  const initToken = tokenCookie ? JSON.parse(tokenCookie) as AuthToken : null;
  const initUser = userCookie ? JSON.parse(userCookie) as User : null;
  return {
    auth: {
      user: initUser,
      token: initToken,
      setUser: (user) => set((state) => ({ ...state, auth: { ...state.auth, user } })),
      setToken: (token) =>
        set((state) => {
          setCookie(TOKEN_COOKIE_KEY, JSON.stringify(token));
          return { ...state, auth: { ...state.auth, token } };
        }),
      refresh: async () => {
        const response = await AuthApi.refresh(initToken?.refreshToken ?? '');
        if (response) {
          set((state) => ({
            ...state,
            auth: {
              ...state.auth,
              user: response.user,
              token: response.token,
            },
          }));
          setCookie(TOKEN_COOKIE_KEY, JSON.stringify(response.token));
          setCookie(USER_COOKIE_KEY, JSON.stringify(response.user));
          return true;
        }
        return false;
      },
      logout: async () => {
        const success = await AuthApi.logout();
        if (success) {
          set((state) => ({
            ...state,
            auth: {
              ...state.auth,
              user: null,
              token: null,
            },
          }));
          removeCookie(TOKEN_COOKIE_KEY);
          removeCookie(USER_COOKIE_KEY);
          return true;
        }
        return false;
      },
      login: async (identifier, password) => {
        const response = await AuthApi.login({ identifier, password });
        if (response) {
          set((state) => ({
            ...state,
            auth: {
              ...state.auth,
              user: response.user,
              token: response.token,
            },
          }));
          setCookie(TOKEN_COOKIE_KEY, JSON.stringify(response.token));
          setCookie(USER_COOKIE_KEY, JSON.stringify(response.user));
          return true;
        }
        return false;
      },
      register: async (data) => {
        const response = await AuthApi.register(data);
        if (response) {
          set((state) => ({
            ...state,
            auth: {
              ...state.auth,
              user: response.user,
              token: response.token,
            },
          }));
          setCookie(TOKEN_COOKIE_KEY, JSON.stringify(response.token));
          setCookie(USER_COOKIE_KEY, JSON.stringify(response.user));
          return true;
        }
        return false;
      },
    },
  };
});