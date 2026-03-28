import { API_CONFIG } from '@/config/api';
import type { BorrowResponse, BorrowRequest, FindParams, Pagination } from '../types';
import { ApiClient } from './config';
import { apiFactory } from './factory';

const factory = apiFactory<BorrowResponse, BorrowRequest>(
  API_CONFIG.endpoints.borrows,
  'Borrow',
  {
    find: 'public',
    findById: 'public',
  }
);

export const BorrowApi = {
  ...factory,

  history: async (
    params?: FindParams
  ): Promise<{ data: BorrowResponse[]; pagination?: Pagination }> => {
    const response = await ApiClient.get<BorrowResponse[]>(API_CONFIG.endpoints.borrows.history, {
      security: 'private',
      params,
    });
    return {
      data: response.data ?? [],
      pagination: response.pagination,
    };
  },

  extend: async (id: string, extraDays: number, note?: string): Promise<BorrowResponse> => {
    const response = await ApiClient.put<BorrowResponse>(API_CONFIG.endpoints.borrows.extend(id), {
      security: 'private',
      data: { extraDays, note },
    });
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to extend borrow');
  },

  return: async (id: string): Promise<BorrowResponse> => {
    const response = await ApiClient.put<BorrowResponse>(API_CONFIG.endpoints.borrows.return(id), {
      security: 'private',
    });
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to return borrow');
  },

  read: async (id: string): Promise<string> => {
    const response = await ApiClient.get<string>(API_CONFIG.endpoints.borrows.read(id), {
      security: 'private',
    });
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to get read link');
  },
};
