import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';
import { CollectionApi } from '@/apis/collection.api';
import type { CollectionResponse, CollectionRequest, FindParams, Pagination } from '@/types';
import { useMemo } from 'react';

type PaginationResponse = { data: CollectionResponse[]; pagination?: Pagination };

export const useCollections = (
    params: FindParams = {},
    options?: Omit<UseQueryOptions<PaginationResponse, Error, PaginationResponse, QueryKey>, 'queryKey' | 'queryFn'>
) => {
    const query = useQuery<PaginationResponse, Error, PaginationResponse, QueryKey>({
        queryKey: ['collections', params],
        queryFn: () => CollectionApi.find(params),
        enabled: true,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
        ...options,
    });

    return useMemo(() => ({
        ...query,
        data: {
            data: query.data?.data || [],
            pagination: query.data?.pagination,
        },
    }), [query]);
};

export const useCollection = (id: string, options?: Omit<UseQueryOptions<CollectionResponse, Error, CollectionResponse, QueryKey>, 'queryKey' | 'queryFn'>) => {
    const query = useQuery<CollectionResponse, Error, CollectionResponse, QueryKey>({
        queryKey: ['collections', id],
        queryFn: () => CollectionApi.findById(id),
        enabled: !!id,
        staleTime: 10 * 60 * 1000,
        ...options,
    });

    return useMemo(() => ({
        ...query,
        data: query.data || null,
    }), [query]);
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
