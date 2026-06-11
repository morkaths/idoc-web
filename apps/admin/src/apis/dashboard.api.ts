import { ApiEndpoint } from '@/config/api';
import type { ApiResponse, DashboardStatsResponse } from '../types';
import { ApiClient } from './config';

export const DashboardApi = {
  /**
   * Fetches the dashboard stats from the server.
   */
  getStats: async (): Promise<ApiResponse<DashboardStatsResponse>> => {
    return ApiClient.get<DashboardStatsResponse>(ApiEndpoint.endpoints.dashboard.stats(), {
      security: 'private',
    });
  },
};
