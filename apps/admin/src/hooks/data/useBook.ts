import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { BookApi } from '@/apis';
import type { Book, FindParams, Pagination } from '@/types';

type BookResponse = { data: Book[]; pagination?: Pagination };

export const useBooks = (
  params: FindParams = {},
  options?: Omit<UseQueryOptions<BookResponse, Error, BookResponse, any[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<BookResponse, Error, BookResponse, any[]>({
    queryKey: ['books', params],
    queryFn: async () => {
      const res = await BookApi.find(params);
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

export const useBook = (id: string) => {
  return useQuery({
    queryKey: ['books', id],
    queryFn: () => BookApi.findById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newBook: Partial<Book>) => BookApi.create(newBook),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Book> }) => BookApi.update(id, data),
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
