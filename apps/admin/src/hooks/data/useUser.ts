import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';
import { UserApi } from '@/apis';
import type { FindParams, UserResponse, UserRequest, Pagination } from '@/types';

type PaginationResponse = { data: UserResponse[]; pagination?: Pagination };

export const useUsers = (
  params: FindParams = {},
  options?: Omit<UseQueryOptions<PaginationResponse, Error, PaginationResponse, QueryKey>, 'queryKey' | 'queryFn'>
) => {
  const query = useQuery<PaginationResponse, Error, PaginationResponse, QueryKey>({
    queryKey: ['users', params],
    queryFn: () => UserApi.find(params),
    enabled: true,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
    ...options,
  });

  return {
    ...query,
    data: {
      data: query.data?.data || [],
      pagination: query.data?.pagination,
    },
  };
};

export const useUser = (id: string) => {
  const query = useQuery({
    queryKey: ['users', id],
    queryFn: () => UserApi.findById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });

  return {
    ...query,
    data: query.data || null,
  };
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UserRequest) => UserApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserRequest> }) => UserApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => UserApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
