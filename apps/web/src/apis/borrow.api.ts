import { API_CONFIG } from '@/config/api';
import type {
  BorrowResponse,
  BorrowRequest,
  RenewBorrowRequest,
  FindParams,
  ApiResponse,
  PageResponse,
} from '../types';
import { ApiClient } from './config';
import { apiFactory } from './factory';

const factory = apiFactory<BorrowResponse, BorrowRequest>(API_CONFIG.endpoints.borrows, {
  find: 'public',
  findById: 'public',
});

export const BorrowApi = {
  ...factory,

  history: async (
    params?: FindParams
  ): Promise<ApiResponse<PageResponse<BorrowResponse>>> => {
    return ApiClient.get<PageResponse<BorrowResponse>>(API_CONFIG.endpoints.borrows.history, {
      security: 'private',
      params,
    });
  },

  extend: async (id: string, request: RenewBorrowRequest): Promise<ApiResponse<BorrowResponse>> => {
    return ApiClient.put<BorrowResponse>(API_CONFIG.endpoints.borrows.extend(id), {
      security: 'private',
      data: request,
    });
  },

  return: async (id: string): Promise<ApiResponse<BorrowResponse>> => {
    return ApiClient.post<BorrowResponse>(API_CONFIG.endpoints.borrows.return(id), {
      security: 'private',
    });
  },

  view: async (id: string): Promise<ApiResponse<string>> => {
    return ApiClient.get<string>(API_CONFIG.endpoints.borrows.view(id), {
      security: 'private',
    });
  },
};


