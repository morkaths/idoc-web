import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';
import { AuthorApi } from '@/apis/author.api';
import type { AuthorResponse, AuthorRequest, FindParams, Pagination } from '@/types';
import { useMemo } from 'react';

type PaginationResponse = { data: AuthorResponse[]; pagination?: Pagination };

export const useAuthors = (
  params: FindParams = {},
  options?: Omit<UseQueryOptions<PaginationResponse, Error, PaginationResponse, QueryKey>, 'queryKey' | 'queryFn'>
) => {
  const query = useQuery<PaginationResponse, Error, PaginationResponse, QueryKey>({
    queryKey: ['authors', params],
    queryFn: () => AuthorApi.find(params),
    enabled: true,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    ...options
  });

  return useMemo(() => ({
    ...query,
    data: {
      data: query.data?.data || [],
      pagination: query.data?.pagination,
    },
  }), [query]);
};

export const useAuthor = (id: string, options?: Omit<UseQueryOptions<AuthorResponse, Error, AuthorResponse, QueryKey>, 'queryKey' | 'queryFn'>) => {
  const query = useQuery<AuthorResponse, Error, AuthorResponse, QueryKey>({
    queryKey: ['authors', id],
    queryFn: () => AuthorApi.findById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    ...options
  });

  return useMemo(() => ({
    ...query,
    data: query.data || null,
  }), [query]);
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
