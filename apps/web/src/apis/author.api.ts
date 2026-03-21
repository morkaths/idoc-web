import { API_CONFIG } from '@/config/api';
import type { Author, AuthorRequest, FindParams, Pagination } from '../types';
import { ApiClient } from './config';

export const AuthorApi = {
  find: async (params?: FindParams): Promise<{ data: Author[]; pagination?: Pagination }> => {
    const response = await ApiClient.get<Author[]>(
      API_CONFIG.endpoints.author.find,
      { mode: 'public', params }
    );
    return {
      data: response.data ?? [],
      pagination: response.pagination
    };
  },

  findById: async (id: string): Promise<Author | null> => {
    const response = await ApiClient.get<Author>(
      API_CONFIG.endpoints.author.findById(id),
      { mode: 'public' }
    );
    if (response.success && response.data) return response.data;
    return null;
  },

  create: async (data: AuthorRequest): Promise<Author | null> => {
    const response = await ApiClient.post<Author>(
      API_CONFIG.endpoints.author.create,
      { mode: 'private', data }
    );
    if (response.success && response.data) return response.data;
    return null;
  },

  update: async (id: string, data: Partial<AuthorRequest>): Promise<Author | null> => {
    const response = await ApiClient.patch<Author>(
      API_CONFIG.endpoints.author.update(id),
      { mode: 'private', data }
    );
    if (response.success && response.data) return response.data;
    return null;
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await ApiClient.delete<null>(
      API_CONFIG.endpoints.author.delete(id),
      { mode: 'private' }
    );
    return response.success;
  },
};