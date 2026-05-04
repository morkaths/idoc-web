import { FileApi } from '@/apis/file.api';
import type { FileResponse, FindParams, PageParams } from '@/types';
import {
  useListQuery,
  useItemQuery,
  useDeleteMutation,
  type ListQueryOptions,
  type ItemQueryOptions,
  type DeleteMutationOptions,
  CreateMutationOptions,
  useCreateMutation,
} from './factory';

/**
 * Hook to fetch files with pagination
 * @param params Pagination parameters
 * @param options Query options
 */
export const useFiles = (
  params: PageParams = {},
  options?: ListQueryOptions<FileResponse>
) => {
  return useListQuery(
    ['files', params],
    () => FileApi.find(params),
    options
  );
};

/**
 * Hook to search files
 * @param params Search parameters
 * @param options Query options
 */
export const useSearchFiles = (
  params: FindParams = {},
  options?: ListQueryOptions<FileResponse>
) => {
  return useListQuery<FileResponse>(
    ['files', 'search', params],
    () => FileApi.search(params),
    options
  );
};

/**
 * Hook to fetch a single file by ID
 * @param id File ID
 * @param options Query options
 */
export const useFile = (
  id: string,
  options?: ItemQueryOptions<FileResponse>
) => {
  return useItemQuery(
    ['files', id],
    () => FileApi.findById(id),
    {
      enabled: !!id,
      ...options,
    }
  );
};

/**
 * Hook to upload a file using presigned URL
 * @param options Mutation options
 */
export const useUploadPresignedFile = <TContext = unknown>(
  options?: CreateMutationOptions<{ file: File; folder?: string }, FileResponse, TContext>
) => {
  return useCreateMutation<{ file: File; folder?: string }, FileResponse, TContext>(
    async ({ file, folder }) => {
      const result = await FileApi.uploadPresigned({
        fileName: file.name,
        contentType: file.type,
        folder
      });

      if (!result.success || !result.data) {
        throw new Error(result.message || 'Presigned upload failed');
      }

      const success = await FileApi.uploadToPresignedUrl(result.data.uploadUrl, file);
      if (!success) throw new Error('Upload to storage failed');

      return await FileApi.completePresignedUpload(result.data.uploadId);
    },
    [['files']],
    options
  );
};

/**
 * Hook to delete a file
 * @param options Mutation options
 */
export const useDeleteFile = <TContext = unknown>(
  options?: DeleteMutationOptions<TContext>
) => {
  return useDeleteMutation<TContext>(
    (id) => FileApi.delete(id),
    [['files']],
    options
  );
};

