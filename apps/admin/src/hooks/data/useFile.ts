import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';
import { FileApi } from '@/apis/file.api';
import type { File as IFile, FindParams, Pagination } from '@/types';

type FileResponse = { data: IFile[]; pagination?: Pagination };

export const useFiles = (
    params: FindParams = {},
    options?: Omit<UseQueryOptions<FileResponse, Error, FileResponse, QueryKey>, 'queryKey' | 'queryFn'>
) => {
    return useQuery<FileResponse, Error, FileResponse, QueryKey>({
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

export const useFile = (id: string) => {
    return useQuery({
        queryKey: ['files', id],
        queryFn: () => FileApi.findById(id),
        enabled: !!id,
        staleTime: 10 * 60 * 1000,
    });
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