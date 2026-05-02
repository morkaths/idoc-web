import { ApiEndpoint } from '@/config/api';
import type {
  BorrowResponse,
  BorrowRequest,
  FindParams,
  ApiResponse,
  PageResponse,
} from '../types';
import { ApiClient } from './config';
import { apiFactory } from './factory';

export const BorrowApi = {
  ...apiFactory<BorrowResponse, BorrowRequest>(ApiEndpoint.endpoints.borrows, {
    find: 'public',
    findById: 'public',
  }),

  history: async (
    params?: FindParams
  ): Promise<ApiResponse<PageResponse<BorrowResponse>>> => {
    return ApiClient.get<PageResponse<BorrowResponse>>(ApiEndpoint.endpoints.borrows.history, {
      security: 'private',
      params,
    });
  },

  extend: async (
    id: string,
    extraDays: number,
    note?: string
  ): Promise<ApiResponse<BorrowResponse>> => {
    return ApiClient.put<BorrowResponse>(ApiEndpoint.endpoints.borrows.extend(id), {
      security: 'private',
      data: { extraDays, note },
    });
  },

  return: async (id: string): Promise<ApiResponse<BorrowResponse>> => {
    return ApiClient.put<BorrowResponse>(ApiEndpoint.endpoints.borrows.return(id), {
      security: 'private',
    });
  },
};

