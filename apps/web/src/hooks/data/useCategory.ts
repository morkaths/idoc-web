import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { CategoryApi } from '@/apis';
import type { FindParams, Category, Pagination } from '@/types';

type CategoryResponse = { data: Category[]; pagination?: Pagination };

export const useCategories = (
  params: FindParams = {},
  options?: Omit<UseQueryOptions<CategoryResponse, Error, CategoryResponse, any[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<CategoryResponse, Error, CategoryResponse, any[]>({
    queryKey: ['categories', params],
    queryFn: async () => await CategoryApi.find(params),
    enabled: true,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
    select: (data) => ({
      data: data.data,
      pagination: data.pagination,
    }),
    ...options,
  });
};

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ['categories', id],
    queryFn: () => CategoryApi.findById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newCategory: Partial<Category>) => CategoryApi.create(newCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
      CategoryApi.update(id, data),
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
