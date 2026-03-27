import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';
import { AuthorApi } from '@/apis/author.api';
import type { AuthorResponse, AuthorRequest, FindParams, Pagination } from '@/types';

type PaginationResponse = { data: AuthorResponse[]; pagination?: Pagination };

export const useAuthors = (
  params: FindParams = {},
  options?: Omit<UseQueryOptions<PaginationResponse, Error, PaginationResponse, QueryKey>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<PaginationResponse, Error, PaginationResponse, QueryKey>({
    queryKey: ['authors', params],
    queryFn: async () => await AuthorApi.find(params),
    enabled: true,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    select: (data) => ({
      data: data.data,
      pagination: data.pagination,
    }),
    ...options
  });
};

export const useAuthor = (id: string) => {
  return useQuery({
    queryKey: ['authors', id],
    queryFn: () => AuthorApi.findById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateAuthor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AuthorRequest) => AuthorApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
    },
  });
};

export const useUpdateAuthor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AuthorRequest> }) => AuthorApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['authors', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['authors'] });
    },
  });
};

export const useDeleteAuthor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AuthorApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authors'] });
    },
  });
};