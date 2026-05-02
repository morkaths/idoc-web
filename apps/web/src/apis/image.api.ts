import { API_CONFIG } from '@/config/api';
import type { ApiResponse } from '../types';
import { ApiClient } from './config';

export const ImageApi = {
  upload: async (file: File, folder: string): Promise<ApiResponse<string>> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return ApiClient.post<string>(API_CONFIG.endpoints.images.upload, {
      security: 'private',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  delete: async (url: string): Promise<ApiResponse<null>> => {
    return ApiClient.delete<null>(API_CONFIG.endpoints.images.delete(url), {
      security: 'private',
    });
  },
};
