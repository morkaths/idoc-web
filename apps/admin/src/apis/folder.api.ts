import { ApiEndpoint } from '@/config/api';
import type { FolderResponse, FolderRequest } from '../types';
import { apiFactory } from './factory';

const factory = apiFactory<FolderResponse, FolderRequest>(
  ApiEndpoint.endpoints.folders,
  { find: 'public', findById: 'public' }
);

export const FolderApi = {
  ...factory,
};
