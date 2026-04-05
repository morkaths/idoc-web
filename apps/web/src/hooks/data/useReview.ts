import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';
import { ReviewApi } from '@/apis/review.api';
import type { ReviewResponse, ReviewRequest, FindParams, Pagination } from '@/types';
import { useMemo } from 'react';

type PaginationResponse = { data: ReviewResponse[]; pagination?: Pagination };

export const useReviews = (
    params: FindParams = {},
    options?: Omit<UseQueryOptions<PaginationResponse, Error, PaginationResponse, QueryKey>, 'queryKey' | 'queryFn'>
) => {
    const { data: rawData, status, error, isLoading, isFetching, refetch, isError } = useQuery<PaginationResponse, Error, PaginationResponse, QueryKey>({
        queryKey: ['reviews', params],
        queryFn: () => ReviewApi.find(params),
        enabled: true,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
        ...options,
    });

    return useMemo(() => ({
        status,
        error,
        isLoading,
        isFetching,
        isError,
        refetch,
        data: {
            data: rawData?.data || [],
            pagination: rawData?.pagination,
        },
    }), [rawData, status, error, isLoading, isFetching, refetch]);
};

export const useReview = (id: string, options?: Omit<UseQueryOptions<ReviewResponse, Error, ReviewResponse, QueryKey>, 'queryKey' | 'queryFn'>) => {
    const { data, status, error, isLoading, isFetching, refetch, isError } = useQuery<ReviewResponse, Error, ReviewResponse, QueryKey>({
        queryKey: ['reviews', id],
        queryFn: () => ReviewApi.findById(id),
        enabled: !!id,
        staleTime: 10 * 60 * 1000,
        ...options,
    });

    return useMemo(() => ({
        status,
        error,
        isLoading,
        isFetching,
        isError,
        refetch,
        data: data || null,
    }), [data, status, error, isLoading, isFetching, refetch]);
};

export const useCreateReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newReview: ReviewRequest) => ReviewApi.create(newReview),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
        },
    });
};

export const useUpdateReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<ReviewRequest> }) => ReviewApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['reviews', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
        },
    });
};

export const useDeleteReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ReviewApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
        },
    });
};
