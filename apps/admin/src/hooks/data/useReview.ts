import { ReviewApi } from '@/apis/review.api';
import type { ReviewResponse, ReviewRequest, FindParams } from '@/types';
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

export const useReviews = (
  params: FindParams = {},
  options?: ListQueryOptions<ReviewResponse>
) => {
  return useListQuery(
    ['reviews', params],
    () => ReviewApi.find(params),
    options
  );
};

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

export const useCreateReview = (
  options?: CreateMutationOptions<ReviewRequest, ReviewResponse>
) => {
  return useCreateMutation(
    (data) => ReviewApi.create(data),
    [['reviews']],
    options
  );
};

export const useUpdateReview = (
  options?: UpdateMutationOptions<ReviewRequest, ReviewResponse>
) => {
  return useUpdateMutation(
    ({ id, data }) => ReviewApi.update(id, data),
    (variables) => [['reviews', variables.id], ['reviews']],
    options
  );
};

export const useDeleteReview = (
  options?: DeleteMutationOptions
) => {
  return useDeleteMutation(
    (id) => ReviewApi.delete(id),
    [['reviews']],
    options
  );
};

