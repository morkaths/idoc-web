import { BorrowApi } from '@/apis/borrow.api';
import type { LoanResponse, BorrowRequest, FindParams, RenewBorrowRequest, PageParams } from '@/types';
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
  type DeleteMutationOptions
} from './factory';

/**
 * Hook to fetch borrows with pagination
 * @param params Pagination parameters
 * @param options Query options
 */
export const useBorrows = (
  params: PageParams = {},
  options?: ListQueryOptions<LoanResponse>
) => {
  return useListQuery<LoanResponse>(
    ['borrows', params],
    () => BorrowApi.find(params),
    options
  );
};

/**
 * Hook to fetch borrow history
 * @param params Pagination parameters
 * @param options Query options
 */
export const useBorrowHistory = (
  params: FindParams = {},
  options?: ListQueryOptions<LoanResponse>
) => {
  return useListQuery<LoanResponse>(
    ['borrows', 'history', params],
    () => BorrowApi.history(params),
    options
  );
};

/**
 * Hook to search borrows with complex filters
 * @param params Search parameters
 * @param options Query options
 */
export const useSearchBorrows = (
  params: FindParams = {},
  options?: ListQueryOptions<LoanResponse>
) => {
  return useListQuery<LoanResponse>(
    ['borrows', 'search', params],
    () => BorrowApi.search(params),
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
  options?: ItemQueryOptions<LoanResponse>
) => {
  return useItemQuery<LoanResponse>(
    ['borrows', id],
    () => BorrowApi.findById(id),
    { enabled: !!id, ...options }
  );
};

/**
 * Hook to create a new borrow
 * @param options Mutation options
 */
export const useCreateBorrow = <TContext = unknown>(
  options?: CreateMutationOptions<BorrowRequest, LoanResponse, TContext>
) => {
  return useCreateMutation<BorrowRequest, LoanResponse, TContext>(
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
  options?: UpdateMutationOptions<BorrowRequest, LoanResponse, TContext>
) => {
  return useUpdateMutation<BorrowRequest, LoanResponse, TContext>(
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
  options?: UpdateMutationOptions<RenewBorrowRequest, LoanResponse, TContext>
) => {
  return useUpdateMutation<RenewBorrowRequest, LoanResponse, TContext>(
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
  options?: UpdateMutationOptions<void, LoanResponse, TContext>
) => {
  return useUpdateMutation<void, LoanResponse, TContext>(
    ({ id }) => BorrowApi.return(id),
    (variables) => [['borrows'], ['borrows', variables.id]],
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
  options?: ItemQueryOptions<string>
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

