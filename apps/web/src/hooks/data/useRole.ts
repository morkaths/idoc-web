import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RoleApi } from '@/apis/role.api';
import type { Role, FindParams } from '@/types';

export const useRoles = (params: FindParams = {}) => {
  return useQuery({
    queryKey: ['roles', params],
    queryFn: async () => {
      const res = await RoleApi.find(params);
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
    mutationFn: (newRole: Partial<Role>) => RoleApi.create(newRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Role> }) =>
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