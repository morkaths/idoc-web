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

const handleError = (error: any): ApiResponse<any> => {
  const timestamp = new Date().toISOString();

  if (axios.isAxiosError(error) && error.response?.data) {
    const serverResponse = error.response.data;
    return {
      success: false,
      message: serverResponse.message || error.message,
      status: serverResponse.status ?? error.response?.status ?? 500,
      timestamp: serverResponse.timestamp || timestamp,
      errors: serverResponse.errors,
    } as any;
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const err = error as any;
    return {
      success: false,
      message: err.message,
      status: err.status ?? err.statusCode ?? 500,
      timestamp: err.timestamp || timestamp,
      errors: err.errors,
    } as any;
  }

  return {
    success: false,
    message: 'Unknown error',
    status: 500,
    timestamp,
  } as any;
};

const createInstance = (withCredentials = false): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    withCredentials: true, // Always send credentials/cookies
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
  });

  // Request Interceptor
  instance.interceptors.request.use(
    async (config) => {
      config.headers = config.headers || {};

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
        } catch (e) {
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
      const originalRequest = error.config;
      
      if (error?.response?.status === 401 && !originalRequest._retry && !isLoggingOut) {
        if (typeof window !== 'undefined') {
          originalRequest._retry = true;
          const newToken = await syncSession();

          if (newToken && newToken !== accessToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return instance.request(originalRequest);
          } else {
            accessToken = null;
            if (withCredentials) {
              isLoggingOut = true;
              await signOut({ callbackUrl: '/sign-in' });
            } else {
              delete originalRequest.headers.Authorization;
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
        response.data.headers = response.headers as Record<string, string | string[]>;
      }

      return response.data;
    } catch (error: any) {
      if (error.success === false) return error;
      return handleError(error);
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
