import qs from 'qs';
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@/config/api';
import env from '@/config/env';
import type { ApiResponse } from '@/types';
import { toast } from 'sonner';
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

  private static createInstance(withCredentials = false): AxiosInstance {
    if (!ApiClient.config) {
      // Fallback or throw? Original didn't throw, but reference does.
      // We will initialize lazily if needed, but for now lets assume init is called or we use default.
      // Actually, let's use the imported API_CONFIG as default if not set.
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
      if (ApiClient.config.key || env.api.key) {
        config.headers['x-api-key'] = ApiClient.config.key || env.api.key;
      }

      // Use stored token or try to get it if we are in private mode
      if (typeof window !== 'undefined') {
        if (!ApiClient.token) {
          const session = await getSession();
          if (session?.accessToken) {
            ApiClient.setToken(session.accessToken);
          }
        }

        if (ApiClient.token) {
          config.headers['Authorization'] = `Bearer ${ApiClient.token}`;
        }
      }
      return config;
    }, (error) => Promise.reject(error));

    instance.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;
        if (
          error?.response?.status === 401 &&
          !originalRequest._retry
        ) {
          if (typeof window !== 'undefined') {
            console.log('[ApiClient] 401 detected. Attempting refresh...');
            originalRequest._retry = true;
            // Try to get a fresh session from NextAuth
            const session = await getSession();
            console.log('[ApiClient] Session retrieved:', session);
            const newToken = session?.accessToken;

            if (newToken && newToken !== ApiClient.token) {
              console.log('[ApiClient] New token found. Retrying request...');
              ApiClient.setToken(newToken);
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return instance.request(originalRequest);
            } else {
              console.warn('[ApiClient] No new token found or token unchanged. Forcing logout.');
              // Token refresh failed or same invalid token
              ApiClient.setToken(null);

              if (!withCredentials) {
                // For public requests, just retry without token (guest mode)
                delete originalRequest.headers.Authorization;
                return instance.request(originalRequest);
              } else {
                // For private requests, force logout
                await signOut({ callbackUrl: '/sign-in' });
                toast.error('Session expired. Please log in again.');
              }
            }
          }
        }

        // Return standard error format
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