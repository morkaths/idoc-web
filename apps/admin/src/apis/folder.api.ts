import { ApiEndpoint } from '@/config/api';
import type { FolderResponse, FolderRequest } from '../types';
import { apiFactory } from './factory';

export const FolderApi = apiFactory<FolderResponse, FolderRequest>(
  ApiEndpoint.endpoints.folders,
  'Folder',
  { find: 'public', findById: 'public' }
);
