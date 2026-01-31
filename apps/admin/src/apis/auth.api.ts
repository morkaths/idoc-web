import { API_CONFIG } from '@/config/api';
import type { AuthenticationResponse, User } from '../types';
import * as ApiRequest from './config';

export const AuthApi = {
  login: async (data: { identifier: string; password: string }): Promise<AuthenticationResponse | null> => {
    const response = await ApiRequest.apiPost<AuthenticationResponse>(
      API_CONFIG.endpoints.auth.login,
      { mode: 'public', data }
    );
    return (response.success && response.data) ? response.data : null;
  },

  register: async (data: Partial<User>): Promise<AuthenticationResponse | null> => {
    const response = await ApiRequest.apiPost<AuthenticationResponse>(
      API_CONFIG.endpoints.auth.register,
      { mode: 'public', data }
    );
    return (response.success && response.data) ? response.data : null;
  },

  verify: async (data: { token: string }): Promise<User | null> => {
    const response = await ApiRequest.apiPost<User>(
      API_CONFIG.endpoints.auth.verify,
      { mode: 'public', data }
    );
    return (response.success && response.data) ? response.data : null;
  },

  refresh: async (refreshToken: string): Promise<AuthenticationResponse | null> => {
    const response = await ApiRequest.apiPost<AuthenticationResponse>(
      API_CONFIG.endpoints.auth.refresh,
      { mode: 'public', data: { refreshToken } }
    );
    return (response.success && response.data) ? response.data : null;
  },

  logout: async (): Promise<boolean> => {
    const response = await ApiRequest.apiPost<{ success: boolean }>(
      API_CONFIG.endpoints.auth.logout,
      { mode: 'private' }
    );
    return response.success || false;
  },

  update: async (data: Partial<User>): Promise<User | null> => {
    const response = await ApiRequest.apiPatch<User>(
      API_CONFIG.endpoints.auth.update,
      { mode: 'private', data }
    );
    return (response.success && response.data) ? response.data : null;
  }
};