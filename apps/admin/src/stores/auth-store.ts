import { create } from 'zustand';
import { getCookie, setCookie, removeCookie } from '@/lib/cookies';
import { AuthApi } from '@/apis/auth.api';
import type { UserResponse, UserRequest, AuthToken, AuthenticationResponse } from '@/types';
import env from '@/config/env';

interface AuthState {
  auth: {
    user: UserResponse | null;
    token: AuthToken | null;
    setUser: (user: UserResponse | null) => void;
    setToken: (token: AuthToken | null) => void;
    refresh: () => Promise<boolean>;
    logout: () => Promise<boolean>;
    login: (identifier: string, password: string) => Promise<boolean>;
    register: (data: Partial<UserRequest>) => Promise<boolean>;
  };
}

export const useAuthStore = create<AuthState>()((set) => {
  const tokenCookie = getCookie(env.cookie.token);
  const userCookie = getCookie(env.cookie.user);

  let initToken = null;
  let initUser = null;

  try {
    if (tokenCookie && tokenCookie !== 'undefined') {
      initToken = JSON.parse(tokenCookie) as AuthToken;
    }
  } catch (_e) {
    // Ignore invalid cookie value
  }

  try {
    if (userCookie && userCookie !== 'undefined') {
      initUser = JSON.parse(userCookie) as UserResponse;
    }
  } catch (_e) {
    // Ignore invalid cookie value
  }


  return {
    auth: {
      user: initUser,
      token: initToken,
      setUser: (user) => set((state) => ({ ...state, auth: { ...state.auth, user } })),
      setToken: (token) =>
        set((state) => {
          if (token) {
            setCookie(env.cookie.token, JSON.stringify(token));
          } else {
            removeCookie(env.cookie.token);
          }
          return { ...state, auth: { ...state.auth, token } };
        }),
      refresh: async () => {
        const { token: currentToken } = useAuthStore.getState().auth;
        const response: AuthenticationResponse = await AuthApi.refresh(currentToken?.refreshToken ?? '');

        if (response?.token && response?.user) {
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
        const response: AuthenticationResponse = await AuthApi.login({ identifier, password });

        if (response?.token && response?.user) {
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