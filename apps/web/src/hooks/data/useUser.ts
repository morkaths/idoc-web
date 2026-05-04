import { UserApi } from '@/apis';
import type { FindParams, UserResponse, UserRequest, PageParams } from '@/types';
import { useListQuery, useItemQuery, useCreateMutation, useUpdateMutation, useDeleteMutation, type ListQueryOptions, type ItemQueryOptions, type CreateMutationOptions, type UpdateMutationOptions, type DeleteMutationOptions } from './factory';

/**
 * Hook to fetch users with pagination
 * @param params Pagination parameters
 * @param options Query options
 */
export const useUsers = (
  params: PageParams = {},
  options?: ListQueryOptions<UserResponse>
) => {
  return useListQuery<UserResponse>(
    ['users', params],
    () => UserApi.find(params),
    options
  );
};

/**
 * Hook to search users
 * @param params Search parameters
 * @param options Query options
 */
export const useSearchUsers = (
  params: FindParams = {},
  options?: ListQueryOptions<UserResponse>
) => {
  return useListQuery<UserResponse>(
    ['users', 'search', params],
    () => UserApi.search(params),
    options
  );
};

/**
 * Hook to fetch a single user by ID
 * @param id User ID
 * @param options Query options
 */
export const useUser = (
  id: string,
  options?: ItemQueryOptions<UserResponse>
) => {
  return useItemQuery<UserResponse>(
    ['users', id],
    () => UserApi.findById(id),
    { enabled: !!id, ...options }
  );
};

/**
 * Hook to create a new user
 * @param options Mutation options
 */
export const useCreateUser = <TContext = unknown>(
  options?: CreateMutationOptions<UserRequest, UserResponse, TContext>
) => {
  return useCreateMutation<UserRequest, UserResponse, TContext>(
    (newUser) => UserApi.create(newUser),
    [['users']],
    options
  );
};

/**
 * Hook to update an existing user
 * @param options Mutation options
 */
export const useUpdateUser = <TContext = unknown>(
  options?: UpdateMutationOptions<UserRequest, UserResponse, TContext>
) => {
  return useUpdateMutation<UserRequest, UserResponse, TContext>(
    ({ id, data }) => UserApi.update(id, data),
    (variables) => [['users'], ['users', variables.id]],
    options
  );
};

/**
 * Hook to delete a user
 * @param options Mutation options
 */
export const useDeleteUser = <TContext = unknown>(
  options?: DeleteMutationOptions<TContext>
) => {
  return useDeleteMutation<TContext>(
    (id) => UserApi.delete(id),
    [['users']],
    options
  );
};

