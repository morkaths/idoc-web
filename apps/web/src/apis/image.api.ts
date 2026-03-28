import { API_CONFIG } from '@/config/api';
import { ApiClient } from './config';

export const ImageApi = {
  upload: async (file: File, folder: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    const response = await ApiClient.post<{ url: string }>(API_CONFIG.endpoints.image.upload, {
      mode: 'private',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (response.success && response.data) return response.data.url;
    throw new Error('Failed to upload image');
  },

  delete: async (url: string): Promise<boolean> => {
    const response = await ApiClient.delete<null>(API_CONFIG.endpoints.image.delete(url), {
      mode: 'private',
    });
    return response.success;
  },
};
