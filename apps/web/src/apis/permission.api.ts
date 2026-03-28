import { API_CONFIG } from '@/config/api';
import type { PermissionResponse, PermissionRequest } from '../types';
import { apiFactory } from './factory';

export const PermissionApi = apiFactory<PermissionResponse, PermissionRequest>(
  API_CONFIG.endpoints.permissions,
  'Permission'
);
