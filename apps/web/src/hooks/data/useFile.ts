import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';
import { FileApi } from '@/apis/file.api';
import type { FileResponse, FindParams, ApiResponse, PageResponse } from '@/types';
import { useListQuery, useItemQuery, useDeleteMutation, type ListQueryOptions, type ItemQueryOptions, type DeleteMutationOptions } from './factory';

/**
 * Hook to fetch files with pagination
 * @param params Search/filter parameters
 * @param options Query options
 */
export const useFiles = (
    params: FindParams = {},
    options?: ListQueryOptions<FileResponse>
) => {
    return useListQuery<FileResponse>(
        ['files', params],
        () => FileApi.find(params),
        options
    );
};

/**
 * Hook to fetch files for the current user
 * @param params Search/filter parameters
 * @param options Query options
 */
export const useUserFiles = (
    params: FindParams = {},
    options?: ListQueryOptions<FileResponse>
) => {
    return useListQuery<FileResponse>(
        ['files', 'user', params],
        () => FileApi.findByUser(params),
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
    return useItemQuery<FileResponse>(
        ['files', id],
        () => FileApi.findById(id),
        {
            enabled: !!id,
            ...options,
        }
    );
};

/**
 * Hook to upload a file
 */
export const useUploadFile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ file, folder }: { file: File; folder?: string }) => {
            return await FileApi.upload(file, folder);
        },
        onSuccess: (response) => {
            if (response.success) {
                queryClient.invalidateQueries({ queryKey: ['files'] });
            }
        },
    });
};

/**
 * Hook to upload a file using presigned URL
 */
export const useUploadPresignedFile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ file, folder }: { file: File; folder?: string }) => {
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
        onSuccess: (response) => {
            if (response.success) {
                queryClient.invalidateQueries({ queryKey: ['files'] });
            }
        },
    });
};

/**
 * Hook to delete a file
 * @param options Mutation options
 */
export const useDeleteFile = (options?: DeleteMutationOptions) => {
    return useDeleteMutation(
        (id) => FileApi.delete(id),
        [['files']],
        options
    );
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

