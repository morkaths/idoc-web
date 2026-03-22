import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { PermissionApi } from '@/apis/permission.api';
import type { Permission, PermissionRequest, FindParams, Pagination, } from '@/types';

type PermissionResponse = { data: Permission[]; pagination?: Pagination };

export const usePermissions = (
  params: FindParams = {},
  options?: Omit<UseQueryOptions<PermissionResponse, Error, PermissionResponse, any[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<PermissionResponse, Error, PermissionResponse, any[]>({
    queryKey: ['permissions', params],
    queryFn: async () => {
      const res = await PermissionApi.find(params);
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

export const usePermission = (id: string) => {
  return useQuery({
    queryKey: ['permissions', id],
    queryFn: () => PermissionApi.findById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PermissionRequest) => PermissionApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });
};

export const useUpdatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PermissionRequest> }) =>
      PermissionApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['permissions', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });
};

export const useDeletePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => PermissionApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });
};