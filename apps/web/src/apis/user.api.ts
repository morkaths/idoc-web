import { ApiEndpoint } from '@/config/api';
import { ApiClient } from './config';
import type { UserResponse, UserRequest, ApiResponse } from '../types';
import { apiFactory } from './factory';

const factory = apiFactory<UserResponse, UserRequest>(
  ApiEndpoint.endpoints.users
);

export const UserApi = {
  ...factory,

  me: async (): Promise<ApiResponse<UserResponse>> => {
    return ApiClient.get<UserResponse>(ApiEndpoint.endpoints.users.me, {
      security: 'private',
    });
  },

  updateMe: async (
    data: Partial<UserRequest>
  ): Promise<ApiResponse<UserResponse>> => {
    return ApiClient.patch<UserResponse>(ApiEndpoint.endpoints.users.updateMe, {
      security: 'private',
      data,
    });
  },
};
