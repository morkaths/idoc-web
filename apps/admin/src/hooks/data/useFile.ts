import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';
import { FileApi } from '@/apis/file.api';
import type { FileResponse, FindParams, Pagination } from '@/types';

type PaginationResponse = { data: FileResponse[]; pagination?: Pagination };

export const useFiles = (
    params: FindParams = {},
    options?: Omit<UseQueryOptions<PaginationResponse, Error, PaginationResponse, QueryKey>, 'queryKey' | 'queryFn'>
) => {
    const query = useQuery<PaginationResponse, Error, PaginationResponse, QueryKey>({
        queryKey: ['files', params],
        queryFn: () => FileApi.find(params),
        enabled: true,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
        ...options,
    });

    return {
        ...query,
        data: {
            data: query.data?.data || [],
            pagination: query.data?.pagination,
        },
    };
};

export const useFile = (id: string) => {
    const query = useQuery({
        queryKey: ['files', id],
        queryFn: () => FileApi.findById(id),
        enabled: !!id,
        staleTime: 10 * 60 * 1000,
    });

    return {
        ...query,
        data: query.data || null,
    };
};

export const useUploadPresignedFile = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ file, folder }: { file: File; folder?: string }) => {
            const { url, objectname } = await FileApi.uploadPresigned(file.name, file.type, folder);
            const success = await FileApi.upload(url, file);
            if (!success) throw new Error('Upload failed');
            return objectname;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['files'] });
        },
    });
};

export const useCompletePresignUploadFile = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (objectname: string) => FileApi.completePresignedUpload(objectname),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['files'] });
        },
    });
};

export const useDeleteFile = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: string) => FileApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['files'] });
        },
    });
};