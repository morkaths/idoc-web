import { API_CONFIG } from '@/config/api';
import type { AuthenticationResponse, UserResponse, UserRequest, ApiResponse } from '../types';
import { ApiClient } from './config';

export const AuthApi = {
  login: async (data: {
    identifier: string;
    password: string;
  }): Promise<ApiResponse<AuthenticationResponse>> => {
    return ApiClient.post<AuthenticationResponse>(API_CONFIG.endpoints.auth.login, {
      security: 'public',
      data,
    });
  },

  loginGoogle: async (credentials: string): Promise<ApiResponse<AuthenticationResponse>> => {
    return ApiClient.post<AuthenticationResponse>(
      API_CONFIG.endpoints.auth.loginGoogle,
      { security: 'public', data: { credentials } }
    );
  },

  register: async (data: Partial<UserRequest>): Promise<ApiResponse<AuthenticationResponse>> => {
    return ApiClient.post<AuthenticationResponse>(
      API_CONFIG.endpoints.auth.register,
      { security: 'public', data }
    );
  },

  verify: async (data: { token: string }): Promise<ApiResponse<UserResponse>> => {
    return ApiClient.post<UserResponse>(API_CONFIG.endpoints.auth.verify, {
      security: 'public',
      data,
    });
  },

  refresh: async (refreshToken?: string): Promise<ApiResponse<AuthenticationResponse>> => {
    return ApiClient.post<AuthenticationResponse>(
      API_CONFIG.endpoints.auth.refresh,
      { security: 'public', data: refreshToken ? { refreshToken } : undefined }
    );
  },

  logout: async (): Promise<boolean> => {
    const response = await ApiClient.post<{ success: boolean }>(API_CONFIG.endpoints.auth.logout, {
      security: 'private',
    });
    return response.success || false;
  },

  update: async (data: Partial<UserResponse>): Promise<ApiResponse<UserResponse>> => {
    return ApiClient.patch<UserResponse>(API_CONFIG.endpoints.auth.update, {
      security: 'private',
      data,
    });
  },
};
