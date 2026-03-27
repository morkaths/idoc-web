import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';
import { CollectionApi } from '@/apis/collection.api';
import type { CollectionResponse, CollectionRequest, FindParams, Pagination } from '@/types';

type PaginationResponse = { data: CollectionResponse[]; pagination?: Pagination };

export const useCollections = (
    params: FindParams = {},
    options?: Omit<UseQueryOptions<PaginationResponse, Error, PaginationResponse, QueryKey>, 'queryKey' | 'queryFn'>
) => {
    return useQuery<PaginationResponse, Error, PaginationResponse, QueryKey>({
        queryKey: ['collections', params],
        queryFn: async () => await CollectionApi.find(params),
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

export const useCollection = (id: string) => {
    return useQuery({
        queryKey: ['collections', id],
        queryFn: () => CollectionApi.findById(id),
        enabled: !!id,
        staleTime: 10 * 60 * 1000,
    });
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
