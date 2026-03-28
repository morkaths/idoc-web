import axios from 'axios';
import { API_CONFIG } from '@/config/api';
import type { FileResponse as IFile, FindParams, Pagination } from '../types';
import { ApiClient } from './config';

export const FileApi = {
  find: async (params?: FindParams): Promise<{ data: IFile[]; pagination?: Pagination }> => {
    const response = await ApiClient.get<IFile[]>(API_CONFIG.endpoints.file.find, {
      mode: 'private',
      params,
    });
    return {
      data: response.data ?? [],
      pagination: response.pagination,
    };
  },

  findByUser: async (params?: FindParams): Promise<{ data: IFile[]; pagination?: Pagination }> => {
    const response = await ApiClient.get<IFile[]>(API_CONFIG.endpoints.file.findByUser, {
      mode: 'private',
      params,
    });
    return {
      data: response.data ?? [],
      pagination: response.pagination,
    };
  },

  findById: async (id: string): Promise<IFile> => {
    const response = await ApiClient.get<IFile>(API_CONFIG.endpoints.file.findById(id), {
      mode: 'private',
    });
    if (response.success && response.data) return response.data;
    throw new Error('File not found');
  },

  upload: async (url: string, file: File): Promise<boolean> => {
    try {
      const res = await axios.put(url, file, {
        headers: {
          'Content-Type': file.type,
        },
      });
      return res.status >= 200 && res.status < 300;
    } catch {
      return false;
    }
  },

  uploadPresigned: async (
    filename: string,
    mimetype: string,
    folder?: string
  ): Promise<{ url: string; objectname: string }> => {
    const response = await ApiClient.post<{ url: string; objectname: string }>(
      API_CONFIG.endpoints.file.uploadPresigned,
      {
        mode: 'private',
        data: { filename, mimetype, folder },
      }
    );
    if (response.success && response.data)
      return {
        url: response.data.url,
        objectname: response.data.objectname,
      };
    throw new Error('Failed to get upload URL');
  },

  completePresignedUpload: async (objectname: string): Promise<IFile> => {
    const response = await ApiClient.post<IFile>(
      API_CONFIG.endpoints.file.completePresignedUpload,
      {
        mode: 'private',
        data: { objectname },
      }
    );
    if (response.success && response.data) return response.data;
    throw new Error('Failed to complete upload');
  },

  download: async (id: string): Promise<Blob> => {
    const response = await ApiClient.get(API_CONFIG.endpoints.file.download(id), {
      mode: 'private',
      responseType: 'blob',
    });
    return response.data as Blob;
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await ApiClient.delete<null>(API_CONFIG.endpoints.file.delete(id), {
      mode: 'private',
    });
    return response.success;
  },

  getViewUrl: async (id: string, ticket: string): Promise<string> => {
    const response = await ApiClient.get<{ url: string }>(
      `${API_CONFIG.endpoints.file.view(id)}?ticket=${encodeURIComponent(ticket)}`,
      { mode: 'public' }
    );
    if (response.success && response.data) return response.data.url;
    throw new Error('Failed to get view URL');
  },
};
