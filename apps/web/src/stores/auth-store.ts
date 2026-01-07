import { create } from 'zustand';
import { getCookie, setCookie, removeCookie } from '@/lib/cookies';
import { AuthApi } from '@/apis/auth.api';
import type { User } from '@/types/schema';
import type { AuthToken } from '@/types/api';
import env from '@/config/env';

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
  const tokenCookie = getCookie(env.cookie.token);
  const userCookie = getCookie(env.cookie.user);
  const initToken = tokenCookie ? JSON.parse(tokenCookie) as AuthToken : null;
  const initUser = userCookie ? JSON.parse(userCookie) as User : null;
  return {
    auth: {
      user: initUser,
      token: initToken,
      setUser: (user) => set((state) => ({ ...state, auth: { ...state.auth, user } })),
      setToken: (token) =>
        set((state) => {
          setCookie(env.cookie.token, JSON.stringify(token));
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
          setCookie(env.cookie.token, JSON.stringify(response.token));
          setCookie(env.cookie.user, JSON.stringify(response.user));
          return true;
        }
        return false;
      },
      logout: async () => {
        set((state) => ({
          ...state,
          auth: {
            ...state.auth,
            user: null,
            token: null,
          },
        }));
        removeCookie(env.cookie.token);
        removeCookie(env.cookie.user);
        return true;
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
          setCookie(env.cookie.token, JSON.stringify(response.token));
          setCookie(env.cookie.user, JSON.stringify(response.user));
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
          setCookie(env.cookie.token, JSON.stringify(response.token));
          setCookie(env.cookie.user, JSON.stringify(response.user));
          return true;
        }
        return false;
      },
    },
  };
});