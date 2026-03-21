import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { FileApi } from '@/apis/file.api';
import type { FileMeta, FindParams, Pagination } from '@/types';

type FileResponse = { data: FileMeta[]; pagination?: Pagination };

export const useFiles = (
    params: FindParams = {},
    options?: Omit<UseQueryOptions<FileResponse, Error, FileResponse, any[]>, 'queryKey' | 'queryFn'>
) => {
    return useQuery<FileResponse, Error, FileResponse, any[]>({
        queryKey: ['files', params],
        queryFn: async () => {
            const res = await FileApi.find(params);
            return res;
        },
        enabled: true,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
        select: (data) => ({
            data: data.data,
            pagination: data.pagination,
        }),
        ...options,
    });
};

export const useFile = (key: string) => {
    return useQuery({
        queryKey: ['files', key],
        queryFn: () => FileApi.findByKey(key),
        enabled: !!key,
        staleTime: 10 * 60 * 1000,
    });
};

export const useUploadFile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ file, folder }: { file: File; folder?: string }) => {
            const { url, key } = await FileApi.getUploadUrl(file.name, file.type, folder);
            const success = await FileApi.upload(url, file);
            if (!success) throw new Error('Upload failed');
            return key;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['files'] });
        },
    });
};

export const useConfirmFile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (key: string) => FileApi.confirm(key),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['files'] });
        },
    });
};

export const useDeleteFile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (key: string) => FileApi.delete(key),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['files'] });
        },
    });
};