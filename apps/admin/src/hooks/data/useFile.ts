import { FileApi } from '@/apis/file.api';
import type { FileResponse, FindParams, PageParams, StorageUsageResponse } from '@/types';
import {
  useListQuery,
  useItemQuery,
  useDeleteMutation,
  type ListQueryOptions,
  type ItemQueryOptions,
  type DeleteMutationOptions,
  type CreateMutationOptions,
  useCreateMutation,
} from './factory';

/**
 * Hook to fetch files with pagination
 * @param params Pagination parameters
 * @param options Query options
 */
export const useFiles = (params: PageParams = {}, options?: ListQueryOptions<FileResponse>) => {
  return useListQuery(['files', params], () => FileApi.find(params), options);
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
  return useItemQuery(['files', id], () => FileApi.findById(id), {
    enabled: !!id,
    ...options,
  });
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
 * Hook to fetch real-time storage usage from S3 and Cloudinary
 * @param options Query options
 */
export const useStorageUsage = (options?: ItemQueryOptions<StorageUsageResponse>) => {
  return useItemQuery(
    ['storage', 'usage'],
    () => FileApi.getStorageUsage(),
    { staleTime: 5 * 60 * 1000, ...options } // cache 5 min
  );
};
