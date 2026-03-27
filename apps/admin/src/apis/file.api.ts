import axios from 'axios';
import { ApiEndpoint } from '@/config/api';
import { ApiClient } from './config';
import type { FileResponse, FileRequest, FindParams, Pagination } from '@/types';
import { apiFactory } from './factory';

const factory = apiFactory<FileResponse, FileRequest>(
  ApiEndpoint.endpoints.files,
  'File',
  { find: 'private', findById: 'private', delete: 'private' }
);

export const FileApi = {
  ...factory,

  findByUser: async (params?: FindParams): Promise<{ data: FileResponse[]; pagination?: Pagination }> => {
    const response = await ApiClient.get<FileResponse[]>(
      ApiEndpoint.endpoints.files.findByUser,
      { security: 'private', params }
    );
    return {
      data: response.data ?? [],
      pagination: response.pagination
    };
  },

  upload: async (url: string, file: File): Promise<boolean> => {
    try {
      const res = await axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
      });
      return res.status >= 200 && res.status < 300;
    } catch {
      return false;
    }
  },

  uploadPresigned: async (filename: string, mimetype: string, folder?: string): Promise<{ url: string; objectname: string }> => {
    const response = await ApiClient.post<{ url: string; objectname: string }>(
      ApiEndpoint.endpoints.files.uploadPresigned,
      {
        security: 'private',
        data: { filename, mimetype, folder }
      }
    );
    if (response.success && response.data) return {
      url: response.data.url,
      objectname: response.data.objectname
    };
    throw new Error('Failed to get upload URL');
  },

  completePresignedUpload: async (objectname: string): Promise<FileResponse> => {
    const response = await ApiClient.post<FileResponse>(
      ApiEndpoint.endpoints.files.completePresignedUpload,
      {
        security: 'private',
        data: { objectname }
      }
    );
    if (response.success && response.data) return response.data;
    throw new Error('Failed to complete upload');
  },

  download: async (id: string): Promise<Blob> => {
    const response = await ApiClient.get(
      ApiEndpoint.endpoints.files.download(id),
      { security: 'private', responseType: 'blob' }
    );
    return response.data as Blob;
  },
};