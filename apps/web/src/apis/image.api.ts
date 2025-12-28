import { API_CONFIG } from '@/config/api';
import * as ApiRequest from './config';

export const ImageApi = {
    upload: async (file: File, folder: string): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);
        const response = await ApiRequest.apiPost<{ url: string }>(
            API_CONFIG.endpoints.image.upload,
            {
                mode: 'private',
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            }
        );
        if (response.success && response.data) return response.data.url;
        throw new Error('Failed to upload image');
    },

    delete: async (url: string): Promise<boolean> => {
        const response = await ApiRequest.apiDelete<null>(
            API_CONFIG.endpoints.image.delete,
            { mode: 'private', data: { url } }
        );
        return response.success;
    }
};