export * from './api';
export * from './enum';
export * from './schema';

// ───────────────────────────────────────────────────────────────────────────────
// COMMON TYPE: Các kiểu dữ liệu chung dùng trong toàn bộ hệ thống
// ───────────────────────────────────────────────────────────────────────────────
// View mode: grid, list, compact, etc.
export interface ViewModeOption {
  value: string;
  label: string;
  icon: string;
}
