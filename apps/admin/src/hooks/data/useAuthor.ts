import { AuthorApi } from '@/apis/author.api';
import type { AuthorResponse, AuthorRequest, FindParams, PageParams } from '@/types';
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

/**
 * Hook to fetch authors with pagination
 * @param params Pagination parameters
 * @param options Query options
 */
export const useAuthors = (params: PageParams = {}, options?: ListQueryOptions<AuthorResponse>) => {
  return useListQuery<AuthorResponse>(['authors', params], () => AuthorApi.find(params), options);
};

/**
 * Hook to search authors
 * @param params Search parameters
 * @param options Query options
 */
export const useSearchAuthors = (
  params: FindParams = {},
  options?: ListQueryOptions<AuthorResponse>
) => {
  return useListQuery<AuthorResponse>(
    ['authors', 'search', params],
    () => AuthorApi.search(params),
    options
  );
};

/**
 * Hook to fetch a single author by ID
 * @param id Author ID
 * @param options Query options
 */
export const useAuthor = (id: string, options?: ItemQueryOptions<AuthorResponse>) => {
  return useItemQuery<AuthorResponse>(['authors', id], () => AuthorApi.findById(id), {
    enabled: !!id,
    ...options,
  });
};

/**
 * Hook to create a new author
 * @param options Mutation options
 */
export const useCreateAuthor = <TContext = unknown>(
  options?: CreateMutationOptions<AuthorRequest, AuthorResponse, TContext>
) => {
  return useCreateMutation<AuthorRequest, AuthorResponse, TContext>(
    (data) => AuthorApi.create(data),
    [['authors']],
    options
  );
};

/**
 * Hook to update an existing author
 * @param options Mutation options
 */
export const useUpdateAuthor = <TContext = unknown>(
  options?: UpdateMutationOptions<AuthorRequest, AuthorResponse, TContext>
) => {
  return useUpdateMutation<AuthorRequest, AuthorResponse, TContext>(
    ({ id, data }) => AuthorApi.update(id, data),
    (variables) => [['authors', variables.id], ['authors']],
    options
  );
};

/**
 * Hook to delete an author
 * @param options Mutation options
 */
export const useDeleteAuthor = <TContext = unknown>(options?: DeleteMutationOptions<TContext>) => {
  return useDeleteMutation<TContext>((id) => AuthorApi.delete(id), [['authors']], options);
};
