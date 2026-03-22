import { API_CONFIG } from '@/config/api';
import type { User, UserRequest, FindParams, Pagination } from '../types';
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

  findById: async (id: string): Promise<User> => {
    const response = await ApiClient.get<User>(
      API_CONFIG.endpoints.user.findById(id)
    );
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'User not found');
  },

  create: async (data: UserRequest): Promise<User> => {
    const response = await ApiClient.post<User>(
      API_CONFIG.endpoints.user.create,
      { data }
    );
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to create user');
  },

  update: async (id: string, data: Partial<UserRequest>): Promise<User> => {
    const response = await ApiClient.patch<User>(
      API_CONFIG.endpoints.user.update(id),
      { data }
    );
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to update user');
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await ApiClient.delete<null>(
      API_CONFIG.endpoints.user.delete(id)
    );
    return response.success;
  },
};
