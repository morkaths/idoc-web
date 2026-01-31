import { API_CONFIG } from '@/config/api';
import type { Role, FindParams, Pagination } from '../types';
import * as ApiRequest from './config';

export const RoleApi = {
  find: async (params?: FindParams): Promise<{ data: Role[]; pagination?: Pagination }> => {
    const response = await ApiRequest.apiGet<Role[]>(
      API_CONFIG.endpoints.role.find,
      { params }
    );
    return {
      data: response.data ?? [],
      pagination: response.pagination
    };
  },

  findById: async (id: string): Promise<Role | null> => {
    const response = await ApiRequest.apiGet<Role>(
      API_CONFIG.endpoints.role.findById(id)
    );
    if (response.success && response.data) return response.data;
    return null;
  },

  create: async (data: Partial<Role>): Promise<Role | null> => {
    const response = await ApiRequest.apiPost<Role>(
      API_CONFIG.endpoints.role.create,
      { data }
    );
    if (response.success && response.data) return response.data;
    return null;
  },

  update: async (id: string, data: Partial<Role>): Promise<Role | null> => {
    const response = await ApiRequest.apiPatch<Role>(
      API_CONFIG.endpoints.role.update(id),
      { data }
    );
    if (response.success && response.data) return response.data;
    return null;
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await ApiRequest.apiDelete<null>(
      API_CONFIG.endpoints.role.delete(id)
    );
    return response.success;
  },
};
