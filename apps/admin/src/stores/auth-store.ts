import { AuthApi } from '@/apis/auth.api';
import env from '@/config/env';
import type { UserResponse, UserRequest, TokenResponse } from '@/types';
import { create } from 'zustand';
import { getCookie, setCookie, removeCookie } from '@/lib/cookies';

export interface AuthState {
  auth: {
    user: UserResponse | null;
    token: TokenResponse | null;
    setUser: (user: UserResponse | null) => void;
    setToken: (token: TokenResponse | null) => void;
    refresh: () => Promise<boolean>;
    logout: () => Promise<boolean>;
    login: (email: string, password: string) => Promise<boolean>;
    register: (data: Partial<UserRequest>) => Promise<boolean>;
  };
}

export const useAuthStore = create<AuthState>()((set) => {
  const tokenCookie = getCookie(env.cookie.token);
  const userCookie = getCookie(env.cookie.user);

  let initToken: TokenResponse | null = null;
  let initUser: UserResponse | null = null;

  try {
    if (tokenCookie && tokenCookie !== 'undefined') {
      initToken = JSON.parse(tokenCookie) as TokenResponse;
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

  let refreshPromise: Promise<boolean> | null = null;

  /**
   * Updates the authentication state and synchronizes with cookies.
   * Removes refreshToken from the token object before storing it in a non-HttpOnly cookie for security.
   * @param user The user profile data
   * @param token The authentication tokens
   */
  const setAuthData = (user: UserResponse | null, token: TokenResponse | null) => {
    set((state) => ({
      ...state,
      auth: {
        ...state.auth,
        user,
        token,
      },
    }));

    if (user && token) {
      const { refreshToken: _, ...tokenToStore } = token;
      setCookie(env.cookie.token, JSON.stringify(tokenToStore));
      setCookie(env.cookie.user, JSON.stringify(user));
    } else {
      removeCookie(env.cookie.token);
      removeCookie(env.cookie.user);
    }
  };

  return {
    auth: {
      user: initUser,
      token: initToken,
      setUser: (user) => set((state) => ({ ...state, auth: { ...state.auth, user } })),
      setToken: (token) => {
        if (token) {
          const { refreshToken: _, ...tokenToStore } = token;
          setCookie(env.cookie.token, JSON.stringify(tokenToStore));
        } else {
          removeCookie(env.cookie.token);
        }
        set((state) => ({ ...state, auth: { ...state.auth, token } }));
      },
      refresh: async () => {
        if (refreshPromise) {
          return refreshPromise;
        }

        refreshPromise = (async () => {
          try {
            const response = await AuthApi.refresh();
            if (response.data) {
              setAuthData(response.data.user, response.data.token);
              return true;
            }
            return false;
          } catch (_error) {
            return false;
          } finally {
            refreshPromise = null;
          }
        })();

        return refreshPromise;
      },
      logout: async () => {
        setAuthData(null, null);
        return true;
      },
      login: async (email, password) => {
        try {
          const response = await AuthApi.login({ email, password });
          if (response.data) {
            setAuthData(response.data.user, response.data.token);
            return true;
          }
          return false;
        } catch (_error) {
          return false;
        }
      },
      register: async (data) => {
        try {
          const response = await AuthApi.register(data);
          if (response.data) {
            setAuthData(response.data.user, response.data.token);
            return true;
          }
          return false;
        } catch (_error) {
          return false;
        }
      },
    },
  };
});
