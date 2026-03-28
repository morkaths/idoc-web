import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';
import { PermissionApi } from '@/apis/permission.api';
import type { Permission, PermissionRequest, FindParams, Pagination, } from '@/types';
import { useMemo } from 'react';

type PaginationResponse = { data: Permission[]; pagination?: Pagination };

export const usePermissions = (
  params: FindParams = {},
  options?: Omit<UseQueryOptions<PaginationResponse, Error, PaginationResponse, QueryKey>, 'queryKey' | 'queryFn'>
) => {
  const query = useQuery<PaginationResponse, Error, PaginationResponse, QueryKey>({
    queryKey: ['permissions', params],
    queryFn: () => PermissionApi.find(params),
    enabled: true,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
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

export const usePermission = (id: string, options?: Omit<UseQueryOptions<Permission, Error, Permission, QueryKey>, 'queryKey' | 'queryFn'>) => {
  const query = useQuery<Permission, Error, Permission, QueryKey>({
    queryKey: ['permissions', id],
    queryFn: () => PermissionApi.findById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    ...options,
  });

  return useMemo(() => ({
    ...query,
    data: query.data || null,
  }), [query]);
};

export const useCreatePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newPermission: PermissionRequest) => PermissionApi.create(newPermission),
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
