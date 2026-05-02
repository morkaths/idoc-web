import { type QueryKey } from '@tanstack/react-query';
import { BorrowApi } from '@/apis/borrow.api';
import type { BorrowResponse, BorrowRequest, FindParams, ApiResponse, PageResponse } from '@/types';
import { useListQuery, useItemQuery, useCreateMutation, useUpdateMutation, useDeleteMutation, type CreateMutationOptions, type UpdateMutationOptions, type DeleteMutationOptions } from './factory';

/**
 * Hook to fetch borrows with pagination
 * @param params Search/filter parameters
 * @param options Query options
 */
export const useBorrows = (
  params: FindParams = {},
  options?: any
) => {
  return useListQuery<BorrowResponse>(
    ['borrows', params],
    () => BorrowApi.find(params),
    options
  );
};

/**
 * Hook to fetch borrow history
 * @param params Search/filter parameters
 * @param options Query options
 */
export const useBorrowHistory = (
  params: FindParams = {},
  options?: any
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
  options?: any
) => {
  return useItemQuery<BorrowResponse>(
    ['borrows', id],
    () => BorrowApi.findById(id),
    {
      enabled: !!id,
      ...options,
    }
  );
};

/**
 * Hook to create a new borrow
 * @param options Mutation options
 */
export const useCreateBorrow = <TContext = unknown>(
  options?: CreateMutationOptions<BorrowRequest, BorrowResponse, TContext>
) => {
  return useCreateMutation<BorrowRequest, BorrowResponse, TContext>(
    (data) => BorrowApi.create(data),
    [['borrows']],
    options
  );
};

/**
 * Hook to update an existing borrow
 * @param options Mutation options
 */
export const useUpdateBorrow = <TContext = unknown>(
  options?: UpdateMutationOptions<BorrowRequest, BorrowResponse, TContext>
) => {
  return useUpdateMutation<BorrowRequest, BorrowResponse, TContext>(
    ({ id, data }) => BorrowApi.update(id, data),
    (variables) => [['borrows'], ['borrows', variables.id]],
    options
  );
};

/**
 * Hook to delete a borrow
 * @param options Mutation options
 */
export const useDeleteBorrow = <TContext = unknown>(
  options?: DeleteMutationOptions<TContext>
) => {
  return useDeleteMutation<TContext>(
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
  options?: any
) => {
  return useUpdateMutation<any, BorrowResponse, TContext>(
    ({ id, data }) => BorrowApi.extend(id, data as any),
    (variables) => [['borrows'], ['borrows', variables.id]],
    options
  );
};

/**
 * Hook to return a borrow
 * @param options Mutation options
 */
export const useReturnBorrow = <TContext = unknown>(
  options?: DeleteMutationOptions<TContext>
) => {
  return useDeleteMutation<TContext>(
    (id) => BorrowApi.return(id) as any,
    [['borrows']],
    options
  );
};

/**
 * Hook to view/read a borrow file
 * @param borrowId Borrow ID
 * @param options Query options
 */
export const useRead = (
  borrowId: string,
  options?: any
) => {
  return useItemQuery<string>(
    ['borrows', 'read', borrowId],
    () => BorrowApi.view(borrowId),
    {
      enabled: !!borrowId,
      ...options,
    }
  );
};

