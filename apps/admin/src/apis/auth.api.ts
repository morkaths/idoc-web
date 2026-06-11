import { ApiEndpoint } from '@/config/api';
import type { AuthResponse, UserRequest, ApiResponse } from '../types';
import { ApiClient } from './config';

export const AuthApi = {
  register: async (data: Partial<UserRequest>): Promise<ApiResponse<AuthResponse>> => {
    return ApiClient.post<AuthResponse>(ApiEndpoint.endpoints.auth.register(), {
      security: 'public',
      data,
    });
  },

  login: async (data: { email: string; password: string }): Promise<ApiResponse<AuthResponse>> => {
    return ApiClient.post<AuthResponse>(ApiEndpoint.endpoints.auth.login(), {
      security: 'public',
      data,
    });
  },

  refresh: async (): Promise<ApiResponse<AuthResponse>> => {
    return ApiClient.post<AuthResponse>(ApiEndpoint.endpoints.auth.refresh(), {
      security: 'public',
    });
  },

  logout: async (): Promise<ApiResponse<void>> => {
    return ApiClient.post<void>(ApiEndpoint.endpoints.auth.logout(), {
      security: 'private',
    });
  },

  verify: async (data: { email: string; otp: string }): Promise<ApiResponse<void>> => {
    return ApiClient.put<void>(ApiEndpoint.endpoints.auth.verify(), {
      security: 'public',
      data,
    });
  },

  resend: async (data: { email: string }): Promise<ApiResponse<void>> => {
    return ApiClient.post<void>(ApiEndpoint.endpoints.auth.resend(), {
      security: 'public',
      params: data,
    });
  },

  changePassword: async (data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<void>> => {
    return ApiClient.post<void>(ApiEndpoint.endpoints.auth.changePassword(), {
      security: 'private',
      data,
    });
  },

  forgotPassword: async (data: { email: string }): Promise<ApiResponse<void>> => {
    return ApiClient.post<void>(ApiEndpoint.endpoints.auth.forgotPassword(), {
      security: 'public',
      data,
    });
  },

  resetPassword: async (data: {
    token: string;
    newPassword: string;
  }): Promise<ApiResponse<void>> => {
    return ApiClient.post<void>(ApiEndpoint.endpoints.auth.resetPassword(), {
      security: 'public',
      data,
    });
  },
};
