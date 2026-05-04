import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type QueryKey,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { useMemo } from 'react';
import type { ApiResponse, PageResponse } from '@/types';

export type ListQueryOptions<T> = Omit<
  UseQueryOptions<ApiResponse<PageResponse<T>>, Error>,
  'queryKey' | 'queryFn'
>;

export type ItemQueryOptions<T> = Omit<
  UseQueryOptions<ApiResponse<T>, Error>,
  'queryKey' | 'queryFn'
>;

export type CreateMutationOptions<TRequest, TResponse, TContext = unknown> = UseMutationOptions<
  ApiResponse<TResponse>,
  Error,
  TRequest,
  TContext
>;

export type UpdateMutationOptions<TRequest, TResponse, TContext = unknown> = UseMutationOptions<
  ApiResponse<TResponse>,
  Error,
  { id: string; data: Partial<TRequest> },
  TContext
>;

export type DeleteMutationOptions<TContext = unknown> = UseMutationOptions<
  ApiResponse<void>,
  Error,
  string,
  TContext
>;

/**
 * Common hook factory for list queries (pagination)
 * @param queryKey Query key
 * @param queryFn Query function
 * @param options Query options
 * @returns ApiResponse<PageResponse<T>>
 */
export const useListQuery = <T>(
  queryKey: QueryKey,
  queryFn: () => Promise<ApiResponse<PageResponse<T>>>,
  options?: ListQueryOptions<T>
) => {
  const query = useQuery({
    queryKey,
    queryFn,
    enabled: true,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    ...options,
  });

  const stabilizedData = useMemo(() => ({
    data: query.data?.data?.content || [],
    pagination: query.data?.data ? {
      total: query.data.data.total,
      page: query.data.data.page,
      limit: query.data.data.limit,
      pages: query.data.data.pages,
      last: query.data.data.last,
    } : undefined,
  }), [query.data]);

  return {
    data: stabilizedData,
    response: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    refetch: query.refetch,
    status: query.status,
  };
};

/**
 * Common hook factory for single item queries
 * @param queryKey Query key
 * @param queryFn Query function
 * @param options Query options
 * @returns ApiResponse<T>
 */
export const useItemQuery = <T>(
  queryKey: QueryKey,
  queryFn: () => Promise<ApiResponse<T>>,
  options?: ItemQueryOptions<T>
) => {
  const query = useQuery({
    queryKey,
    queryFn,
    staleTime: 10 * 60 * 1000,
    ...options,
  });

  const data = useMemo(() => query.data?.data || null, [query.data]);

  return {
    data,
    response: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    refetch: query.refetch,
    status: query.status,
  };
};

/**
 * Common hook factory for create mutations
 * @param mutationFn Mutation function
 * @param invalidateKeys Query keys to invalidate
 * @param options Mutation options
 * @returns ApiResponse<TResponse>
 */
export const useCreateMutation = <TRequest, TResponse, TContext = unknown>(
  mutationFn: (data: TRequest) => Promise<ApiResponse<TResponse>>,
  invalidateKeys: QueryKey[],
  options?: CreateMutationOptions<TRequest, TResponse, TContext>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (...args) => {
      const [data] = args;
      if (data.success) {
        invalidateKeys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
      }
      options?.onSuccess?.(...args);
    },
    ...options,
  });
};

/**
 * Common hook factory for update mutations
 * @param mutationFn Mutation function
 * @param invalidateKeys Query keys to invalidate
 * @param options Mutation options
 * @returns ApiResponse<TResponse>
 */
export const useUpdateMutation = <TRequest, TResponse, TContext = unknown>(
  mutationFn: (args: { id: string; data: Partial<TRequest> }) => Promise<ApiResponse<TResponse>>,
  invalidateKeys: (variables: { id: string; data: Partial<TRequest> }) => QueryKey[],
  options?: UpdateMutationOptions<TRequest, TResponse, TContext>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (...args) => {
      const [data, variables] = args;
      if (data.success) {
        const keys = invalidateKeys(variables);
        keys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
      }
      options?.onSuccess?.(...args);
    },
    ...options,
  });
};

/**
 * Common hook factory for delete mutations
 * @param mutationFn Mutation function
 * @param invalidateKeys Query keys to invalidate
 * @param options Mutation options
 * @returns ApiResponse<void>
 */
export const useDeleteMutation = <TContext = unknown>(
  mutationFn: (id: string) => Promise<ApiResponse<void>>,
  invalidateKeys: QueryKey[],
  options?: DeleteMutationOptions<TContext>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (...args) => {
      const [data] = args;
      if (data.success) {
        invalidateKeys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
      }
      options?.onSuccess?.(...args);
    },
    ...options,
  });
};
