import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { ApiEndpoint } from '@/config/api';
import env from '@/config/env';
import type { ApiResponse } from '@/types';
import qs from 'qs';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth-store';

export type SecurityStrategy = 'public' | 'private';

export interface ApiOptions extends Omit<AxiosRequestConfig, 'method' | 'url' | 'baseURL'> {
  security?: SecurityStrategy;
}

let instances: { public: AxiosInstance; private: AxiosInstance } | null = null;

const createInstance = (withCredentials = false): AxiosInstance => {
  const instance = axios.create({
    baseURL: ApiEndpoint.meta.baseURL,
    timeout: ApiEndpoint.meta.timeout,
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

  if (withCredentials) {
    instance.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;
        // Check if it's a 401 and we haven't retried yet and it's not a refresh request itself
        if (
          error?.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url?.includes('refresh')
        ) {
          const { auth } = useAuthStore.getState();

          originalRequest._retry = true;
          const refreshed = await auth.refresh();
          if (refreshed) {
            const newToken = useAuthStore.getState().auth.token?.accessToken;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return instance.request(originalRequest);
          }

          // If no refresh token or refresh failed, logout and redirect
          await auth.logout();
          // Don't toast if we are already going to sign-in
          if (!window.location.pathname.includes('sign-in')) {
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
  } else {
    // For public instance, just reject errors normally
    instance.interceptors.response.use(
      (res) => res,
      (error) => {
        return Promise.reject({
          success: false,
          message: error?.response?.data?.message ?? error?.message,
          statusCode: error?.response?.status ?? 500,
        });
      }
    );
  }

  return instance;
};

const getInstance = (strategy: SecurityStrategy): AxiosInstance => {
  if (!instances) {
    instances = {
      public: createInstance(true),
      private: createInstance(true),
    };
  }
  return instances[strategy];
};

export const ApiClient = {
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
    } catch (error) {
      return error as ApiResponse<T>;
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
