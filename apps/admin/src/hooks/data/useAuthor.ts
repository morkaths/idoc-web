import { AuthorApi } from '@/apis/author.api';
import type { AuthorResponse, AuthorRequest, FindParams } from '@/types';
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

export const useAuthors = (
  params: FindParams = {},
  options?: ListQueryOptions<AuthorResponse>
) => {
  return useListQuery<AuthorResponse>(
    ['authors', params],
    () => AuthorApi.find(params),
    {
      staleTime: 5 * 60 * 1000,
      ...options,
    }
  );
};

export const useSearchAuthors = (
  params: FindParams = {},
  options?: ListQueryOptions<AuthorResponse>
) => {
  return useListQuery<AuthorResponse>(
    ['authors', 'search', params],
    () => AuthorApi.search(params),
    {
      ...options,
    }
  );
};

export const useAuthor = (
  id: string,
  options?: ItemQueryOptions<AuthorResponse>
) => {
  return useItemQuery<AuthorResponse>(
    ['authors', id],
    () => AuthorApi.findById(id),
    {
      enabled: !!id,
      ...options,
    }
  );
};

export const useCreateAuthor = (
  options?: CreateMutationOptions<AuthorRequest, AuthorResponse>
) => {
  return useCreateMutation<AuthorRequest, AuthorResponse>(
    (data) => AuthorApi.create(data),
    [['authors']],
    options
  );
};

export const useUpdateAuthor = (
  options?: UpdateMutationOptions<AuthorRequest, AuthorResponse>
) => {
  return useUpdateMutation<AuthorRequest, AuthorResponse>(
    ({ id, data }) => AuthorApi.update(id, data),
    (variables) => [['authors', variables.id], ['authors']],
    options
  );
};

export const useDeleteAuthor = (options?: DeleteMutationOptions) => {
  return useDeleteMutation(
    (id) => AuthorApi.delete(id),
    [['authors']],
    options
  );
};

