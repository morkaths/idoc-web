import { API_CONFIG } from '@/config/api';
import type { FolderRequest, FolderResponse } from '../types';
import { apiFactory } from './factory';

export const FolderApi = apiFactory<FolderResponse, FolderRequest>(
  API_CONFIG.endpoints.folders
);
