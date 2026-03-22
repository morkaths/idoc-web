import { API_CONFIG } from '@/config/api';
import type { Role, RoleRequest, FindParams, Pagination } from '../types';
import { ApiClient } from './config';

export const RoleApi = {
  find: async (params?: FindParams): Promise<{ data: Role[]; pagination?: Pagination }> => {
    const response = await ApiClient.get<Role[]>(
      API_CONFIG.endpoints.role.find,
      { params }
    );
    return {
      data: response.data ?? [],
      pagination: response.pagination
    };
  },

  findById: async (id: string): Promise<Role> => {
    const response = await ApiClient.get<Role>(
      API_CONFIG.endpoints.role.findById(id)
    );
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Role not found');
  },

  create: async (data: RoleRequest): Promise<Role> => {
    const response = await ApiClient.post<Role>(
      API_CONFIG.endpoints.role.create,
      { data }
    );
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to create role');
  },

  update: async (id: string, data: Partial<RoleRequest>): Promise<Role> => {
    const response = await ApiClient.patch<Role>(
      API_CONFIG.endpoints.role.update(id),
      { data }
    );
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to update role');
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await ApiClient.delete<null>(
      API_CONFIG.endpoints.role.delete(id)
    );
    return response.success;
  },
};
