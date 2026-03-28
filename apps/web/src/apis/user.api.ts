import { API_CONFIG } from '@/config/api';
import type { UserResponse, UserRequest, FindParams, Pagination } from '../types';
import { ApiClient } from './config';

export const UserApi = {
  find: async (params?: FindParams): Promise<{ data: UserResponse[]; pagination?: Pagination }> => {
    const response = await ApiClient.get<UserResponse[]>(
      API_CONFIG.endpoints.user.find,
      { params }
    );
    return {
      data: response.data ?? [],
      pagination: response.pagination
    };
  },

  findById: async (id: string): Promise<UserResponse> => {
    const response = await ApiClient.get<UserResponse>(
      API_CONFIG.endpoints.user.findById(id)
    );
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'User not found');
  },

  create: async (data: UserRequest): Promise<UserResponse> => {
    const response = await ApiClient.post<UserResponse>(
      API_CONFIG.endpoints.user.create,
      { data }
    );
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to create user');
  },

  update: async (id: string, data: Partial<UserRequest>): Promise<UserResponse> => {
    const response = await ApiClient.patch<UserResponse>(
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
