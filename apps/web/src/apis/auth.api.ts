import { API_CONFIG } from '@/config/api';
import type { AuthenticationResponse, User, UserRequest } from '../types';
import { ApiClient } from './config';

export const AuthApi = {
  login: async (data: { identifier: string; password: string }): Promise<AuthenticationResponse | null> => {
    const response = await ApiClient.post<AuthenticationResponse>(
      API_CONFIG.endpoints.auth.login,
      { mode: 'public', data }
    );
    return (response.success && response.data) ? response.data : null;
  },

  loginGoogle: async (idToken: string): Promise<AuthenticationResponse | null> => {
    const response = await ApiClient.post<AuthenticationResponse>(
      API_CONFIG.endpoints.auth.loginGoogle,
      { mode: "public", data: { idToken } }
    );
    return (response.success && response.data) ? response.data : null;
  },

  register: async (data: Partial<UserRequest>): Promise<AuthenticationResponse | null> => {
    const response = await ApiClient.post<AuthenticationResponse>(
      API_CONFIG.endpoints.auth.register,
      { mode: 'public', data }
    );
    return (response.success && response.data) ? response.data : null;
  },

  verify: async (data: { token: string }): Promise<User | null> => {
    const response = await ApiClient.post<User>(
      API_CONFIG.endpoints.auth.verify,
      { mode: 'public', data }
    );
    return (response.success && response.data) ? response.data : null;
  },

  refresh: async (refreshToken: string): Promise<AuthenticationResponse | null> => {
    const response = await ApiClient.post<AuthenticationResponse>(
      API_CONFIG.endpoints.auth.refresh,
      { mode: 'public', data: { refreshToken } }
    );
    return (response.success && response.data) ? response.data : null;
  },

  logout: async (): Promise<boolean> => {
    const response = await ApiClient.post<{ success: boolean }>(
      API_CONFIG.endpoints.auth.logout,
      { mode: 'private' }
    );
    return response.success || false;
  },

  update: async (data: Partial<User>): Promise<User | null> => {
    const response = await ApiClient.patch<User>(
      API_CONFIG.endpoints.auth.update,
      { mode: 'private', data }
    );
    return (response.success && response.data) ? response.data : null;
  }
};