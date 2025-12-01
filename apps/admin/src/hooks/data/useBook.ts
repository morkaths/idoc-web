import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookApiMock as BookApi } from '@/apis';
import type { FindParams } from '@/types';

// ==================== QUERIES ====================

export const useBooks = (params: FindParams = {}) => {
  return useQuery({
    queryKey: [
      'books',
      params.page,
      params.limit,
      params.query ?? '',
      JSON.stringify(params.filters ?? {}),
      JSON.stringify(params.sorts ?? null)
    ],
    queryFn: async () => {
      console.log('[useBooks] request params:', params);
      const res = await BookApi.find(params);
      console.log('[useBooks] response:', res);
      return res;
    },
    enabled: true,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // Cache 5 phút
    select: (data) => ({
      books: data.data,
      pagination: data.pagination
    })
  });
};

export const useBook = (id: string) => {
  return useQuery({
    queryKey: ['books', id],
    queryFn: () => BookApi.findById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

// ==================== MUTATIONS ====================

export const useCreateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newBook: any) => BookApi.create(newBook),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      BookApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['books', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => BookApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

// ==================== OPTIMISTIC UPDATES ====================

// Cập nhật với Optimistic Update
export const useUpdateBookOptimistic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      BookApi.update(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['books', id] });
      const previousBook = queryClient.getQueryData(['books', id]);

      queryClient.setQueryData(['books', id], (old: any) => ({
        ...old,
        ...data,
      }));

      return { previousBook };
    },

    onError: (_err, { id }, context) => {
      queryClient.setQueryData(['books', id], context?.previousBook);
    },

    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['books', id] });
    },
  });
};

// Xóa với Optimistic Update
export const useDeleteBookOptimistic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => BookApi.delete(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['books'] });
      const previousBooks = queryClient.getQueryData(['books']);

      queryClient.setQueryData(['books'], (old: any) =>
        old?.filter((book: any) => (book?._id ?? book?.id) !== id)
      );

      return { previousBooks };
    },

    onError: (_err, _, context) => {
      queryClient.setQueryData(['books'], context?.previousBooks);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};