import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';
import { FolderApi } from '@/apis/folder.api';
import type { FolderResponse, FolderRequest, FindParams, Pagination } from '@/types';
import { useMemo } from 'react';

type PaginationResponse = { data: FolderResponse[]; pagination?: Pagination };

export const useFolders = (
    params: FindParams = {},
    options?: Omit<UseQueryOptions<PaginationResponse, Error, PaginationResponse, QueryKey>, 'queryKey' | 'queryFn'>
) => {
    const { data: rawData, status, error, isLoading, isFetching, refetch } = useQuery<PaginationResponse, Error, PaginationResponse, QueryKey>({
        queryKey: ['folders', params],
        queryFn: () => FolderApi.find(params),
        enabled: true,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
        ...options,
    });

    const data = useMemo(() => ({
        data: rawData?.data || [],
        pagination: rawData?.pagination,
    }), [rawData]);

    return useMemo(() => ({
        status,
        error,
        isLoading,
        isFetching,
        refetch,
        data,
    }), [data, status, error, isLoading, isFetching, refetch]);
};

export const useFolder = (id: string, options?: Omit<UseQueryOptions<FolderResponse, Error, FolderResponse, QueryKey>, 'queryKey' | 'queryFn'>) => {
    const { data, status, error, isLoading, isFetching, refetch } = useQuery<FolderResponse, Error, FolderResponse, QueryKey>({
        queryKey: ['folders', id],
        queryFn: () => FolderApi.findById(id),
        enabled: !!id,
        staleTime: 10 * 60 * 1000,
        ...options,
    });

    return useMemo(() => ({
        status,
        error,
        isLoading,
        isFetching,
        refetch,
        data: data || null,
    }), [data, status, error, isLoading, isFetching, refetch]);
};

export const useCreateFolder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: FolderRequest) => FolderApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['folders'] });
        },
    });
};

export const useUpdateFolder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<FolderRequest> }) => FolderApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['folders', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['folders'] });
        },
    });
};

export const useDeleteFolder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => FolderApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['folders'] });
        },
    });
};
