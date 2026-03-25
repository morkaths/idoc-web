import axios from 'axios';
import { API_CONFIG } from '@/config/api';
import { ApiClient } from './config';
import type { File as IFile, FindParams, Pagination } from '@/types';

export const FileApi = {
    find: async (params?: FindParams): Promise<{ data: IFile[]; pagination?: Pagination }> => {
        const response = await ApiClient.get<IFile[]>(
            API_CONFIG.endpoints.file.find,
            { mode: 'private', params }
        );
        return {
            data: response.data ?? [],
            pagination: response.pagination
        };
    },

    findByUser: async (params?: FindParams): Promise<{ data: IFile[]; pagination?: Pagination }> => {
        const response = await ApiClient.get<IFile[]>(
            API_CONFIG.endpoints.file.findByUser,
            { mode: 'private', params }
        );
        return {
            data: response.data ?? [],
            pagination: response.pagination
        };
    },

    findById: async (id: string): Promise<IFile> => {
        const response = await ApiClient.get<IFile>(
            API_CONFIG.endpoints.file.findById(id),
            { mode: 'private' }
        );
        if (response.success && response.data) return response.data;
        throw new Error('File not found');
    },

    upload: async (url: string, file: File): Promise<boolean> => {
        try {
            const res = await axios.put(url, file, {
                headers: {
                    "Content-Type": file.type,
                },
            });
            return res.status === 200;
        } catch {
            return false;
        }
    },

    uploadPresigned: async (filename: string, type: string, folder?: string): Promise<{ url: string; key: string }> => {
        const response = await ApiClient.post<{ url: string; key: string }>(
            API_CONFIG.endpoints.file.uploadPresigned,
            {
                mode: 'private',
                data: { filename, type, folder }
            }
        );
        if (response.success && response.data) return {
            url: response.data.url,
            key: response.data.key
        };
        throw new Error('Failed to get upload URL');
    },

    completePresignedUpload: async (key: string): Promise<IFile> => {
        const response = await ApiClient.post<IFile>(
            API_CONFIG.endpoints.file.completePresignedUpload,
            {
                mode: 'private',
                data: { key }
            }
        );
        if (response.success && response.data) return response.data;
        throw new Error('Failed to complete upload');
    },

    download: async (id: string): Promise<Blob> => {
        const response = await ApiClient.get(
            API_CONFIG.endpoints.file.download(id),
            { mode: 'private', responseType: 'blob' }
        );
        return response.data as Blob;
    },

    delete: async (id: string): Promise<boolean> => {
        const response = await ApiClient.delete<null>(
            API_CONFIG.endpoints.file.delete(id),
            { mode: 'private' }
        );
        return response.success;
    },
};