import qs from 'qs';
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@/config/api';
import env from '@/config/env';
import type { ApiResponse } from '@/types';
import { getSession, signOut } from 'next-auth/react';

export type ApiMode = 'public' | 'private';

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  key?: string;
}

export type ApiOptions = Omit<AxiosRequestConfig, 'method' | 'url' | 'baseURL'> & { mode?: ApiMode };

export class ApiClient {
  private static instances: { public: AxiosInstance; private: AxiosInstance } | null = null;
  private static token: string | null = null;
  private static config: ApiConfig;

  private static refreshPromise: Promise<string | null> | null = null;
  private static isLoggingOut = false;

  static setToken(token: string | null) {
    ApiClient.token = token;
  }

  static getAccessToken() {
    return ApiClient.token;
  }

  static init(config: ApiConfig) {
    ApiClient.config = config;
    if (!ApiClient.instances) {
      ApiClient.instances = {
        public: ApiClient.createInstance(false),
        private: ApiClient.createInstance(true),
      };
    }
  }

  private static async syncSession(): Promise<string | null> {
    if (typeof window === 'undefined') return null;
    
    if (ApiClient.refreshPromise) return ApiClient.refreshPromise;

    ApiClient.refreshPromise = (async () => {
      try {
        const session = await getSession();
        const token = session?.accessToken || null;
        ApiClient.setToken(token);
        return token;
      } finally {
        ApiClient.refreshPromise = null;
      }
    })();

    return ApiClient.refreshPromise;
  }

  private static createInstance(withCredentials = false): AxiosInstance {
    if (!ApiClient.config) {
      ApiClient.config = API_CONFIG;
    }

    const instance = axios.create({
      baseURL: ApiClient.config.baseURL,
      timeout: ApiClient.config.timeout,
      withCredentials,
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
    });

    instance.interceptors.request.use(async (config) => {
      config.headers = config.headers || {};

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
        } catch (e) {}
      }

      if (ApiClient.config.key || env.api.key) {
        config.headers['x-api-key'] = ApiClient.config.key || env.api.key;
      }

      // Chỉ sync session nếu là private request và chưa có token
      if (typeof window !== 'undefined' && withCredentials && !ApiClient.token) {
        await ApiClient.syncSession();
      }

      if (ApiClient.token) {
        config.headers['Authorization'] = `Bearer ${ApiClient.token}`;
      }

      return config;
    }, (error) => Promise.reject(error));

    instance.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;
        if (
          error?.response?.status === 401 &&
          !originalRequest._retry &&
          !ApiClient.isLoggingOut
        ) {
          if (typeof window !== 'undefined') {
            originalRequest._retry = true;
            const newToken = await ApiClient.syncSession();

            if (newToken && newToken !== ApiClient.token) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return instance.request(originalRequest);
            } else {
              ApiClient.setToken(null);

              if (withCredentials) {
                ApiClient.isLoggingOut = true;
                await signOut({ callbackUrl: '/sign-in' });
              } else {
                 delete originalRequest.headers.Authorization;
                 return instance.request(originalRequest);
              }
            }
          }
        }

        return Promise.reject(ApiClient.handleError(error));
      }
    );

    return instance;
  }

  private static getInstance(mode: ApiMode): AxiosInstance {
    if (!ApiClient.instances) {
      // Ensure config is set before init
      if (!ApiClient.config) {
        ApiClient.config = API_CONFIG;
      }
      ApiClient.init(ApiClient.config);
    }
    // Check for null again to satisfy TypeScript, though init() ensures it's not null
    if (!ApiClient.instances) {
      throw new Error("Failed to initialize ApiClient instances");
    }
    return ApiClient.instances[mode];
  }

  private static handleError(error: any): ApiResponse<any> {
    const timestamp = new Date().toISOString();

    // Logic from original handleError
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
      const err = error as { message?: string; statusCode?: number; status?: number; timestamp?: string; errors?: string[] };
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
  }

  static async request<T>(
    method: AxiosRequestConfig['method'],
    url: string,
    options: ApiOptions = {}
  ): Promise<ApiResponse<T>> {
    const { mode = 'private', ...axiosOptions } = options;
    try {
      const api = ApiClient.getInstance(mode);
      const response = await api.request<ApiResponse<T>>({
        method,
        url,
        ...axiosOptions,
      });
      return response.data;
    } catch (error: any) {
      if (error.success === false) return error;
      return ApiClient.handleError(error);
    }
  }

  static get<T>(url: string, options?: ApiOptions) {
    return ApiClient.request<T>('get', url, options);
  }

  static post<T>(url: string, options?: ApiOptions) {
    return ApiClient.request<T>('post', url, options);
  }

  static put<T>(url: string, options?: ApiOptions) {
    return ApiClient.request<T>('put', url, options);
  }

  static patch<T>(url: string, options?: ApiOptions) {
    return ApiClient.request<T>('patch', url, options);
  }

  static delete<T>(url: string, options?: ApiOptions) {
    return ApiClient.request<T>('delete', url, options);
  }
}
export const setAccessToken = ApiClient.setToken;
export const getAccessToken = ApiClient.getAccessToken;