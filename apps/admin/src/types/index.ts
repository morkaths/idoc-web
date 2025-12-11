export * from './api';
export * from './schema';

// ───────────────────────────────────────────────────────────────────────────────
// COMMON TYPE: Các kiểu dữ liệu chung dùng trong toàn bộ hệ thống
// ───────────────────────────────────────────────────────────────────────────────
export type Language = 'vi' | 'en' | 'ja' | 'ko' | 'zh' | 'fr' | 'de' | 'es';
export enum ModeType {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}
export enum LayoutType {
  Vertical = 'vertical',
  Horizontal = 'horizontal',
}

// Phân trang
export interface Pagination {
  total: number; // Tổng số item (bản ghi) trong toàn bộ dữ liệu
  limit: number; // Số item trên mỗi trang (page size)
  page: number; // Trang hiện tại (bắt đầu từ 1)
  pages: number; // Tổng số trang (tính từ total/limit)
}

// Params cho hàm tìm kiếm
export interface FindParams {
  page?: number;
  limit?: number;
  query?: string;
  sorts?: Record<string, string>[];
  filters?: Record<string, any>[];
}

// View mode: grid, list, compact, etc.
export interface ViewModeOption {
  value: string;
  label: string;
  icon: string;
}

export interface Pronunciation {
  symbol: string;
  word: string;
  phonetic: string;
  audioSymbol: string;
  audioWord: string;
  audioWordSlow?: string;
  description?: string;
}
