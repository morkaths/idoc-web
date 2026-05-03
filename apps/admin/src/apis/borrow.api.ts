import { ApiEndpoint } from '@/config/api';
import type {
  BorrowResponse,
  BorrowRequest,
  FindParams,
  ApiResponse,
  PageResponse,
  RenewBorrowRequest,
} from '../types';
import { ApiClient } from './config';
import { apiFactory } from './factory';

const factory = apiFactory<BorrowResponse, BorrowRequest>(
  ApiEndpoint.endpoints.borrows,
  {
    find: 'public',
    findById: 'public',
  }
)

export const BorrowApi = {
  ...factory,

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
    request: Partial<RenewBorrowRequest>
  ): Promise<ApiResponse<BorrowResponse>> => {
    return ApiClient.put<BorrowResponse>(ApiEndpoint.endpoints.borrows.extend(id), {
      security: 'private',
      data: request,
    });
  },

  return: async (id: string): Promise<ApiResponse<BorrowResponse>> => {
    return ApiClient.put<BorrowResponse>(ApiEndpoint.endpoints.borrows.return(id), {
      security: 'private',
    });
  },
};

