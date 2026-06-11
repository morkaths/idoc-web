import axios from 'axios';
import { ApiEndpoint } from '@/config/api';
import type {
  FileResponse as IFile,
  FindParams,
  ApiResponse,
  PresignedUploadResponse,
  PresignedUploadRequest,
  PageResponse,
  FileRequest,
} from '../types';
import { ApiClient } from './config';
import { apiFactory } from './factory';

const factory = apiFactory<IFile, FileRequest>(ApiEndpoint.endpoints.files, {
  find: 'private',
  findById: 'private',
  delete: 'private',
});

export const FileApi = {
  ...factory,

  findByUser: async (params?: FindParams): Promise<ApiResponse<PageResponse<IFile>>> => {
    return ApiClient.get<PageResponse<IFile>>(ApiEndpoint.endpoints.files.findByUser(), {
      security: 'private',
      params,
    });
  },

  upload: async (file: File, folder: string = 'general'): Promise<ApiResponse<IFile>> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return ApiClient.post<IFile>(ApiEndpoint.endpoints.files.upload(), {
      security: 'private',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  completePresignedUpload: async (uploadId: string): Promise<ApiResponse<IFile>> => {
    return ApiClient.post<IFile>(ApiEndpoint.endpoints.files.completePresignedUpload(uploadId), {
      security: 'private',
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

  uploadPresigned: async (
    request: PresignedUploadRequest
  ): Promise<ApiResponse<PresignedUploadResponse>> => {
    return ApiClient.post<PresignedUploadResponse>(ApiEndpoint.endpoints.files.uploadPresigned(), {
      security: 'private',
      data: request,
    });
  },

  download: async (id: string): Promise<ApiResponse<Blob>> => {
    return ApiClient.get<Blob>(ApiEndpoint.endpoints.files.download(id), {
      security: 'private',
      responseType: 'blob',
    });
  },

  getViewUrl: (id: string, ticket: string): string => {
    return `${ApiEndpoint.meta.baseURL}${ApiEndpoint.endpoints.files.view(id)}?ticket=${encodeURIComponent(ticket)}`;
  },
};
