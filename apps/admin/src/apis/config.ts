import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import type { ApiResponse } from '@/types';
import { API_CONFIG } from '@/config/api';
import { API_KEY } from '@/config/env';
import { getCookie } from '@/lib/cookies';

// ────────────────────────────────────────────────────────────────────────────────
// API Instances
// ────────────────────────────────────────────────────────────────────────────────
type ApiMode = 'public' | 'private';

/**
 * Create an Axios instance
 * @param baseURL - Base URL for the service
 * @param withCredentials - Whether to send cookies with requests
 * @returns AxiosInstance
 */
function createApiInstance(withCredentials = false) {
  const instance = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    withCredentials
  });

  instance.interceptors.request.use((config) => {
    config.headers = config.headers || {};
    config.headers['x-api-key'] = API_KEY;
    if (withCredentials) {
      const token = getCookie('authToken');
      if (token) config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });
  
  instance.interceptors.response.use(
    (res) => res,
    (error) => Promise.reject({
      success: false,
      message: error.response?.data?.message,
      statusCode: error.response?.status || 500
    })
  );

  return instance;
}

/**
 * Get the appropriate Axios instance based on service and mode
 * @param mode - Request mode (public/private)
 * @returns AxiosInstance
 */
function getApiInstance(mode: ApiMode): AxiosInstance {
  return createApiInstance(mode === 'private');
}

// ────────────────────────────────────────────────────────────────────────────────
// Common Helpers
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Handle API errors
 * @param error - Error object
 * @returns ApiResponse with error details
 */
function handleError(error: any): ApiResponse<any> {
  return {
    success: false,
    message: error.response?.data?.message,
    statusCode: error.response?.status || 500
  };
}

// ────────────────────────────────────────────────────────────────────────────────
// API Methods
// ────────────────────────────────────────────────────────────────────────────────
/**
 * Options for API requests
 */
type ApiOptions = Omit<AxiosRequestConfig, 'method' | 'url' | 'baseURL'> & { mode?: ApiMode };

/**
 * Make an API request
 * @param method - HTTP method (GET, POST, PUT, DELETE)
 * @param url - Endpoint URL
 * @param options - Additional Axios request options (headers, params, data, etc.)
 * @returns Promise resolving to ApiResponse<T>
 */
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
      ...axiosOptions
    });
    return response.data;
  } catch (error: any) {
    return handleError(error);
  }
}

/**
 * Make a GET request
 * @param url - Endpoint URL
 * @param options - Additional Axios request options (headers, params, etc.)
 * @returns Promise resolving to ApiResponse<T>
 */
const apiGet = <T>(url: string, options?: ApiOptions) =>
  apiRequest<T>('get', url, options);

/**
 * Make a POST request
 * @param url - Endpoint URL
 * @param options - Additional Axios request options (headers, data, etc.)
 * @returns Promise resolving to ApiResponse<T>
 */
const apiPost = <T>(url: string, options?: ApiOptions) =>
  apiRequest<T>('post', url, options);

/**
 * Make a PUT request
 * @param url - Endpoint URL
 * @param options - Additional Axios request options (headers, data, etc.)
 * @returns - Promise resolving to ApiResponse<T>
 */
const apiPut = <T>(url: string, options?: ApiOptions) =>
  apiRequest<T>('put', url, options);

/**
 * Make a PATCH request
 * @param url - Endpoint URL
 * @param options - Additional Axios request options (headers, data, etc.)
 * @returns - Promise resolving to ApiResponse<T>
 */
const apiPatch = <T>(url: string, options?: ApiOptions) =>
  apiRequest<T>('patch', url, options);

/**
 * Make a DELETE request
 * @param url - Endpoint URL
 * @param options - Additional Axios request options (headers, params, etc.)
 * @returns - Promise resolving to ApiResponse<T>
 */
const apiDelete = <T>(url: string, options?: ApiOptions) =>
  apiRequest<T>('delete', url, options);

export {
  apiRequest,
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete
};
