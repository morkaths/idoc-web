import type { User } from './index';

// ═══════════════════════════════════════════════════════════════════════════════
// API TYPES: Xử lý phản hồi API
// ═══════════════════════════════════════════════════════════════════════════════

export interface Pagination {
  total: number; // Tổng số item (bản ghi) trong toàn bộ dữ liệu
  limit: number; // Số item trên mỗi trang (page size)
  page: number; // Trang hiện tại (bắt đầu từ 1)
  pages: number; // Tổng số trang (tính từ total/limit)
}

export interface FindParams {
  page?: number;
  limit?: number;
  query?: string;
  sorts?: Record<string, string>[];
  [key: string]: unknown;
}

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
