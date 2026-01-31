import { API_CONFIG } from '@/config/api';
// import { mockBooks } from '@/mocks';
import type { Book, FindParams, Pagination } from '../types';
import * as ApiRequest from './config';

export const BookApi = {
  find: async (params?: FindParams): Promise<{ data: Book[]; pagination?: Pagination }> => {
    const response = await ApiRequest.apiGet<Book[]>(
      API_CONFIG.endpoints.book.find,
      { mode: 'public', params }
    );
    return {
      data: response.data ?? [],
      pagination: response.pagination
    };
  },

  findById: async (id: string): Promise<Book | null> => {
    const response = await ApiRequest.apiGet<Book>(
      API_CONFIG.endpoints.book.findById(id),
      { mode: 'public' }
    );
    if (response.success && response.data) return response.data;
    return null;
  },

  create: async (data: Partial<Book>): Promise<Book | null> => {
    const response = await ApiRequest.apiPost<Book>(
      API_CONFIG.endpoints.book.create,
      { mode: 'private', data: data }
    );
    if (response.success && response.data) return response.data;
    return null;
  },

  update: async (id: string, data: Partial<Book>): Promise<Book | null> => {
    const response = await ApiRequest.apiPatch<Book>(
      API_CONFIG.endpoints.book.update(id),
      { mode: 'private', data: data }
    );
    if (response.success && response.data) return response.data;
    return null;
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await ApiRequest.apiDelete<null>(
      API_CONFIG.endpoints.book.delete(id),
      { mode: 'private' }
    );
    return response.success;
  },
};