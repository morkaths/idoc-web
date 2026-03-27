import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';
import { BookApi } from '@/apis';
import type { BookResponse, BookRequest, FindParams, Pagination } from '@/types';

type PaginationResponse = { data: BookResponse[]; pagination?: Pagination };

export const useBooks = (
  params: FindParams = {},
  options?: Omit<UseQueryOptions<PaginationResponse, Error, PaginationResponse, QueryKey>, 'queryKey' | 'queryFn'>
) => {
  const query = useQuery<PaginationResponse, Error, PaginationResponse, QueryKey>({
    queryKey: ['books', params],
    queryFn: () => BookApi.find(params),
    enabled: true,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    ...options
  });

  return {
    ...query,
    data: {
      data: query.data?.data || [],
      pagination: query.data?.pagination,
    }
  };
};

export const useBook = (id: string) => {
  const query = useQuery({
    queryKey: ['books', id],
    queryFn: () => BookApi.findById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });

  return {
    ...query,
    data: query.data || null,
  };
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BookRequest) => BookApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BookRequest> }) => BookApi.update(id, data),
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
