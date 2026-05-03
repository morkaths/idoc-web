import { BorrowApi } from '@/apis/borrow.api';
import type { BorrowResponse, BorrowRequest, FindParams, RenewBorrowRequest } from '@/types';
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
 * Hook to fetch borrows
 * @param params Filter parameters
 * @param options Query options
 */
export const useBorrows = (
  params: FindParams = {},
  options?: ListQueryOptions<BorrowResponse>
) => {
  return useListQuery(
    ['borrows', params],
    () => BorrowApi.find(params),
    options
  );
};

/**
 * Hook to fetch borrow history
 * @param params Filter parameters
 * @param options Query options
 */
export const useBorrowHistory = (
  params: FindParams = {},
  options?: ListQueryOptions<BorrowResponse>
) => {
  return useListQuery<BorrowResponse>(
    ['borrows', 'history', params],
    () => BorrowApi.history(params),
    options
  );
};

/**
 * Hook to fetch a single borrow by ID
 * @param id Borrow ID
 * @param options Query options
 */
export const useBorrow = (
  id: string,
  options?: ItemQueryOptions<BorrowResponse>
) => {
  return useItemQuery<BorrowResponse>(
    ['borrows', id],
    () => BorrowApi.findById(id),
    { enabled: !!id, ...options }
  );
};

/**
 * Hook to create a new borrow
 * @param options Mutation options
 */
export const useCreateBorrow = (
  options?: CreateMutationOptions<BorrowRequest, BorrowResponse>
) => {
  return useCreateMutation(
    (data) => BorrowApi.create(data),
    [['borrows']],
    options
  );
};

/**
 * Hook to update an existing borrow
 * @param options Mutation options
 */
export const useUpdateBorrow = (
  options?: UpdateMutationOptions<BorrowRequest, BorrowResponse>
) => {
  return useUpdateMutation(
    ({ id, data }) => BorrowApi.update(id, data),
    (variables) => [['borrows', variables.id], ['borrows']],
    options
  );
};

/**
 * Hook to delete a borrow
 * @param options Mutation options
 */
export const useDeleteBorrow = (
  options?: DeleteMutationOptions
) => {
  return useDeleteMutation(
    (id) => BorrowApi.delete(id),
    [['borrows']],
    options
  );
};

/**
 * Hook to extend a borrow
 * @param options Mutation options
 */
export const useExtendBorrow = <TContext = unknown>(
  options?: UpdateMutationOptions<RenewBorrowRequest, BorrowResponse, TContext>
) => {
  return useUpdateMutation<RenewBorrowRequest, BorrowResponse, TContext>(
    ({ id, data }) => BorrowApi.extend(id, data),
    (variables) => [['borrows'], ['borrows', variables.id]],
    options
  );
};

/**
 * Hook to return a borrow
 * @param options Mutation options
 */
export const useReturnBorrow = <TContext = unknown>(
  options?: UpdateMutationOptions<void, BorrowResponse, TContext>
) => {
  return useUpdateMutation<void, BorrowResponse, TContext>(
    ({ id }) => BorrowApi.return(id),
    (variables) => [['borrows'], ['borrows', variables.id]],
    options
  );
};

