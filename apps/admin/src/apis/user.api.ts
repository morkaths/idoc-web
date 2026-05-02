import { ApiEndpoint } from '@/config/api';
import type { UserResponse, UserRequest } from '../types';
import { apiFactory } from './factory';

export const UserApi = apiFactory<UserResponse, UserRequest>(ApiEndpoint.endpoints.users);
