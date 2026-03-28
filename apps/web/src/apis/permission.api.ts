import { API_CONFIG } from '@/config/api';
import type { PermissionResponse, PermissionRequest, FindParams, Pagination } from '../types';
import { ApiClient } from './config';

export const PermissionApi = {
  find: async (
    params?: FindParams
  ): Promise<{ data: PermissionResponse[]; pagination?: Pagination }> => {
    const response = await ApiClient.get<PermissionResponse[]>(
      API_CONFIG.endpoints.permission.find,
      { params }
    );
    return {
      data: response.data ?? [],
      pagination: response.pagination,
    };
  },

  findById: async (id: string): Promise<PermissionResponse> => {
    const response = await ApiClient.get<PermissionResponse>(
      API_CONFIG.endpoints.permission.findById(id)
    );
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Permission not found');
  },

  create: async (data: PermissionRequest): Promise<PermissionResponse> => {
    const response = await ApiClient.post<PermissionResponse>(
      API_CONFIG.endpoints.permission.create,
      { data }
    );
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to create permission');
  },

  update: async (id: string, data: Partial<PermissionRequest>): Promise<PermissionResponse> => {
    const response = await ApiClient.patch<PermissionResponse>(
      API_CONFIG.endpoints.permission.update(id),
      { data }
    );
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to update permission');
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await ApiClient.delete<null>(API_CONFIG.endpoints.permission.delete(id));
    return response.success;
  },
};
