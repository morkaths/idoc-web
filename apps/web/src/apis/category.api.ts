import { API_CONFIG } from '@/config/api';
import type { CategoryResponse, CategoryRequest, FindParams, Pagination } from '../types';
import { ApiClient } from './config';

export const CategoryApi = {
  find: async (params?: FindParams): Promise<{ data: CategoryResponse[]; pagination?: Pagination }> => {
    const response = await ApiClient.get<CategoryResponse[]>(
      API_CONFIG.endpoints.category.find,
      { mode: 'public', params }
    );
    return {
      data: response.data ?? [],
      pagination: response.pagination
    };
  },

  findById: async (id: string): Promise<CategoryResponse> => {
    const response = await ApiClient.get<CategoryResponse>(
      API_CONFIG.endpoints.category.findById(id),
      { mode: 'public', }
    );
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Category not found');
  },

  create: async (data: CategoryRequest): Promise<CategoryResponse> => {
    const response = await ApiClient.post<CategoryResponse>(
      API_CONFIG.endpoints.category.create,
      { mode: 'private', data, }
    );
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to create category');
  },

  update: async (id: string, data: Partial<CategoryRequest>): Promise<CategoryResponse> => {
    const response = await ApiClient.patch<CategoryResponse>(
      API_CONFIG.endpoints.category.update(id),
      { mode: 'private', data, }
    );
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to update category');
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await ApiClient.delete<null>(
      API_CONFIG.endpoints.category.delete(id),
      { mode: 'private' }
    );
    return response.success;
  },
};
