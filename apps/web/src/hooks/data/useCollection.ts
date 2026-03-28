import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';
import { CollectionApi } from '@/apis/collection.api';
import type { CollectionResponse, CollectionRequest, FindParams, Pagination } from '@/types';
import { useMemo } from 'react';

type PaginationResponse = { data: CollectionResponse[]; pagination?: Pagination };

export const useCollections = (
    params: FindParams = {},
    options?: Omit<UseQueryOptions<PaginationResponse, Error, PaginationResponse, QueryKey>, 'queryKey' | 'queryFn'>
) => {
    const { data: rawData, status, error, isLoading, isFetching, refetch } = useQuery<PaginationResponse, Error, PaginationResponse, QueryKey>({
        queryKey: ['collections', params],
        queryFn: () => CollectionApi.find(params),
        enabled: true,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
        ...options,
    });

    const stabilizedData = useMemo(() => ({
        data: rawData?.data || [],
        pagination: rawData?.pagination,
    }), [rawData]);

    return useMemo(() => ({
        status,
        error,
        isLoading,
        isFetching,
        refetch,
        data: stabilizedData,
    }), [stabilizedData, status, error, isLoading, isFetching, refetch]);
};

export const useCollection = (id: string, options?: Omit<UseQueryOptions<CollectionResponse, Error, CollectionResponse, QueryKey>, 'queryKey' | 'queryFn'>) => {
    const { data: rawData, status, error, isLoading, isFetching, refetch } = useQuery<CollectionResponse, Error, CollectionResponse, QueryKey>({
        queryKey: ['collections', id],
        queryFn: () => CollectionApi.findById(id),
        enabled: !!id,
        staleTime: 10 * 60 * 1000,
        ...options,
    });

    const data = useMemo(() => rawData || null, [rawData]);

    return useMemo(() => ({
        status,
        error,
        isLoading,
        isFetching,
        refetch,
        data,
    }), [data, status, error, isLoading, isFetching, refetch]);
};

export const useCreateCollection = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CollectionRequest) => CollectionApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collections'] });
        },
    });
};

export const useUpdateCollection = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CollectionRequest> }) => CollectionApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['collections', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['collections'] });
        },
    });
};

export const useDeleteCollection = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => CollectionApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['collections'] });
        },
    });
};
