import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
  type AxiosError,
  AxiosHeaders,
} from 'axios';
import { getSession } from 'next-auth/react';
import { ApiEndpoint } from '@/config/api';
import env from '@/config/env';
import type { ApiResponse, ApiErrorResponse } from '@/types';
import qs from 'qs';

export type SecurityStrategy = 'public' | 'private';

export interface ApiOptions extends Omit<AxiosRequestConfig, 'method' | 'url' | 'baseURL'> {
  security?: SecurityStrategy;
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Global states for session management
let instances: { public: AxiosInstance; private: AxiosInstance } | null = null;
let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;
let isLoggingOut = false;

/**
 * Synchronizes the authentication session with NextAuth.
 */
const syncSession = async (force = false): Promise<string | null> => {
  if (typeof window === 'undefined') return null;

  if (!force && accessToken) {
    return accessToken;
  }

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const session = await getSession();
        const newToken = session?.accessToken || null;
        accessToken = newToken;

        if (newToken) {
          isLoggingOut = false;
        }

        return newToken;
      } catch (_error) {
        accessToken = null;
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
};

/**
 * -----------------------------------------------------------------------------
 * HELPER FUNCTIONS (SENIOR PATTERN)
 * -----------------------------------------------------------------------------
 */

/**
 * Standardizes error responses from the API or network.
 */
const handleError = (error: unknown): ApiErrorResponse => {
  const timestamp = new Date().toISOString();

  if (axios.isAxiosError(error) && error.response?.data) {
    const serverData = error.response.data as ApiErrorResponse;
    return {
      success: false,
      status: serverData.status ?? error.response.status ?? 500,
      errorCode: serverData.errorCode || 'API_ERROR',
      message: serverData.message || error.message,
      path: serverData.path || '',
      timestamp: serverData.timestamp || timestamp,
      errors: serverData.errors,
    };
  }

  return {
    success: false,
    status: 500,
    errorCode: error instanceof Error ? 'INTERNAL_ERROR' : 'UNKNOWN_ERROR',
    message: error instanceof Error ? error.message : 'An unexpected error occurred',
    path: '',
    timestamp,
  };
};

/**
 * Applies locale information to the request headers.
 */
const applyLocaleHeader = (config: InternalAxiosRequestConfig) => {
  const lang = config.params?.lang as string | undefined;

  if (lang) {
    config.headers.set('Accept-Language', lang);
    delete config.params.lang;
    return;
  }

  if (typeof window !== 'undefined') {
    const locale = document.cookie.match(/NEXT_LOCALE=([^;]+)/)?.[1];
    if (locale) {
      config.headers.set('Accept-Language', locale);
    }
  }
};

/**
 * Forwards browser cookies when running on the server (SSR/Server Actions).
 */
const forwardServerCookies = async (config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') return;

  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    if (allCookies.length > 0) {
      const cookieString = allCookies.map((c) => `${c.name}=${c.value}`).join('; ');
      config.headers.set('Cookie', cookieString);
    }
  } catch (_error) {
    // Not in a request context (e.g., build time)
  }
};

/**
 * Attaches the Authorization header if the instance requires it.
 */
const applyAuthHeader = async (config: InternalAxiosRequestConfig, useAuth: boolean) => {
  if (!useAuth) return;

  if (typeof window !== 'undefined') {
    const token = await syncSession();
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
  } else {
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const token = cookieStore.get(env.cookie.accessToken)?.value;

      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
    } catch (_error) {
      // Not in a request context
    }
  }
};

/**
 * Handles 401 Unauthorized errors by attempting to refresh the session.
 */
const handleUnauthorizedError = async (error: AxiosError, instance: AxiosInstance) => {
  const originalRequest = error.config as CustomAxiosRequestConfig;

  const shouldRetry =
    error.response?.status === 401 &&
    !originalRequest._retry &&
    !isLoggingOut &&
    typeof window !== 'undefined';

  if (shouldRetry) {
    originalRequest._retry = true;
    const newToken = await syncSession(true);

    if (newToken) {
      originalRequest.headers.set('Authorization', `Bearer ${newToken}`);
      return instance.request(originalRequest);
    }
  }

  return Promise.reject(handleError(error));
};

/**
 * -----------------------------------------------------------------------------
 * CORE AXIOS FACTORY
 * -----------------------------------------------------------------------------
 */

const createInstance = (useAuth = false): AxiosInstance => {
  const instance = axios.create({
    baseURL: ApiEndpoint.meta.baseURL,
    timeout: ApiEndpoint.meta.timeout,
    withCredentials: true,
    paramsSerializer: (params) => {
      const processed: Record<string, unknown> = {};
      Object.entries(params).forEach(([key, value]) => {
        if (
          Array.isArray(value) &&
          value.length > 0 &&
          typeof value[0] === 'object' &&
          value[0] !== null
        ) {
          processed[key] = JSON.stringify(value);
        } else {
          processed[key] = value;
        }
      });
      return qs.stringify(processed, { arrayFormat: 'repeat', skipNulls: true });
    },
  });

  // Request Interceptor (Declarative Flow)
  instance.interceptors.request.use(
    async (config) => {
      if (!config.headers) config.headers = new AxiosHeaders();

      applyLocaleHeader(config);

      if (env.api.key) {
        config.headers.set('x-api-key', env.api.key);
      }

      await forwardServerCookies(config);
      await applyAuthHeader(config, useAuth);

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error) => handleUnauthorizedError(error, instance)
  );

  return instance;
};

/**
 * -----------------------------------------------------------------------------
 * API CLIENT EXPORTS
 * -----------------------------------------------------------------------------
 */

const getInstance = (strategy: SecurityStrategy): AxiosInstance => {
  if (!instances) {
    instances = {
      public: createInstance(false),
      private: createInstance(true),
    };
  }
  return instances[strategy];
};

export const ApiClient = {
  setToken: (token: string | null) => {
    accessToken = token;
    if (token) isLoggingOut = false;
  },

  setLoggingOut: (value: boolean) => {
    isLoggingOut = value;
  },

  getAccessToken: () => accessToken,

  async request<T>(
    method: AxiosRequestConfig['method'],
    url: string,
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> {
    const { security = 'private', ...axiosOptions } = options;
    try {
      const api = getInstance(security);
      const response = await api.request<ApiResponse<T>>({
        method,
        url,
        ...axiosOptions,
      });

      return response.data;
    } catch (error: unknown) {
      // Return formatted error if it's already an ApiErrorResponse
      if (
        error &&
        typeof error === 'object' &&
        'success' in error &&
        (error as { success: boolean }).success === false
      ) {
        return error as unknown as ApiResponse<T>;
      }
      return handleError(error) as unknown as ApiResponse<T>;
    }
  },

  get: <T>(url: string, options?: ApiOptions) => ApiClient.request<T>('get', url, options),
  post: <T>(url: string, options?: ApiOptions) => ApiClient.request<T>('post', url, options),
  put: <T>(url: string, options?: ApiOptions) => ApiClient.request<T>('put', url, options),
  patch: <T>(url: string, options?: ApiOptions) => ApiClient.request<T>('patch', url, options),
  delete: <T>(url: string, options?: ApiOptions) => ApiClient.request<T>('delete', url, options),
};

export const setAccessToken = ApiClient.setToken;
export const getAccessToken = ApiClient.getAccessToken;
