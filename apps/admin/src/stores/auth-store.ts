import { create } from 'zustand';
import { getCookie, setCookie, removeCookie } from '@/lib/cookies';
import { AuthApi } from '@/apis/auth.api';
import type { User, UserRequest } from '@/types';
import type { AuthToken } from '@/types';
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
  } catch (e) {
    console.error('[AuthStore] Failed to parse token cookie:', e);
  }
  
  try {
    if (userCookie && userCookie !== 'undefined') {
      initUser = JSON.parse(userCookie) as User;
    }
  } catch (e) {
    console.error('[AuthStore] Failed to parse user cookie:', e);
  }

  console.log('[AuthStore] Initializing store:', { 
    hasTokenCookie: !!tokenCookie, 
    tokenContent: tokenCookie,
    hasUserCookie: !!userCookie,
    initToken 
  });

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
        const response: any = await AuthApi.refresh(currentToken?.refreshToken ?? '');
        
        const token = response?.token || (response?.accessToken ? {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        } : null);

        if (response && token) {
          set((state) => ({
            ...state,
            auth: {
              ...state.auth,
              user: response.user,
              token: token,
            },
          }));
          setCookie(env.cookie.token, JSON.stringify(token));
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
        const response: any = await AuthApi.login({ identifier, password });
        console.log('[AuthStore] Login response:', response);
        
        // Map top-level tokens to token object if missing
        const token = response?.token || (response?.accessToken ? {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        } : null);

        if (response && token) {
          const authData = {
            user: response.user,
            token: token,
          };
          
          set((state) => ({
            ...state,
            auth: {
              ...state.auth,
              ...authData,
            },
          }));
          
          setCookie(env.cookie.token, JSON.stringify(token));
          setCookie(env.cookie.user, JSON.stringify(response.user));
          return true;
        }
        
        if (response && !token) {
          console.error('[AuthStore] Login response missing token structure!', response);
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