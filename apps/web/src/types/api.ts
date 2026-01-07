import type { Pagination, User } from './index';

// ═══════════════════════════════════════════════════════════════════════════════
// API TYPES: Xử lý phản hồi API
// ═══════════════════════════════════════════════════════════════════════════════

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: Pagination;
  statusCode?: number;
}

export interface ApiError {
  message: string;
  errors?: string[];
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: string[];
  statusCode: number;
}

export interface AuthenticationResponse {
  user: User;
  token: AuthToken;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  authenticated: boolean;
}
