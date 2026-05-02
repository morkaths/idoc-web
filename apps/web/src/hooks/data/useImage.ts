import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ImageApi } from '@/apis/image.api';
import { useDeleteMutation, type DeleteMutationOptions } from './factory';

/**
 * Hook to upload an image
 */
export const useUploadImage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ file, folder }: { file: File; folder: string }) => {
            return await ImageApi.upload(file, folder);
        },
        onSuccess: (response) => {
            if (response.success) {
                queryClient.invalidateQueries({ queryKey: ['images'] });
            }
        },
    });
};

/**
 * Hook to delete an image
 * @param options Mutation options
 */
export const useDeleteImage = (options?: DeleteMutationOptions) => {
    return useDeleteMutation(
        (url) => ImageApi.delete(url),
        [['images']],
        options
    );
};