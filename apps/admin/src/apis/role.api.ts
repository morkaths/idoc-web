import { ApiEndpoint } from '@/config/api';
import type { Role, RoleRequest } from '../types';
import { apiFactory } from './factory';

export const RoleApi = apiFactory<Role, RoleRequest>(
  ApiEndpoint.endpoints.roles,
  'Role'
);
