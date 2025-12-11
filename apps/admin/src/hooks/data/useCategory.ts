import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CategoryApiMock as CategoryApi } from '@/apis'
import type { FindParams, Category } from '@/types'

// ==================== QUERIES ====================

export const useCategories = (params: FindParams = {}) => {
  return useQuery({
    queryKey: [
      'categories',
      params.page,
      params.limit,
      params.query ?? '',
      JSON.stringify(params.filters ?? {}),
      JSON.stringify(params.sorts ?? null),
    ],
    queryFn: async () => await CategoryApi.find(params),
    enabled: true,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    select: (data) => ({
      categories: data.data,
      pagination: data.pagination,
    }),
  })
}

export const useAllCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['categories', 'all'],
    queryFn: async () => await CategoryApi.findAll(),
    enabled: true,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ['categories', id],
    queryFn: () => CategoryApi.findById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  })
}

// ==================== MUTATIONS ====================

export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (newCategory: Partial<Category>) =>
      CategoryApi.create(newCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
      CategoryApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['categories', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => CategoryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

// ==================== OPTIMISTIC UPDATES ====================

export const useUpdateCategoryOptimistic = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
      CategoryApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['categories', id] })
      const previous = queryClient.getQueryData(['categories', id])
      queryClient.setQueryData(['categories', id], (old: any) => ({
        ...old,
        ...data,
      }))
      return { previous }
    },
    onError: (_err, { id }, context: any) => {
      queryClient.setQueryData(['categories', id], context?.previous)
    },
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['categories', id] })
    },
  })
}

export const useDeleteCategoryOptimistic = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => CategoryApi.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['categories'] })
      const previous = queryClient.getQueryData(['categories'])
      queryClient.setQueryData(['categories'], (old: any) =>
        old?.filter((c: any) => (c?._id ?? c?.id) !== id)
      )
      return { previous }
    },
    onError: (_err, _vars, context: any) => {
      queryClient.setQueryData(['categories'], context?.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}
