import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';
import { RoleApi } from '@/apis/role.api';
import type { RoleResponse, RoleRequest, FindParams, Pagination } from '@/types';

type PaginationResponse = { data: RoleResponse[]; pagination?: Pagination };

export const useRoles = (
  params: FindParams = {},
  options?: Omit<UseQueryOptions<PaginationResponse, Error, PaginationResponse, QueryKey>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<PaginationResponse, Error, PaginationResponse, QueryKey>({
    queryKey: ['roles', params],
    queryFn: async () => await RoleApi.find(params),
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

export const useRole = (id: string) => {
  return useQuery({
    queryKey: ['roles', id],
    queryFn: () => RoleApi.findById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RoleRequest) => RoleApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RoleRequest> }) =>
      RoleApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => RoleApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};