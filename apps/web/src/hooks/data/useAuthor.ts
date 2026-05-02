import { type UseQueryOptions } from '@tanstack/react-query';
import { AuthorApi } from '@/apis/author.api';
import type { AuthorResponse, AuthorRequest, FindParams, ApiResponse, PageResponse } from '@/types';
import { useListQuery, useItemQuery, useCreateMutation, useUpdateMutation, useDeleteMutation } from './factory';

export const useAuthors = (
  params: FindParams = {},
  options?: Omit<UseQueryOptions<ApiResponse<PageResponse<AuthorResponse>>, Error>, 'queryKey' | 'queryFn'>
) => {
  return useListQuery(
    ['authors', params],
    () => AuthorApi.find(params),
    options
  );
};

export const useSearchAuthors = (
  params: FindParams = {},
  options?: Omit<UseQueryOptions<ApiResponse<PageResponse<AuthorResponse>>, Error>, 'queryKey' | 'queryFn'>
) => {
  return useListQuery(
    ['authors', 'search', params],
    () => AuthorApi.search(params),
    options
  );
};

export const useAuthor = (
  id: string, 
  options?: Omit<UseQueryOptions<ApiResponse<AuthorResponse>, Error>, 'queryKey' | 'queryFn'>
) => {
  return useItemQuery(
    ['authors', id],
    () => AuthorApi.findById(id),
    { enabled: !!id, ...options }
  );
};

export const useCreateAuthor = () => {
  return useCreateMutation(
    (data: AuthorRequest) => AuthorApi.create(data),
    [['authors']]
  );
};

export const useUpdateAuthor = () => {
  return useUpdateMutation(
    ({ id, data }: { id: string; data: Partial<AuthorRequest> }) => AuthorApi.update(id, data),
    (variables) => [['authors', variables.id], ['authors']]
  );
};

export const useDeleteAuthor = () => {
  return useDeleteMutation(
    (id: string) => AuthorApi.delete(id),
    [['authors']]
  );
};
