import { API_CONFIG } from '@/config/api';
import type { UserResponse, UserRequest } from '../types';
import { apiFactory } from './factory';

export const UserApi = apiFactory<UserResponse, UserRequest>(
  API_CONFIG.endpoints.users,
  'User'
);
