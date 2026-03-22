import { API_CONFIG } from '@/config/api';
import type { Category, CategoryRequest, FindParams, Pagination } from '../types';
import { ApiClient } from './config';

export const CategoryApi = {
  find: async (params?: FindParams): Promise<{ data: Category[]; pagination?: Pagination }> => {
    const response = await ApiClient.get<Category[]>(
      API_CONFIG.endpoints.category.find,
      { mode: 'public', params }
    );
    return {
      data: response.data ?? [],
      pagination: response.pagination
    };
  },

  findById: async (id: string): Promise<Category> => {
    const response = await ApiClient.get<Category>(
      API_CONFIG.endpoints.category.findById(id),
      { mode: 'public', }
    );
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Category not found');
  },

  create: async (data: CategoryRequest): Promise<Category> => {
    const response = await ApiClient.post<Category>(
      API_CONFIG.endpoints.category.create,
      { mode: 'private', data, }
    );
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to create category');
  },

  update: async (id: string, data: Partial<CategoryRequest>): Promise<Category> => {
    const response = await ApiClient.patch<Category>(
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
