import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';
import { BorrowApi } from '@/apis/borrow.api';
import type { Borrow, BorrowRequest, FindParams, Pagination } from '@/types';

type PaginationResponse = { data: Borrow[]; pagination?: Pagination };

export const useBorrows = (
  params: FindParams = {},
  options?: Omit<UseQueryOptions<PaginationResponse, Error, PaginationResponse, QueryKey>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<PaginationResponse, Error, PaginationResponse, QueryKey>({
    queryKey: ['borrows', params],
    queryFn: async () => {
      const res = await BorrowApi.find(params);
      return res;
    },
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

export const useBorrowHistory = (
  params: FindParams = {},
  options?: Omit<UseQueryOptions<PaginationResponse, Error, PaginationResponse, QueryKey>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<PaginationResponse, Error, PaginationResponse, QueryKey>({
    queryKey: ['borrows', 'history', params],
    queryFn: async () => {
      const res = await BorrowApi.history(params);
      return res;
    },
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

export const useBorrow = (id: string) => {
  return useQuery({
    queryKey: ['borrows', id],
    queryFn: () => BorrowApi.findById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateBorrow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BorrowRequest) => BorrowApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrows'] });
    },
  });
};

export const useUpdateBorrow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BorrowRequest> }) => BorrowApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['borrows', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['borrows'] });
    },
  });
};

export const useDeleteBorrow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => BorrowApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrows'] });
    },
  });
};

export const useExtendBorrow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, extraDays, note }: { id: string; extraDays: number; note?: string }) => BorrowApi.extend(id, extraDays, note),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['borrows', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['borrows'] });
    },
  });
};

export const useReturnBorrow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => BorrowApi.return(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['borrows', id] });
      queryClient.invalidateQueries({ queryKey: ['borrows'] });
    },
  });
};