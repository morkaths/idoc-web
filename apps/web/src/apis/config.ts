import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { getSession, signOut } from 'next-auth/react';
import { API_CONFIG } from '@/config/api';
import env from '@/config/env';
import type { ApiResponse } from '@/types';
import qs from 'qs';

export type SecurityStrategy = 'public' | 'private';

export interface ApiOptions extends Omit<AxiosRequestConfig, 'method' | 'url' | 'baseURL'> {
  security?: SecurityStrategy;
}

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

let instances: { public: AxiosInstance; private: AxiosInstance } | null = null;
let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;
let isLoggingOut = false;

const syncSession = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null;
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const session = await getSession();
      accessToken = session?.accessToken || null;
      return accessToken;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

const handleError = (error: unknown): ApiResponse<undefined> => {
  const timestamp = new Date().toISOString();

  if (axios.isAxiosError(error) && error.response?.data) {
    const serverResponse = error.response.data as Record<string, unknown>;
    return {
      success: false,
      message: (serverResponse.message as string) || error.message,
      status: (serverResponse.status as number) ?? error.response?.status ?? 500,
      timestamp: (serverResponse.timestamp as string) || timestamp,
      errors: serverResponse.errors,
    } as unknown as ApiResponse<undefined>;
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const err = error as Record<string, unknown>;
    return {
      success: false,
      message: err.message as string,
      status: (err.status as number) ?? (err.statusCode as number) ?? 500,
      timestamp: (err.timestamp as string) || timestamp,
      errors: err.errors,
    } as unknown as ApiResponse<undefined>;
  }

  return {
    success: false,
    message: 'Unknown error',
    status: 500,
    timestamp,
  };
};

const createInstance = (withCredentials = false): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    withCredentials: true,
    paramsSerializer: (params) => {
      const processed: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(params)) {
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
      }
      return qs.stringify(processed, { arrayFormat: 'repeat', skipNulls: true });
    },
  });

  // Request Interceptor
  instance.interceptors.request.use(
    async (config) => {
      if (!config.headers) {
        config.headers = axios.AxiosHeaders.from({});
      }

      // Handle locale
      if (config.params && config.params.lang) {
        config.headers['Accept-Language'] = config.params.lang;
        delete config.params.lang;
      } else if (typeof window !== 'undefined') {
        const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
        if (match) config.headers['Accept-Language'] = match[1];
      } else {
        try {
          const { headers } = await import('next/headers');
          const headerList = await headers();
          const locale = headerList.get('Accept-Language');
          if (locale) config.headers['Accept-Language'] = locale;
        } catch (_e) {
          // Ignore
        }
      }

      // API Key
      if (env.api.key) {
        config.headers['x-api-key'] = env.api.key;
      }

      // Authorization & Session sync
      if (withCredentials) {
        if (typeof window !== 'undefined' && !accessToken) {
          await syncSession();
        }

        if (accessToken) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor
  instance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config as CustomAxiosRequestConfig;

      if (error?.response?.status === 401 && !originalRequest._retry && !isLoggingOut) {
        if (typeof window !== 'undefined') {
          originalRequest._retry = true;
          const newToken = await syncSession();

          if (newToken && newToken !== accessToken) {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            }
            return instance.request(originalRequest);
          } else {
            accessToken = null;
            if (withCredentials) {
              isLoggingOut = true;
              await signOut({ callbackUrl: '/sign-in' });
            } else {
              if (originalRequest.headers) {
                delete originalRequest.headers['Authorization'];
              }
              return instance.request(originalRequest);
            }
          }
        }
      }

      return Promise.reject(handleError(error));
    }
  );

  return instance;
};

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

      if (response.data) {
        Object.assign(response.data, { headers: response.headers });
      }

      return response.data;
    } catch (error: unknown) {
      const err = error as Record<string, unknown>;
      if (err && err.success === false) return err as unknown as ApiResponse<T>;
      return handleError(error) as ApiResponse<T>;
    }
  },

  get<T>(url: string, options?: ApiOptions) {
    return ApiClient.request<T>('get', url, options);
  },

  post<T>(url: string, options?: ApiOptions) {
    return ApiClient.request<T>('post', url, options);
  },

  put<T>(url: string, options?: ApiOptions) {
    return ApiClient.request<T>('put', url, options);
  },

  patch<T>(url: string, options?: ApiOptions) {
    return ApiClient.request<T>('patch', url, options);
  },

  delete<T>(url: string, options?: ApiOptions) {
    return ApiClient.request<T>('delete', url, options);
  },
};

export const setAccessToken = ApiClient.setToken;
export const getAccessToken = ApiClient.getAccessToken;
