import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';
import { ReviewApi } from '@/apis/review.api';
import type { ReviewResponse, ReviewRequest, FindParams, Pagination } from '@/types';

type PaginationResponse = { data: ReviewResponse[]; pagination?: Pagination };

export const useReviews = (
    params: FindParams = {},
    options?: Omit<UseQueryOptions<PaginationResponse, Error, PaginationResponse, QueryKey>, 'queryKey' | 'queryFn'>
) => {
    return useQuery<PaginationResponse, Error, PaginationResponse, QueryKey>({
        queryKey: ['reviews', params],
        queryFn: async () => await ReviewApi.find(params),
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

export const useReview = (id: string) => {
    return useQuery({
        queryKey: ['reviews', id],
        queryFn: () => ReviewApi.findById(id),
        enabled: !!id,
        staleTime: 10 * 60 * 1000,
    });
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
