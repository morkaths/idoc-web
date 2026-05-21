import { ApiEndpoint } from '@/config/api';
import type {
  LoanResponse,
  BorrowRequest,
  RenewBorrowRequest,
  ApiResponse,
  PageResponse,
  FindParams,
} from '../types';
import { ApiClient } from './config';
import { apiFactory } from './factory';

const factory = apiFactory<LoanResponse, BorrowRequest>(
  ApiEndpoint.endpoints.borrows,
  {
    find: 'public',
    findById: 'public',
  }
);

export const BorrowApi = {
  ...factory,

  history: async (
    params?: FindParams & { item?: string; status?: string }
  ): Promise<ApiResponse<PageResponse<LoanResponse>>> => {
    return ApiClient.get<PageResponse<LoanResponse>>(
      ApiEndpoint.endpoints.borrows.history(),
      {
        security: 'private',
        params,
      }
    );
  },

  extend: async (id: string, request: Partial<RenewBorrowRequest>): Promise<ApiResponse<LoanResponse>> => {
    return ApiClient.put<LoanResponse>(
      ApiEndpoint.endpoints.borrows.extend(id),
      {
        security: 'private',
        data: request,
      }
    );
  },

  return: async (id: string): Promise<ApiResponse<LoanResponse>> => {
    return ApiClient.post<LoanResponse>(
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


