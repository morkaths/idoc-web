import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PermissionApi } from '@/apis/permission.api';
import type { Permission, FindParams } from '@/types';

export const usePermissions = (params: FindParams = {}) => {
  return useQuery({
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
    mutationFn: (newPermission: Partial<Permission>) => PermissionApi.create(newPermission),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
    },
  });
};

export const useUpdatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Permission> }) =>
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