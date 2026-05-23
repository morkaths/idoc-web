import { FolderApi } from '@/apis/folder.api';
import type { FolderResponse, FolderRequest, FindParams, PageParams } from '@/types';
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

/**
 * Hook to fetch folders with pagination
 * @param params Pagination parameters
 * @param options Query options
 */
export const useFolders = (params: PageParams = {}, options?: ListQueryOptions<FolderResponse>) => {
  return useListQuery(['folders', params], () => FolderApi.find(params), options);
};

/**
 * Hook to search folders
 * @param params Search parameters
 * @param options Query options
 */
export const useSearchFolders = (
  params: FindParams = {},
  options?: ListQueryOptions<FolderResponse>
) => {
  return useListQuery(['folders', 'search', params], () => FolderApi.search(params), options);
};

/**
 * Hook to fetch a single folder by ID
 * @param id Folder ID
 * @param options Query options
 */
export const useFolder = (id: string, options?: ItemQueryOptions<FolderResponse>) => {
  return useItemQuery(['folders', id], () => FolderApi.findById(id), {
    enabled: !!id,
    ...options,
  });
};

/**
 * Hook to create a new folder
 * @param options Mutation options
 */
export const useCreateFolder = (options?: CreateMutationOptions<FolderRequest, FolderResponse>) => {
  return useCreateMutation((data) => FolderApi.create(data), [['folders']], options);
};

/**
 * Hook to update an existing folder
 * @param options Mutation options
 */
export const useUpdateFolder = (options?: UpdateMutationOptions<FolderRequest, FolderResponse>) => {
  return useUpdateMutation(
    ({ id, data }) => FolderApi.update(id, data),
    (variables) => [['folders', variables.id], ['folders']],
    options
  );
};

/**
 * Hook to delete a folder
 * @param options Mutation options
 */
export const useDeleteFolder = (options?: DeleteMutationOptions) => {
  return useDeleteMutation((id) => FolderApi.delete(id), [['folders']], options);
};
