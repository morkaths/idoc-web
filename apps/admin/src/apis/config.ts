import qs from 'qs';
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@/config/api';
import env from '@/config/env';
import type { ApiResponse } from '@/types';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';

export type ApiMode = 'public' | 'private';

export interface ApiOptions extends Omit<AxiosRequestConfig, 'method' | 'url' | 'baseURL'> {
  mode?: ApiMode;
}

export class ApiClient {
  private static instances: { public: AxiosInstance; private: AxiosInstance } | null = null;

  private static createInstance(withCredentials = false): AxiosInstance {
    const instance = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      withCredentials,
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
    });

    instance.interceptors.request.use((config) => {
      config.headers = config.headers || {};
      config.headers['x-api-key'] = env.api.key;

      if (withCredentials) {
        const { auth } = useAuthStore.getState();
        const accessToken = auth.token?.accessToken;
        if (accessToken) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
      }
      return config;
    });

    instance.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;
        if (
          error?.response?.status === 401 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          const { auth } = useAuthStore.getState();
          const refreshed = await auth.refresh();
          if (refreshed) {
            const newToken = useAuthStore.getState().auth.token?.accessToken;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return instance.request(originalRequest);
          } else {
            await auth.logout();
            toast.error('Session expired. Please log in again.');
          }
        }
        return Promise.reject({
          success: false,
          message: error?.response?.data?.message ?? error?.message,
          statusCode: error?.response?.status ?? 500,
        });
      }
    );

    return instance;
  }

  private static getInstance(mode: ApiMode): AxiosInstance {
    if (!ApiClient.instances) {
      ApiClient.instances = {
        public: ApiClient.createInstance(false),
        private: ApiClient.createInstance(true),
      };
    }
    return ApiClient.instances[mode];
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
    } catch (error) {
      return error as ApiResponse<T>;
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