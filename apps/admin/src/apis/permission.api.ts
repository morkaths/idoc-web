import { ApiEndpoint } from '@/config/api';
import type { PermissionResponse, PermissionRequest } from '../types';
import { apiFactory } from './factory';

export const PermissionApi = apiFactory<PermissionResponse, PermissionRequest>(
  ApiEndpoint.endpoints.permissions,
  'Permission'
);
