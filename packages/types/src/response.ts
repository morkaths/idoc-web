export interface PageResponse<T> {
  content: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  last: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  status: number;
  errorCode: string;
  message: string;
  path: string;
  timestamp: string;
  errors?: ValidationError[];
}

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message?: string;
  data?: T;
  timestamp: string;
  headers?: Record<string, string | string[]>;
}
