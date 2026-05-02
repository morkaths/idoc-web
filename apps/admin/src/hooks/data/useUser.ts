import { UserApi } from '@/apis';
import type { FindParams, UserResponse, UserRequest } from '@/types';
import {
  useListQuery,
  useItemQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  type ListQueryOptions,
  type ItemQueryOptions,
  type CreateMutationOptions,
  type UpdateMutationOptions,
  type DeleteMutationOptions,
} from './factory';

export const useUsers = (
  params: FindParams = {},
  options?: ListQueryOptions<UserResponse>
) => {
  return useListQuery<UserResponse>(
    ['users', params],
    () => UserApi.find(params),
    {
      staleTime: 60 * 60 * 1000,
      ...options,
    }
  );
};

export const useSearchUsers = (
  params: FindParams = {},
  options?: ListQueryOptions<UserResponse>
) => {
  return useListQuery<UserResponse>(
    ['users', 'search', params],
    () => UserApi.search(params),
    {
      ...options,
    }
  );
};

export const useUser = (
  id: string,
  options?: ItemQueryOptions<UserResponse>
) => {
  return useItemQuery<UserResponse>(
    ['users', id],
    () => UserApi.findById(id),
    {
      enabled: !!id,
      ...options,
    }
  );
};

export const useCreateUser = (
  options?: CreateMutationOptions<UserRequest, UserResponse>
) => {
  return useCreateMutation<UserRequest, UserResponse>(
    (data) => UserApi.create(data),
    [['users']],
    options
  );
};

export const useUpdateUser = (
  options?: UpdateMutationOptions<UserRequest, UserResponse>
) => {
  return useUpdateMutation<UserRequest, UserResponse>(
    ({ id, data }) => UserApi.update(id, data),
    (variables) => [['users', variables.id], ['users']],
    options
  );
};

export const useDeleteUser = (options?: DeleteMutationOptions) => {
  return useDeleteMutation(
    (id) => UserApi.delete(id),
    [['users']],
    options
  );
};


