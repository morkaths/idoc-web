import { API_CONFIG } from '@/config/api';
import type { AuthenticationResponse, UserResponse, UserRequest } from '../types';
import { ApiClient } from './config';

export const AuthApi = {
  login: async (data: {
    identifier: string;
    password: string;
  }): Promise<AuthenticationResponse> => {
    const response = await ApiClient.post<AuthenticationResponse>(API_CONFIG.endpoints.auth.login, {
      security: 'public',
      data,
    });
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Login failed');
  },

  loginGoogle: async (credentials: string): Promise<AuthenticationResponse> => {
    const response = await ApiClient.post<AuthenticationResponse>(
      API_CONFIG.endpoints.auth.loginGoogle,
      { security: 'public', data: { credentials } }
    );
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Login with Google failed');
  },

  register: async (data: Partial<UserRequest>): Promise<AuthenticationResponse> => {
    const response = await ApiClient.post<AuthenticationResponse>(
      API_CONFIG.endpoints.auth.register,
      { security: 'public', data }
    );
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Registration failed');
  },

  verify: async (data: { token: string }): Promise<UserResponse> => {
    const response = await ApiClient.post<UserResponse>(API_CONFIG.endpoints.auth.verify, {
      security: 'public',
      data,
    });
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Verification failed');
  },

  refresh: async (refreshToken: string): Promise<AuthenticationResponse> => {
    const response = await ApiClient.post<AuthenticationResponse>(
      API_CONFIG.endpoints.auth.refresh,
      { security: 'public', data: { refreshToken } }
    );
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Refresh token failed');
  },

  logout: async (): Promise<boolean> => {
    const response = await ApiClient.post<{ success: boolean }>(API_CONFIG.endpoints.auth.logout, {
      security: 'private',
    });
    return response.success || false;
  },

  update: async (data: Partial<UserResponse>): Promise<UserResponse> => {
    const response = await ApiClient.patch<UserResponse>(API_CONFIG.endpoints.auth.update, {
      security: 'private',
      data,
    });
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'User update failed');
  },
};
