import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';
import { CategoryApi } from '@/apis';
import type { FindParams, CategoryResponse, Pagination, CategoryRequest } from '@/types';
import { useMemo } from 'react';

type PaginationResponse = { data: CategoryResponse[]; pagination?: Pagination };

export const useCategories = (
  params: FindParams = {},
  options?: Omit<UseQueryOptions<PaginationResponse, Error, PaginationResponse, QueryKey>, 'queryKey' | 'queryFn'>
) => {
  const query = useQuery<PaginationResponse, Error, PaginationResponse, QueryKey>({
    queryKey: ['categories', params],
    queryFn: () => CategoryApi.find(params),
    enabled: true,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
    ...options,
  });

  return useMemo(() => ({
    ...query,
    data: {
      data: query.data?.data || [],
      pagination: query.data?.pagination,
    },
  }), [query]);
};

export const useCategory = (id: string, options?: Omit<UseQueryOptions<CategoryResponse, Error, CategoryResponse, QueryKey>, 'queryKey' | 'queryFn'>) => {
  const query = useQuery<CategoryResponse, Error, CategoryResponse, QueryKey>({
    queryKey: ['categories', id],
    queryFn: () => CategoryApi.findById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    ...options,
  });

  return useMemo(() => ({
    ...query,
    data: query.data || null,
  }), [query]);
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CategoryRequest) => CategoryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CategoryRequest> }) => CategoryApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => CategoryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};
