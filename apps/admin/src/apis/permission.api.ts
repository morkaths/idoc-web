import { ApiEndpoint } from '@/config/api';
import type { Permission, PermissionRequest } from '../types';
import { apiFactory } from './factory';

export const PermissionApi = apiFactory<Permission, PermissionRequest>(
  ApiEndpoint.endpoints.permissions,
  'Permission'
);
