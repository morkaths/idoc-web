import type { Pagination, User } from './index'

// ═══════════════════════════════════════════════════════════════════════════════
// API TYPES: Xử lý phản hồi API
// ═══════════════════════════════════════════════════════════════════════════════

export interface ApiResponse<T> {
  success: boolean
  message?: string
  token?: string
  user?: User
  data?: T
  pagination?: Pagination
  statusCode?: number
}

export interface ApiError {
  message: string
  errors?: string[]
}

export interface LoginResponse {
  success: true
  user: User
  token: string
  message: string
}

export interface ErrorResponse {
  success: false
  message: string
  errors?: string[]
  statusCode: number
}
