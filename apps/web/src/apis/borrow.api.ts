import { API_CONFIG } from '@/config/api';
import type { BorrowResponse, BorrowRequest, FindParams, Pagination } from '../types';
import { ApiClient } from './config';

export const BorrowApi = {
  find: async (params?: FindParams): Promise<{ data: BorrowResponse[]; pagination?: Pagination }> => {
    const response = await ApiClient.get<BorrowResponse[]>(
      API_CONFIG.endpoints.borrow.find,
      { mode: 'public', params }
    );
    return {
      data: response.data ?? [],
      pagination: response.pagination
    };
  },

  history: async (params?: FindParams): Promise<{ data: BorrowResponse[]; pagination?: Pagination }> => {
    const response = await ApiClient.get<BorrowResponse[]>(
      API_CONFIG.endpoints.borrow.history,
      { mode: 'private', params }
    );
    return {
      data: response.data ?? [],
      pagination: response.pagination
    };
  },

  findById: async (id: string): Promise<BorrowResponse> => {
    const response = await ApiClient.get<BorrowResponse>(
      API_CONFIG.endpoints.borrow.findById(id),
      { mode: 'public' }
    );
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Borrow not found');
  },

  create: async (data: BorrowRequest): Promise<BorrowResponse> => {
    const response = await ApiClient.post<BorrowResponse>(
      API_CONFIG.endpoints.borrow.create,
      { mode: 'private', data }
    );
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to create borrow');
  },

  update: async (id: string, data: Partial<BorrowRequest>): Promise<BorrowResponse> => {
    const response = await ApiClient.patch<BorrowResponse>(
      API_CONFIG.endpoints.borrow.update(id),
      { mode: 'private', data }
    );
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to update borrow');
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await ApiClient.delete<null>(
      API_CONFIG.endpoints.borrow.delete(id),
      { mode: 'private' }
    );
    return response.success;
  },

  extend: async (id: string, extraDays: number, note?: string): Promise<BorrowResponse> => {
    const response = await ApiClient.put<BorrowResponse>(
      API_CONFIG.endpoints.borrow.extend(id),
      { mode: 'private', data: { extraDays, note } }
    );
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to extend borrow');
  },

  return: async (id: string): Promise<BorrowResponse> => {
    const response = await ApiClient.put<BorrowResponse>(
      API_CONFIG.endpoints.borrow.return(id),
      { mode: 'private' }
    );
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to return borrow');
  },

  read: async (id: string): Promise<string> => {
    const response = await ApiClient.get<string>(
      API_CONFIG.endpoints.borrow.read(id),
      { mode: 'private' }
    );
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to get read link');
  },
};