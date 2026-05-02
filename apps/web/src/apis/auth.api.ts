import { API_CONFIG } from '@/config/api';
import type {
  AuthResponse,
  UserResponse,
  UserRequest,
  ApiResponse,
  SignInRequest,
  SignUpRequest,
  VerifyEmailRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from '../types';
import { ApiClient } from './config';

export const AuthApi = {
  login: async (data: SignInRequest): Promise<ApiResponse<AuthResponse>> => {
    return ApiClient.post<AuthResponse>(API_CONFIG.endpoints.auth.login, {
      security: 'public',
      data,
    });
  },

  loginGoogle: async (data: {
    token: string;
    provider: string;
  }): Promise<ApiResponse<AuthResponse>> => {
    return ApiClient.post<AuthResponse>(API_CONFIG.endpoints.auth.loginGoogle, {
      security: 'public',
      data,
    });
  },

  register: async (data: SignUpRequest): Promise<ApiResponse<void>> => {
    return ApiClient.post<void>(API_CONFIG.endpoints.auth.register, {
      security: 'public',
      data,
    });
  },

  verify: async (data: VerifyEmailRequest): Promise<ApiResponse<void>> => {
    return ApiClient.put<void>(API_CONFIG.endpoints.auth.verify, {
      security: 'public',
      data,
    });
  },

  resend: async (email: string): Promise<ApiResponse<void>> => {
    return ApiClient.post<void>(`${API_CONFIG.endpoints.auth.resend}?email=${email}`, {
      security: 'public',
    });
  },

  refresh: async (): Promise<ApiResponse<AuthResponse>> => {
    return ApiClient.post<AuthResponse>(API_CONFIG.endpoints.auth.refresh, {
      security: 'public',
    });
  },

  logout: async (): Promise<ApiResponse<void>> => {
    return ApiClient.post<void>(API_CONFIG.endpoints.auth.logout, {
      security: 'private',
    });
  },

  forgotPassword: async (email: string): Promise<ApiResponse<void>> => {
    return ApiClient.post<void>(`${API_CONFIG.endpoints.auth.forgotPassword}?email=${email}`, {
      security: 'public',
    });
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<ApiResponse<void>> => {
    return ApiClient.post<void>(API_CONFIG.endpoints.auth.resetPassword, {
      security: 'public',
      data,
    });
  },

  changePassword: async (data: ChangePasswordRequest): Promise<ApiResponse<void>> => {
    return ApiClient.post<void>(API_CONFIG.endpoints.auth.changePassword, {
      security: 'private',
      data,
    });
  },

  update: async (data: Partial<UserRequest>): Promise<ApiResponse<UserResponse>> => {
    return ApiClient.patch<UserResponse>(API_CONFIG.endpoints.auth.update, {
      security: 'private',
      data,
    });
  },
};

