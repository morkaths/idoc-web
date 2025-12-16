import { API_CONFIG } from '@/config/api';
import type { Category, FindParams, Pagination } from '../types';
import * as ApiRequest from './config';

export const CategoryApi = {
  find: async (params?: FindParams): Promise<{ data: Category[]; pagination?: Pagination }> => {
    const response = await ApiRequest.apiGet<Category[]>(
      API_CONFIG.endpoints.category.find,
      { mode: 'public', params }
    );
    return {
      data: response.data ?? [],
      pagination: response.pagination
    };
  },

  findById: async (id: string): Promise<Category | null> => {
    const response = await ApiRequest.apiGet<Category>(
      API_CONFIG.endpoints.category.findById(id),
      { mode: 'public', }
    );
    if (response.success && response.data) return response.data;
    return null;
  },

  create: async (data: Partial<Category>): Promise<Category | null> => {
    const response = await ApiRequest.apiPost<Category>(
      API_CONFIG.endpoints.category.create,
      { mode: 'private', data, }
    );
    if (response.success && response.data) return response.data;
    return null;
  },

  update: async (id: string, data: Partial<Category>): Promise<Category | null> => {
    const response = await ApiRequest.apiPatch<Category>(
      API_CONFIG.endpoints.category.update(id),
      { mode: 'private', data, }
    );
    if (response.success && response.data) return response.data;
    return null;
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await ApiRequest.apiDelete<null>(
      API_CONFIG.endpoints.category.delete(id),
      { mode: 'private' }
    );
    return response.success;
  },
};
