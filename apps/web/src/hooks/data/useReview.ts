import type { ReviewResponse, ReviewRequest, PageParams, FindParams } from '@/types';
import { ReviewApi } from '@/apis/review.api';
import {
  useListQuery,
  useItemQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  type ListQueryOptions,
  type ItemQueryOptions,
  type CreateMutationOptions,
  type UpdateMutationOptions,
  type DeleteMutationOptions,
} from './factory';

/**
 * Hook to fetch reviews with pagination
 * @param params Pagination parameters
 * @param options Query options
 */
export const useReviews = (params?: PageParams, options?: ListQueryOptions<ReviewResponse>) => {
  return useListQuery<ReviewResponse>(['reviews', params], () => ReviewApi.find(params), options);
};

/**
 * Hook to search reviews with complex filters
 * @param params Search parameters
 * @param options Query options
 */
export const useSearchReviews = (
  params: FindParams = {},
  options?: ListQueryOptions<ReviewResponse>
) => {
  return useListQuery<ReviewResponse>(
    ['reviews', 'search', params],
    () => ReviewApi.search(params),
    options
  );
};

/**
 * Hook to fetch a single review by ID
 * @param id Review ID
 * @param options Query options
 */
export const useReview = (id: string, options?: ItemQueryOptions<ReviewResponse>) => {
  return useItemQuery<ReviewResponse>(['reviews', id], () => ReviewApi.findById(id), {
    enabled: !!id,
    ...options,
  });
};

/**
 * Hook to create a new review
 * @param options Mutation options
 */
export const useCreateReview = <TContext = unknown>(
  options?: CreateMutationOptions<ReviewRequest, ReviewResponse, TContext>
) => {
  return useCreateMutation<ReviewRequest, ReviewResponse, TContext>(
    (newReview) => ReviewApi.create(newReview),
    [['reviews']],
    options
  );
};

/**
 * Hook to update an existing review
 * @param options Mutation options
 */
export const useUpdateReview = <TContext = unknown>(
  options?: UpdateMutationOptions<ReviewRequest, ReviewResponse, TContext>
) => {
  return useUpdateMutation<ReviewRequest, ReviewResponse, TContext>(
    ({ id, data }) => ReviewApi.update(id, data),
    (variables) => [['reviews'], ['reviews', variables.id]],
    options
  );
};

/**
 * Hook to delete a review
 * @param options Mutation options
 */
export const useDeleteReview = <TContext = unknown>(options?: DeleteMutationOptions<TContext>) => {
  return useDeleteMutation<TContext>((id) => ReviewApi.delete(id), [['reviews']], options);
};
