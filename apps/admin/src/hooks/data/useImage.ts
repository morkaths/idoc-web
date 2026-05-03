import { ImageApi } from '@/apis/image.api';
import { useDeleteMutation, useCreateMutation, type DeleteMutationOptions, type CreateMutationOptions } from './factory';

export const useUploadImage = (options?: CreateMutationOptions<{ file: File; folder: string }, string>) => {
  return useCreateMutation(
    ({ file, folder }) => ImageApi.upload(file, folder),
    [['images']],
    options
  );
};

export const useDeleteImage = (options?: DeleteMutationOptions) => {
  return useDeleteMutation(
    (url: string) => ImageApi.delete(url),
    [['images']],
    options
  );
};

