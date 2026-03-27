import { ApiEndpoint } from '@/config/api';
import type { Borrow, BorrowRequest, FindParams, Pagination } from '../types';
import { ApiClient } from './config';
import { apiFactory } from './factory';

export const BorrowApi = {
  ...apiFactory<Borrow, BorrowRequest>(
    ApiEndpoint.endpoints.borrows,
    'Borrow',
    { find: 'public', findById: 'public' }
  ),

  history: async (params?: FindParams): Promise<{ data: Borrow[]; pagination?: Pagination }> => {
    const response = await ApiClient.get<Borrow[]>(
      ApiEndpoint.endpoints.borrows.history,
      { security: 'private', params }
    );
    return {
      data: response.data ?? [],
      pagination: response.pagination
    };
  },

  extend: async (id: string, extraDays: number, note?: string): Promise<Borrow> => {
    const response = await ApiClient.put<Borrow>(
      ApiEndpoint.endpoints.borrows.extend(id),
      { security: 'private', data: { extraDays, note } }
    );
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to extend borrow time');
  },

  return: async (id: string): Promise<Borrow> => {
    const response = await ApiClient.put<Borrow>(
      ApiEndpoint.endpoints.borrows.return(id),
      { security: 'private' }
    );
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to return borrowed item');
  },
};