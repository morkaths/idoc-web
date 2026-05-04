import { ApiEndpoint } from '@/config/api';
import type {
  BorrowResponse,
  BorrowRequest,
  RenewBorrowRequest,
  ApiResponse,
  PageResponse,
  PageParams,
} from '../types';
import { ApiClient } from './config';
import { apiFactory } from './factory';

const factory = apiFactory<BorrowResponse, BorrowRequest>(
  ApiEndpoint.endpoints.borrows,
  {
    find: 'public',
    findById: 'public',
  }
);

export const BorrowApi = {
  ...factory,

  history: async (
    params?: PageParams
  ): Promise<ApiResponse<PageResponse<BorrowResponse>>> => {
    return ApiClient.get<PageResponse<BorrowResponse>>(
      ApiEndpoint.endpoints.borrows.history(),
      {
        security: 'private',
        params,
      }
    );
  },

  extend: async (id: string, request: Partial<RenewBorrowRequest>): Promise<ApiResponse<BorrowResponse>> => {
    return ApiClient.put<BorrowResponse>(
      ApiEndpoint.endpoints.borrows.extend(id),
      {
        security: 'private',
        data: request,
      }
    );
  },

  return: async (id: string): Promise<ApiResponse<BorrowResponse>> => {
    return ApiClient.post<BorrowResponse>(
      ApiEndpoint.endpoints.borrows.return(id),
      {
        security: 'private',
      }
    );
  },

  view: async (id: string): Promise<ApiResponse<string>> => {
    return ApiClient.get<string>(
      ApiEndpoint.endpoints.borrows.view(id),
      {
        security: 'private',
      }
    );
  },
};


