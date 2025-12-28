import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BorrowApi } from '@/apis/borrow.api';
import type { Borrow, FindParams } from '@/types';

export const useBorrows = (params: FindParams = {}) => {
  return useQuery({
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
  });
};

export const useBorrowHistory = (params: FindParams = {}) => {
  return useQuery({
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
    mutationFn: (newBorrow: Partial<Borrow>) => BorrowApi.create(newBorrow),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrows'] });
    },
  });
};

export const useUpdateBorrow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Borrow> }) => BorrowApi.update(id, data),
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