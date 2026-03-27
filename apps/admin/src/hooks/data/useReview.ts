import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';
import { ReviewApi } from '@/apis/review.api';
import type { ReviewResponse, ReviewRequest, FindParams, Pagination } from '@/types';

type PaginationResponse = { data: ReviewResponse[]; pagination?: Pagination };

export const useReviews = (
    params: FindParams = {},
    options?: Omit<UseQueryOptions<PaginationResponse, Error, PaginationResponse, QueryKey>, 'queryKey' | 'queryFn'>
) => {
    const query = useQuery<PaginationResponse, Error, PaginationResponse, QueryKey>({
        queryKey: ['reviews', params],
        queryFn: () => ReviewApi.find(params),
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

export const useReview = (id: string) => {
    const query = useQuery({
        queryKey: ['reviews', id],
        queryFn: () => ReviewApi.findById(id),
        enabled: !!id,
        staleTime: 10 * 60 * 1000,
    });

    return {
        ...query,
        data: query.data || null,
    };
};

export const useCreateReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ReviewRequest) => ReviewApi.create(data),
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
