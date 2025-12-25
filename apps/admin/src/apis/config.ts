import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@/config/api';
import { API_KEY } from '@/config/env';
import type { ApiResponse } from '@/types';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';

type ApiMode = 'public' | 'private';

function createApiInstance(withCredentials = false): AxiosInstance {
  const instance = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    withCredentials,
  });

  instance.interceptors.request.use((config) => {
    config.headers = config.headers || {};
    config.headers['x-api-key'] = API_KEY;
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
      if (error?.response?.status === 401) {
        const { auth } = useAuthStore.getState();
        const refreshed = await auth.refresh();
        if (refreshed) {
          error.config.headers.Authorization = `Bearer ${useAuthStore.getState().auth.token?.accessToken}`;
          return instance.request(error.config);
        } else {
          await auth.logout();
          toast.error('Session expired. Please log in again.');
        }
      }
      return Promise.reject({
        success: false,
        message: error?.response?.data?.message ?? error?.message,
        statusCode: error?.response?.status ?? 500,
      })
    }
  );

  return instance;
}

function getApiInstance(mode: ApiMode): AxiosInstance {
  return createApiInstance(mode === 'private');
}

function handleError<T>(error: unknown): ApiResponse<T> {
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