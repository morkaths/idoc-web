import { ApiEndpoint } from '@/config/api';
import type { ApiResponse } from '../types';
import { ApiClient } from './config';

export const ImageApi = {
  upload: async (file: File, folder: string): Promise<ApiResponse<string>> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return ApiClient.post<string>(
      ApiEndpoint.endpoints.images.upload(),
      {
        security: 'private',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  },

  delete: async (url: string): Promise<ApiResponse<void>> => {
    return ApiClient.delete<void>(
      ApiEndpoint.endpoints.images.delete(url),
      {
        security: 'private',
      }
    );
  },

};
