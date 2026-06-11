import { ApiEndpoint } from '@/config/api';
import type { ApiResponse, LibraryStatsResponse } from '../types';
import { ApiClient } from './config';

export const LibraryApi = {
  /**
   * Fetches the library stats from the server.
   */
  getStats: async (): Promise<ApiResponse<LibraryStatsResponse>> => {
    return ApiClient.get<LibraryStatsResponse>(ApiEndpoint.endpoints.library.stats(), {
      security: 'private',
    });
  },
};
