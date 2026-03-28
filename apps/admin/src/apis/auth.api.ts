import { ApiEndpoint } from '@/config/api';
import type { AuthenticationResponse, UserResponse, UserRequest } from '../types';
import { ApiClient } from './config';

export const AuthApi = {
  register: async (data: Partial<UserRequest>): Promise<AuthenticationResponse> => {
    const response = await ApiClient.post<AuthenticationResponse>(
      ApiEndpoint.endpoints.auth.register,
      { security: 'public', data }
    );
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Registration failed');
  },

  login: async (data: {
    identifier: string;
    password: string;
  }): Promise<AuthenticationResponse> => {
    const response = await ApiClient.post<AuthenticationResponse>(
      ApiEndpoint.endpoints.auth.login,
      { security: 'public', data }
    );
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Login failed');
  },

  refresh: async (refreshToken: string): Promise<AuthenticationResponse> => {
    const response = await ApiClient.post<AuthenticationResponse>(
      ApiEndpoint.endpoints.auth.refresh,
      { security: 'public', data: { refreshToken } }
    );
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Refresh token failed');
  },

  logout: async (): Promise<boolean> => {
    const response = await ApiClient.post<{ success: boolean }>(ApiEndpoint.endpoints.auth.logout, {
      security: 'private',
    });
    return response.success;
  },

  verify: async (data: { token: string }): Promise<UserResponse> => {
    const response = await ApiClient.post<UserResponse>(ApiEndpoint.endpoints.auth.verify, {
      security: 'public',
      data,
    });
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Verify email failed');
  },

  resend: async (data: { email: string }): Promise<boolean> => {
    const response = await ApiClient.post<{ success: boolean }>(ApiEndpoint.endpoints.auth.resend, {
      security: 'public',
      data,
    });
    return response.success;
  },

  changePassword: async (data: { oldPassword: string; newPassword: string }): Promise<boolean> => {
    const response = await ApiClient.post<{ success: boolean }>(
      ApiEndpoint.endpoints.auth.changePassword,
      {
        security: 'private',
        data,
      }
    );
    return response.success;
  },

  forgotPassword: async (data: { email: string }): Promise<boolean> => {
    const response = await ApiClient.post<{ success: boolean }>(
      ApiEndpoint.endpoints.auth.forgotPassword,
      {
        security: 'public',
        data,
      }
    );
    return response.success;
  },

  resetPassword: async (data: { token: string; newPassword: string }): Promise<boolean> => {
    const response = await ApiClient.post<{ success: boolean }>(
      ApiEndpoint.endpoints.auth.resetPassword,
      {
        security: 'public',
        data,
      }
    );
    return response.success;
  },
};
