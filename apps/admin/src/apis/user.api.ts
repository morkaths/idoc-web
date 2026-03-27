import { ApiEndpoint } from '@/config/api';
import type { User, UserRequest } from '../types';
import { apiFactory } from './factory';

export const UserApi = apiFactory<User, UserRequest>(
  ApiEndpoint.endpoints.users,
  'User'
);
