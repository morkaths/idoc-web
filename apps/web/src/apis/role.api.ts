import { API_CONFIG } from '@/config/api';
import type { RoleResponse, RoleRequest } from '../types';
import { apiFactory } from './factory';

export const RoleApi = apiFactory<RoleResponse, RoleRequest>(
  API_CONFIG.endpoints.roles,
  'Role'
);
