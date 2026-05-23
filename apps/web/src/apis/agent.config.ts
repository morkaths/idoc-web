import axios from 'axios';
import { AgentEndpoint } from '@/config/api';
import type { ApiResponse } from '@/types';

/**
 * Dedicated Axios instance for Python AI Agent service.
 * Uses a separate baseURL and longer timeout for ML inference.
 * No auth header required — agent is an internal service.
 */
const agentAxios = axios.create({
  baseURL: AgentEndpoint.meta.baseURL,
  timeout: AgentEndpoint.meta.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && value.constructor === Object;

const toCamel = (obj: unknown): unknown => {
  if (Array.isArray(obj)) {
    return obj.map(v => toCamel(v));
  } else if (isPlainObject(obj)) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/([-_][a-z])/g, group =>
        group.toUpperCase().replace('-', '').replace('_', '')
      );
      return {
        ...result,
        [camelKey]: toCamel(obj[key]),
      };
    }, {});
  }
  return obj;
};

const toSnake = (obj: unknown): unknown => {
  if (Array.isArray(obj)) {
    return obj.map(v => toSnake(v));
  } else if (isPlainObject(obj)) {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      return {
        ...result,
        [snakeKey]: toSnake(obj[key]),
      };
    }, {});
  }
  return obj;
};

agentAxios.interceptors.request.use((config) => {
  if (config.data) {
    config.data = toSnake(config.data);
  }
  if (config.params) {
    config.params = toSnake(config.params);
  }
  return config;
});

agentAxios.interceptors.response.use(
  (response) => {
    if (response.data) {
      response.data = toCamel(response.data);
    }
    return response;
  },
  (error) => Promise.reject(error)
);

/**
 * Lightweight agent API client.
 */
export const AgentClient = {
  /**
   * Generic GET request with retry logic.
   * @param url API endpoint
   * @param options Axios request options
   */
  async get<T>(
    url: string,
    options?: { params?: Record<string, unknown> }
  ): Promise<ApiResponse<T>> {
    try {
      const response = await agentAxios.get<T>(url, { params: options?.params });
      return response.data as ApiResponse<T>;
    } catch (error) {
      return this.handleError<T>(error, url);
    }
  },

  async post<T>(
    url: string,
    data?: unknown,
    options?: { params?: Record<string, unknown> }
  ): Promise<ApiResponse<T>> {
    try {
      const response = await agentAxios.post<T>(url, data, { params: options?.params });
      return response.data as ApiResponse<T>;
    } catch (error) {
      return this.handleError<T>(error, url);
    }
  },

  async delete<T>(
    url: string,
    options?: { params?: Record<string, unknown> }
  ): Promise<ApiResponse<T>> {
    try {
      const response = await agentAxios.delete<T>(url, { params: options?.params });
      return response.data as ApiResponse<T>;
    } catch (error) {
      return this.handleError<T>(error, url);
    }
  },

  handleError<T>(error: unknown, url: string): ApiResponse<T> {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        status: error.response?.status ?? 500,
        message: error.response?.data?.detail ?? error.message,
        errorCode: 'AGENT_ERROR',
        path: url,
        timestamp: new Date().toISOString(),
      } as unknown as ApiResponse<T>;
    }
    return {
      success: false,
      status: 500,
      message: 'Agent unavailable',
      errorCode: 'AGENT_UNAVAILABLE',
      path: url,
      timestamp: new Date().toISOString(),
    } as unknown as ApiResponse<T>;
  },
};
