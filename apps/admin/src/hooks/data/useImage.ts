import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ImageApi } from '@/apis/image.api';

export const useUploadImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, folder }: { file: File; folder: string }) => {
      return await ImageApi.upload(file, folder);
    },
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['images'] });
      }
    },
  });
};

export const useDeleteImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (url: string) => {
      return await ImageApi.delete(url);
    },
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['images'] });
      }
    },
  });
};

