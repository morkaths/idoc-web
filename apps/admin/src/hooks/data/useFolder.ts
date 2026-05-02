import { FolderApi } from '@/apis/folder.api';
import type { FolderResponse, FolderRequest, FindParams } from '@/types';
import {
  useListQuery,
  useItemQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  type ListQueryOptions,
  type ItemQueryOptions,
  type CreateMutationOptions,
  type UpdateMutationOptions,
  type DeleteMutationOptions,
} from './factory';

export const useFolders = (
  params: FindParams = {},
  options?: ListQueryOptions<FolderResponse>
) => {
  return useListQuery(
    ['folders', params],
    () => FolderApi.find(params),
    options
  );
};

export const useFolder = (
  id: string,
  options?: ItemQueryOptions<FolderResponse>
) => {
  return useItemQuery(
    ['folders', id],
    () => FolderApi.findById(id),
    {
      enabled: !!id,
      ...options,
    }
  );
};

export const useCreateFolder = (
  options?: CreateMutationOptions<FolderRequest, FolderResponse>
) => {
  return useCreateMutation(
    (data) => FolderApi.create(data),
    [['folders']],
    options
  );
};

export const useUpdateFolder = (
  options?: UpdateMutationOptions<FolderRequest, FolderResponse>
) => {
  return useUpdateMutation(
    ({ id, data }) => FolderApi.update(id, data),
    (variables) => [['folders', variables.id], ['folders']],
    options
  );
};

export const useDeleteFolder = (
  options?: DeleteMutationOptions
) => {
  return useDeleteMutation(
    (id) => FolderApi.delete(id),
    [['folders']],
    options
  );
};

