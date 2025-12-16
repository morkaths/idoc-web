import { API_CONFIG } from '@/config/api';
import type { Author, FindParams, Pagination } from '../types';
import * as ApiRequest from './config';

export const AuthorApi = {
  find: async (params?: FindParams): Promise<{ data: Author[]; pagination?: Pagination }> => {
    const response = await ApiRequest.apiGet<Author[]>(
      API_CONFIG.endpoints.author.find,
      { mode: 'public', params }
    );
    return {
      data: response.data ?? [],
      pagination: response.pagination
    };
  },

  findById: async (id: string): Promise<Author | null> => {
    const response = await ApiRequest.apiGet<Author>(
      API_CONFIG.endpoints.author.findById(id),
      { mode: 'public' }
    );
    if (response.success && response.data) return response.data;
    return null;
  },

  create: async (data: Partial<Author>): Promise<Author | null> => {
    const response = await ApiRequest.apiPost<Author>(
      API_CONFIG.endpoints.author.create,
      { mode: 'private', data }
    );
    if (response.success && response.data) return response.data;
    return null;
  },

  update: async (id: string, data: Partial<Author>): Promise<Author | null> => {
    const response = await ApiRequest.apiPatch<Author>(
      API_CONFIG.endpoints.author.update(id),
      { mode: 'private', data }
    );
    if (response.success && response.data) return response.data;
    return null;
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await ApiRequest.apiDelete<null>(
      API_CONFIG.endpoints.author.delete(id),
      { mode: 'private' }
    );
    return response.success;
  },
};