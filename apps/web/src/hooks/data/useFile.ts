import { useQuery, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';
import type { FileResponse, FindParams, PageParams } from '@/types';
import { FileApi } from '@/apis/file.api';
import {
  useListQuery,
  useItemQuery,
  useCreateMutation,
  useDeleteMutation,
  type ListQueryOptions,
  type ItemQueryOptions,
  type CreateMutationOptions,
  type DeleteMutationOptions,
} from './factory';

/**
 * Hook to fetch files with pagination
 * @param params Pagination parameters
 * @param options Query options
 */
export const useFiles = (params: PageParams = {}, options?: ListQueryOptions<FileResponse>) => {
  return useListQuery<FileResponse>(['files', params], () => FileApi.find(params), options);
};

/**
 * Hook to fetch files for the current user
 * @param params Pagination parameters
 * @param options Query options
 */
export const useUserFiles = (params: PageParams = {}, options?: ListQueryOptions<FileResponse>) => {
  return useListQuery<FileResponse>(
    ['files', 'user', params],
    () => FileApi.findByUser(params),
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
export const useFile = (id: string, options?: ItemQueryOptions<FileResponse>) => {
  return useItemQuery<FileResponse>(['files', id], () => FileApi.findById(id), {
    enabled: !!id,
    ...options,
  });
};

/**
 * Hook to upload a file
 * @param options Mutation options
 */
export const useUploadFile = <TContext = unknown>(
  options?: CreateMutationOptions<{ file: File; folder?: string }, FileResponse, TContext>
) => {
  return useCreateMutation<{ file: File; folder?: string }, FileResponse, TContext>(
    ({ file, folder }) => FileApi.upload(file, folder),
    [['files']],
    options
  );
};

/**
 * Resolves mime type from file name if file type is empty
 * @param fileName File name
 */
const getMimeType = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'epub':
      return 'application/epub+zip';
    case 'pdf':
      return 'application/pdf';
    case 'mobi':
      return 'application/x-mobipocket-ebook';
    case 'azw3':
      return 'application/vnd.amazon.mobi8-ebook';
    case 'txt':
      return 'text/plain';
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'gif':
      return 'image/gif';
    case 'svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
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
      const contentType = file.type || getMimeType(file.name);
      const result = await FileApi.uploadPresigned({
        fileName: file.name,
        contentType,
        folder,
      });

      if (!result.success || !result.data) {
        throw new Error(result.message || 'Presigned upload failed');
      }

      const success = await FileApi.uploadToPresignedUrl(result.data.uploadUrl, file, contentType);
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
export const useDeleteFile = <TContext = unknown>(options?: DeleteMutationOptions<TContext>) => {
  return useDeleteMutation<TContext>((id) => FileApi.delete(id), [['files']], options);
};

/**
 * Hook to get a viewable URL for a file
 * @param id File ID
 * @param ticket Security ticket
 * @param options Query options
 */
export const useViewUrl = (
  id: string,
  ticket: string,
  options?: Omit<UseQueryOptions<string, Error, string, QueryKey>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<string, Error, string, QueryKey>({
    queryKey: ['files', 'view', id, ticket],
    queryFn: () => FileApi.getViewUrl(id, ticket),
    enabled: !!id && !!ticket,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};
