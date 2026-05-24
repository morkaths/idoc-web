import axios from 'axios';
import { ApiEndpoint } from '@/config/api';
import type {
  FileResponse,
  FileRequest,
  PresignedUploadResponse,
  PresignedUploadRequest,
  StorageUsageResponse,
  ApiResponse,
} from '@/types';
import { ApiClient } from './config';
import { apiFactory } from './factory';

const factory = apiFactory<FileResponse, FileRequest>(ApiEndpoint.endpoints.files, {
  find: 'private',
  findById: 'private',
  delete: 'private',
});

export const FileApi = {
  ...factory,

  upload: async (file: File, folder: string = 'general'): Promise<ApiResponse<FileResponse>> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return ApiClient.post<FileResponse>(ApiEndpoint.endpoints.files.upload(), {
      security: 'private',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  uploadPresigned: async (
    request: PresignedUploadRequest
  ): Promise<ApiResponse<PresignedUploadResponse>> => {
    return ApiClient.post<PresignedUploadResponse>(ApiEndpoint.endpoints.files.uploadPresigned(), {
      security: 'private',
      data: request,
    });
  },

  uploadToPresignedUrl: async (url: string, file: File, contentType?: string): Promise<boolean> => {
    try {
      const cleanAxios = axios.create();
      const res = await cleanAxios.put(url, file, {
        headers: {
          'Content-Type': contentType || file.type || 'application/octet-stream',
        },
      });
      return res.status >= 200 && res.status < 300;
    } catch {
      return false;
    }
  },

  completePresignedUpload: async (uploadId: string): Promise<ApiResponse<FileResponse>> => {
    return ApiClient.post<FileResponse>(
      ApiEndpoint.endpoints.files.completePresignedUpload(uploadId),
      {
        security: 'private',
      }
    );
  },

  download: async (id: string): Promise<Blob> => {
    return ApiClient.get<Blob>(ApiEndpoint.endpoints.files.download(id), {
      security: 'private',
      responseType: 'blob',
    }) as unknown as Promise<Blob>;
  },

  getStorageUsage: async (): Promise<ApiResponse<StorageUsageResponse>> => {
    return ApiClient.get<StorageUsageResponse>(
      ApiEndpoint.endpoints.files.storageUsage(),
      { security: 'private' }
    );
  },
};
