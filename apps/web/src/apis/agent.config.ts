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

/**
 * Lightweight agent API client.
 */
export const AgentClient = {
  /**
   * Generic GET request with retry logic.
   * @param url API endpoint
   * @param options Axios request options
   */
  async get<T>(url: string, options?: { params?: Record<string, unknown> }): Promise<ApiResponse<T>> {
    try {
      const response = await agentAxios.get<T>(url, { params: options?.params });
      return {
        success: true,
        status: response.status,
        message: 'OK',
        data: response.data,
      } as ApiResponse<T>;
    } catch (error) {
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
    }
  },
};
