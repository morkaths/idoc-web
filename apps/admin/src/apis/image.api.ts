import { ApiEndpoint } from '@/config/api';
import { ApiClient } from './config';

export const ImageApi = {
    upload: async (file: File, folder: string): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        const response = await ApiClient.post<{ url: string }>(
            ApiEndpoint.endpoints.images.upload,
            {
                security: 'private',
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            }
        );
        if (response.success && response.data) return response.data.url;
        throw new Error('Failed to upload image');
    },

    delete: async (url: string): Promise<boolean> => {
        const response = await ApiClient.delete<null>(
            ApiEndpoint.endpoints.images.delete(url),
            { security: 'private' }
        );
        return response.success;
    }
};