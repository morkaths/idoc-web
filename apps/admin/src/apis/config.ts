import qs from 'qs';
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@/config/api';
import env from '@/config/env';
import type { ApiResponse } from '@/types';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';

type ApiMode = 'public' | 'private';

function attachInterceptors(instance: AxiosInstance, withCredentials: boolean) {
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
          originalRequest.headers.Authorization = `Bearer ${useAuthStore.getState().auth.token?.accessToken}`;
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
}

function createApiInstance(withCredentials = false): AxiosInstance {
  const instance = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    withCredentials,
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
  });
  attachInterceptors(instance, withCredentials);
  return instance;
}

function getApiInstance(mode: ApiMode): AxiosInstance {
  return createApiInstance(mode === 'private');
}

function handleError<T>(error: unknown): ApiResponse<T> {
  if (axios.isAxiosError(error)) {
    return {
      success: false,
      message: error.response?.data?.message ?? error.message,
      statusCode: error.response?.status ?? 500,
    };
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const err = error as { message?: string; statusCode?: number };
    return {
      success: false,
      message: err.message,
      statusCode: err.statusCode ?? 500,
    };
  }
  return {
    success: false,
    message: 'Unknown error',
    statusCode: 500,
  };
}

type ApiOptions = Omit<AxiosRequestConfig, 'method' | 'url' | 'baseURL'> & {
  mode?: ApiMode;
};

async function apiRequest<T>(
  method: AxiosRequestConfig['method'],
  url: string,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> {
  const { mode = 'private', ...axiosOptions } = options;
  try {
    const api = getApiInstance(mode);
    const response = await api.request<ApiResponse<T>>({
      method,
      url,
      ...axiosOptions,
    });
    return response.data;
  } catch (error) {
    return handleError<T>(error);
  }
}

const apiGet = <T>(url: string, options?: ApiOptions) => apiRequest<T>('get', url, options);
const apiPost = <T>(url: string, options?: ApiOptions) => apiRequest<T>('post', url, options);
const apiPut = <T>(url: string, options?: ApiOptions) => apiRequest<T>('put', url, options);
const apiPatch = <T>(url: string, options?: ApiOptions) => apiRequest<T>('patch', url, options);
const apiDelete = <T>(url: string, options?: ApiOptions) => apiRequest<T>('delete', url, options);

export { apiRequest, apiGet, apiPost, apiPut, apiPatch, apiDelete };