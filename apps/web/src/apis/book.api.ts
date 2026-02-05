import { API_CONFIG } from '@/config/api';
import type { Book, FindParams, Pagination } from '../types';
import { ApiClient } from './config';

export const BookApi = {
  find: async (params?: FindParams): Promise<{ data: Book[]; pagination?: Pagination }> => {
    const response = await ApiClient.get<Book[]>(
      API_CONFIG.endpoints.book.find,
      { mode: 'public', params }
    );
    return {
      data: response.data ?? [],
      pagination: response.pagination
    };
  },

  findById: async (id: string): Promise<Book | null> => {
    const response = await ApiClient.get<Book>(
      API_CONFIG.endpoints.book.findById(id),
      { mode: 'public' }
    );
    if (response.success && response.data) return response.data;
    return null;
  },

  create: async (data: Partial<Book>): Promise<Book | null> => {
    const response = await ApiClient.post<Book>(
      API_CONFIG.endpoints.book.create,
      { mode: 'private', data: data }
    );
    if (response.success && response.data) return response.data;
    return null;
  },

  update: async (id: string, data: Partial<Book>): Promise<Book | null> => {
    const response = await ApiClient.patch<Book>(
      API_CONFIG.endpoints.book.update(id),
      { mode: 'private', data: data }
    );
    if (response.success && response.data) return response.data;
    return null;
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await ApiClient.delete<null>(
      API_CONFIG.endpoints.book.delete(id),
      { mode: 'private' }
    );
    return response.success;
  },
};