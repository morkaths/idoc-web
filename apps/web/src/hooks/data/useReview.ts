import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { ReviewApi } from '@/apis/review.api';
import type { Review, FindParams, Pagination } from '@/types';

type ReviewResponse = { data: Review[]; pagination?: Pagination };

export const useReviews = (
    params: FindParams = {},
    options?: Omit<UseQueryOptions<ReviewResponse, Error, ReviewResponse, any[]>, 'queryKey' | 'queryFn'>
) => {
    return useQuery<ReviewResponse, Error, ReviewResponse, any[]>({
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
        mutationFn: (newReview: Partial<Review>) => ReviewApi.create(newReview),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews'] });
        },
    });
};

export const useUpdateReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Review> }) => ReviewApi.update(id, data),
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
