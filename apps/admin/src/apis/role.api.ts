import { ApiEndpoint } from '@/config/api';
import type { RoleResponse, RoleRequest } from '../types';
import { apiFactory } from './factory';

export const RoleApi = apiFactory<RoleResponse, RoleRequest>(ApiEndpoint.endpoints.roles, 'Role');
