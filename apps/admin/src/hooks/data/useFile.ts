import { FileApi } from '@/apis/file.api';
import type { FileResponse, FindParams } from '@/types';
import {
  useListQuery,
  useItemQuery,
  useDeleteMutation,
  type ListQueryOptions,
  type ItemQueryOptions,
  type DeleteMutationOptions,
} from './factory';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useFiles = (
  params: FindParams = {},
  options?: ListQueryOptions<FileResponse>
) => {
  return useListQuery(
    ['files', params],
    () => FileApi.find(params),
    options
  );
};

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

export const useUploadFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, folder }: { file: File; folder?: string }) => {
      return await FileApi.upload(file, folder);
    },
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['files'] });
      }
    },
  });
};

export const useUploadPresignedFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, folder }: { file: File; folder?: string }) => {
      const result = await FileApi.uploadPresigned({
        fileName: file.name,
        contentType: file.type,
        folder,
      });

      if (!result.success || !result.data) {
        throw new Error(result.message || 'Presigned upload failed');
      }

      const success = await FileApi.uploadToPresignedUrl(result.data.uploadUrl, file);
      if (!success) throw new Error('Upload to S3 failed');

      return await FileApi.completePresignedUpload(result.data.uploadId);
    },
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['files'] });
      }
    },
  });
};

export const useDeleteFile = (
  options?: DeleteMutationOptions
) => {
  return useDeleteMutation(
    (id) => FileApi.delete(id),
    [['files']],
    options
  );
};

