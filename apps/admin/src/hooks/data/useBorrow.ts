import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';
import { BorrowApi } from '@/apis/borrow.api';
import type { BorrowResponse, BorrowRequest, FindParams, Pagination } from '@/types';
import { useMemo } from 'react';

type PaginationResponse = { data: BorrowResponse[]; pagination?: Pagination };

export const useBorrows = (
  params: FindParams = {},
  options?: Omit<UseQueryOptions<PaginationResponse, Error, PaginationResponse, QueryKey>, 'queryKey' | 'queryFn'>
) => {
  const { data: rawData, status, error, isLoading, isFetching, refetch } = useQuery<PaginationResponse, Error, PaginationResponse, QueryKey>({
    queryKey: ['borrows', params],
    queryFn: () => BorrowApi.find(params),
    enabled: true,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    ...options,
  });

  return useMemo(() => ({
    status,
    error,
    isLoading,
    isFetching,
    refetch,
    data: {
      data: rawData?.data || [],
      pagination: rawData?.pagination,
    },
  }), [rawData, status, error, isLoading, isFetching, refetch]);
};

export const useBorrowHistory = (
  params: FindParams = {},
  options?: Omit<UseQueryOptions<PaginationResponse, Error, PaginationResponse, QueryKey>, 'queryKey' | 'queryFn'>
) => {
  const { data: rawData, status, error, isLoading, isFetching, refetch } = useQuery<PaginationResponse, Error, PaginationResponse, QueryKey>({
    queryKey: ['borrows', 'history', params],
    queryFn: () => BorrowApi.history(params),
    enabled: true,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    ...options,
  });

  return useMemo(() => ({
    status,
    error,
    isLoading,
    isFetching,
    refetch,
    data: {
      data: rawData?.data || [],
      pagination: rawData?.pagination,
    },
  }), [rawData, status, error, isLoading, isFetching, refetch]);
};

export const useBorrow = (id: string, options?: Omit<UseQueryOptions<BorrowResponse, Error, BorrowResponse, QueryKey>, 'queryKey' | 'queryFn'>) => {
  const { data, status, error, isLoading, isFetching, refetch } = useQuery<BorrowResponse, Error, BorrowResponse, QueryKey>({
    queryKey: ['borrows', id],
    queryFn: () => BorrowApi.findById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    ...options,
  });

  return useMemo(() => ({
    status,
    error,
    isLoading,
    isFetching,
    refetch,
    data: data || null,
  }), [data, status, error, isLoading, isFetching, refetch]);
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