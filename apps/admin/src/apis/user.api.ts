import { API_CONFIG } from '@/config/api';
import type { User, FindParams, Pagination } from '../types';
import { ApiClient } from './config';

export const UserApi = {
  find: async (params?: FindParams): Promise<{ data: User[]; pagination?: Pagination }> => {
    const response = await ApiClient.get<User[]>(
      API_CONFIG.endpoints.user.find,
      { params }
    );
    return {
      data: response.data ?? [],
      pagination: response.pagination
    };
  },

  findById: async (id: string): Promise<User | null> => {
    const response = await ApiClient.get<User>(
      API_CONFIG.endpoints.user.findById(id)
    );
    if (response.success && response.data) return response.data;
    return null;
  },

  create: async (data: Partial<User>): Promise<User | null> => {
    const response = await ApiClient.post<User>(
      API_CONFIG.endpoints.user.create,
      { data }
    );
    if (response.success && response.data) return response.data;
    return null;
  },

  update: async (id: string, data: Partial<User>): Promise<User | null> => {
    const response = await ApiClient.patch<User>(
      API_CONFIG.endpoints.user.update(id),
      { data }
    );
    if (response.success && response.data) return response.data;
    return null;
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await ApiClient.delete<null>(
      API_CONFIG.endpoints.user.delete(id)
    );
    return response.success;
  },
};
