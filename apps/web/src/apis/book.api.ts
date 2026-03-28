import { API_CONFIG } from '@/config/api';
import type { BookRequest, BookResponse, FindParams, Pagination } from '../types';
import { ApiClient } from './config';

export const BookApi = {
  find: async (params?: FindParams): Promise<{ data: BookResponse[]; pagination?: Pagination }> => {
    const response = await ApiClient.get<BookResponse[]>(API_CONFIG.endpoints.book.find, {
      mode: 'public',
      params,
    });
    return {
      data: response.data ?? [],
      pagination: response.pagination,
    };
  },

  findById: async (id: string): Promise<BookResponse> => {
    const response = await ApiClient.get<BookResponse>(API_CONFIG.endpoints.book.findById(id), {
      mode: 'public',
    });
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Book not found');
  },

  create: async (data: BookRequest): Promise<BookResponse> => {
    const response = await ApiClient.post<BookResponse>(API_CONFIG.endpoints.book.create, {
      mode: 'private',
      data: data,
    });
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to create book');
  },

  update: async (id: string, data: Partial<BookRequest>): Promise<BookResponse> => {
    const response = await ApiClient.patch<BookResponse>(API_CONFIG.endpoints.book.update(id), {
      mode: 'private',
      data: data,
    });
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to update book');
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await ApiClient.delete<null>(API_CONFIG.endpoints.book.delete(id), {
      mode: 'private',
    });
    return response.success;
  },
};
