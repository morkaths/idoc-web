import { ApiEndpoint } from '@/config/api';
import type { FolderRequest, FolderResponse, ApiResponse, PageResponse, PageParams } from '../types';
import { ApiClient } from './config';
import { apiFactory } from './factory';

const factory = apiFactory<FolderResponse, FolderRequest>(
  ApiEndpoint.endpoints.folders
);

export const FolderApi = {
  ...factory,
  findMe: async (params?: PageParams): Promise<ApiResponse<PageResponse<FolderResponse>>> => {
    return ApiClient.get<PageResponse<FolderResponse>>(ApiEndpoint.endpoints.folders.me, {
      security: 'private',
      params,
    });
  },
};

