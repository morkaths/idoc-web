import { ReviewApi } from '@/apis/review.api';
import type { ReviewResponse, ReviewRequest, FindParams, PageParams } from '@/types';
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
export const useReviews = (
  params: PageParams = {},
  options?: ListQueryOptions<ReviewResponse>
) => {
  return useListQuery(
    ['reviews', params],
    () => ReviewApi.find(params),
    options
  );
};

/**
 * Hook to search reviews
 * @param params Search parameters
 * @param options Query options
 */
export const useSearchReviews = (
  params: FindParams = {},
  options?: ListQueryOptions<ReviewResponse>
) => {
  return useListQuery(
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
export const useReview = (
  id: string,
  options?: ItemQueryOptions<ReviewResponse>
) => {
  return useItemQuery(
    ['reviews', id],
    () => ReviewApi.findById(id),
    {
      enabled: !!id,
      ...options,
    }
  );
};

/**
 * Hook to create a new review
 * @param options Mutation options
 */
export const useCreateReview = (
  options?: CreateMutationOptions<ReviewRequest, ReviewResponse>
) => {
  return useCreateMutation(
    (data) => ReviewApi.create(data),
    [['reviews']],
    options
  );
};

/**
 * Hook to update an existing review
 * @param options Mutation options
 */
export const useUpdateReview = (
  options?: UpdateMutationOptions<ReviewRequest, ReviewResponse>
) => {
  return useUpdateMutation(
    ({ id, data }) => ReviewApi.update(id, data),
    (variables) => [['reviews', variables.id], ['reviews']],
    options
  );
};

/**
 * Hook to delete a review
 * @param options Mutation options
 */
export const useDeleteReview = (
  options?: DeleteMutationOptions
) => {
  return useDeleteMutation(
    (id) => ReviewApi.delete(id),
    [['reviews']],
    options
  );
};

