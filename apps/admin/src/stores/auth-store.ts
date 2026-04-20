import { create } from 'zustand';
import { getCookie, setCookie, removeCookie } from '@/lib/cookies';
import { AuthApi } from '@/apis/auth.api';
import type { UserResponse, UserRequest, AuthToken } from '@/types';
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

  let initToken: AuthToken | null = null;
  let initUser: UserResponse | null = null;

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

  let refreshPromise: Promise<boolean> | null = null;

  /**
   * Updates the authentication state and synchronizes with cookies.
   * Removes refreshToken from the token object before storing it in a non-HttpOnly cookie for security.
   * @param user The user profile data
   * @param token The authentication tokens
   */
  const setAuthData = (user: UserResponse | null, token: AuthToken | null) => {
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
            const data = await AuthApi.refresh();
            setAuthData(data.user, data.token);
            return true;
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
      login: async (identifier, password) => {
        try {
          const data = await AuthApi.login({ identifier, password });
          setAuthData(data.user, data.token);
          return true;
        } catch (_error) {
          return false;
        }
      },
      register: async (data) => {
        try {
          const responseData = await AuthApi.register(data);
          setAuthData(responseData.user, responseData.token);
          return true;
        } catch (_error) {
          return false;
        }
      },
    },
  };
});