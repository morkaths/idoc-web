import axios from 'axios';
import { API_CONFIG } from '@/config/api';
import { ApiClient } from './config';
import type { FileMeta, FindParams, Pagination } from '../types';

export const FileApi = {
    find: async (params?: FindParams): Promise<{ data: FileMeta[]; pagination?: Pagination }> => {
        const response = await ApiClient.get<FileMeta[]>(
            API_CONFIG.endpoints.file.find,
            { mode: 'private', params }
        );
        return {
            data: response.data ?? [],
            pagination: response.pagination
        };
    },

    findByUser: async (params?: FindParams): Promise<{ data: FileMeta[]; pagination?: Pagination }> => {
        const response = await ApiClient.get<FileMeta[]>(
            API_CONFIG.endpoints.file.findByUser,
            { mode: 'private', params }
        );
        return {
            data: response.data ?? [],
            pagination: response.pagination
        };
    },

    findByKey: async (key: string): Promise<FileMeta> => {
        const response = await ApiClient.get<FileMeta>(
            API_CONFIG.endpoints.file.findByKey(key),
            { mode: 'private' }
        );
        if (response.success && response.data) return response.data;
        throw new Error('File not found');
    },

    getUploadUrl: async (filename: string, type: string, folder?: string): Promise<{ url: string; key: string }> => {
        const response = await ApiClient.post<{ url: string; key: string }>(
            API_CONFIG.endpoints.file.upload,
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

    confirm: async (key: string): Promise<FileMeta> => {
        const response = await ApiClient.post<FileMeta>(
            API_CONFIG.endpoints.file.confirm,
            {
                mode: 'private',
                data: { key }
            }
        );
        if (response.success && response.data) return response.data;
        throw new Error('Failed to confirm upload');
    },

    download: async (key: string): Promise<Blob> => {
        const response = await ApiClient.get(
            API_CONFIG.endpoints.file.download(key),
            { mode: 'private', responseType: 'blob' }
        );
        return response.data as Blob;
    },

    delete: async (key: string): Promise<boolean> => {
        const response = await ApiClient.delete<null>(
            API_CONFIG.endpoints.file.delete(key),
            { mode: 'private' }
        );
        return response.success;
    },
};