import { API_CONFIG } from '@/config/api';
import type { AuthorResponse, AuthorRequest, FindParams, Pagination } from '../types';
import { ApiClient } from './config';

export const AuthorApi = {
  find: async (
    params?: FindParams
  ): Promise<{ data: AuthorResponse[]; pagination?: Pagination }> => {
    const response = await ApiClient.get<AuthorResponse[]>(API_CONFIG.endpoints.author.find, {
      mode: 'public',
      params,
    });
    return {
      data: response.data ?? [],
      pagination: response.pagination,
    };
  },

  findById: async (id: string): Promise<AuthorResponse> => {
    const response = await ApiClient.get<AuthorResponse>(API_CONFIG.endpoints.author.findById(id), {
      mode: 'public',
    });
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Author not found');
  },

  create: async (data: AuthorRequest): Promise<AuthorResponse> => {
    const response = await ApiClient.post<AuthorResponse>(API_CONFIG.endpoints.author.create, {
      mode: 'private',
      data,
    });
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to create author');
  },

  update: async (id: string, data: Partial<AuthorRequest>): Promise<AuthorResponse> => {
    const response = await ApiClient.patch<AuthorResponse>(API_CONFIG.endpoints.author.update(id), {
      mode: 'private',
      data,
    });
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to update author');
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await ApiClient.delete<null>(API_CONFIG.endpoints.author.delete(id), {
      mode: 'private',
    });
    return response.success;
  },
};
