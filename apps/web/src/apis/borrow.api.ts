import { API_CONFIG } from '@/config/api';
import type { Borrow, FindParams, Pagination } from '../types';
import * as ApiRequest from './config';

export const BorrowApi = {
  find: async (params?: FindParams): Promise<{ data: Borrow[]; pagination?: Pagination }> => {
    const response = await ApiRequest.apiGet<Borrow[]>(
      API_CONFIG.endpoints.borrow.find,
      { mode: 'public', params }
    );
    return {
      data: response.data ?? [],
      pagination: response.pagination
    };
  },

  history: async (params?: FindParams): Promise<{ data: Borrow[]; pagination?: Pagination }> => {
    const response = await ApiRequest.apiGet<Borrow[]>(
      API_CONFIG.endpoints.borrow.history,
      { mode: 'private', params }
    );
    return {
      data: response.data ?? [],
      pagination: response.pagination
    };
  },

  findById: async (id: string): Promise<Borrow | null> => {
    const response = await ApiRequest.apiGet<Borrow>(
      API_CONFIG.endpoints.borrow.findById(id),
      { mode: 'public' }
    );
    if (response.success && response.data) return response.data;
    return null;
  },

  create: async (data: Partial<Borrow>): Promise<Borrow | null> => {
    const response = await ApiRequest.apiPost<Borrow>(
      API_CONFIG.endpoints.borrow.create,
      { mode: 'private', data }
    );
    if (response.success && response.data) return response.data;
    return null;
  },

  update: async (id: string, data: Partial<Borrow>): Promise<Borrow | null> => {
    const response = await ApiRequest.apiPatch<Borrow>(
      API_CONFIG.endpoints.borrow.update(id),
      { mode: 'private', data }
    );
    if (response.success && response.data) return response.data;
    return null;
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await ApiRequest.apiDelete<null>(
      API_CONFIG.endpoints.borrow.delete(id),
      { mode: 'private' }
    );
    return response.success;
  },

  extend: async (id: string, extraDays: number, note?: string): Promise<Borrow | null> => {
    const response = await ApiRequest.apiPut<Borrow>(
      API_CONFIG.endpoints.borrow.extend(id),
      { mode: 'private', data: { extraDays, note } }
    );
    if (response.success && response.data) return response.data;
    return null;
  },

  return: async (id: string): Promise<Borrow | null> => {
    const response = await ApiRequest.apiPut<Borrow>(
      API_CONFIG.endpoints.borrow.return(id),
      { mode: 'private' }
    );
    if (response.success && response.data) return response.data;
    return null;
  },
};