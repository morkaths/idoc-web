import { BorrowApi } from '@/apis/borrow.api';
import type { BorrowResponse, BorrowRequest, FindParams } from '@/types';
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
import { useMutation, useQueryClient } from '@tanstack/react-query';

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

export const useBorrowHistory = (
  params: FindParams = {},
  options?: ListQueryOptions<BorrowResponse>
) => {
  return useListQuery(
    ['borrows', 'history', params],
    () => BorrowApi.history(params),
    options
  );
};

export const useBorrow = (
  id: string,
  options?: ItemQueryOptions<BorrowResponse>
) => {
  return useItemQuery(
    ['borrows', id],
    () => BorrowApi.findById(id),
    {
      enabled: !!id,
      ...options,
    }
  );
};

export const useCreateBorrow = (
  options?: CreateMutationOptions<BorrowRequest, BorrowResponse>
) => {
  return useCreateMutation(
    (data) => BorrowApi.create(data),
    [['borrows']],
    options
  );
};

export const useUpdateBorrow = (
  options?: UpdateMutationOptions<BorrowRequest, BorrowResponse>
) => {
  return useUpdateMutation(
    ({ id, data }) => BorrowApi.update(id, data),
    (variables) => [['borrows', variables.id], ['borrows']],
    options
  );
};

export const useDeleteBorrow = (
  options?: DeleteMutationOptions
) => {
  return useDeleteMutation(
    (id) => BorrowApi.delete(id),
    [['borrows']],
    options
  );
};

export const useExtendBorrow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, extraDays, note }: { id: string; extraDays: number; note?: string }) =>
      BorrowApi.extend(id, extraDays, note),
    onSuccess: (res, variables) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['borrows', variables.id] });
        queryClient.invalidateQueries({ queryKey: ['borrows'] });
      }
    },
  });
};

export const useReturnBorrow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => BorrowApi.return(id),
    onSuccess: (res, id) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['borrows', id] });
        queryClient.invalidateQueries({ queryKey: ['borrows'] });
      }
    },
  });
};

