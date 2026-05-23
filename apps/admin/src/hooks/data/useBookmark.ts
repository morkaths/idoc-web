import { BookmarkApi } from '@/apis/bookmark.api';
import type { BookmarkResponse, BookmarkRequest, FindParams, PageParams } from '@/types';
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
 * Hook to fetch bookmarks
 * @param params Pagination parameters
 * @param options Query options
 */
export const useBookmarks = (
  params: PageParams = {},
  options?: ListQueryOptions<BookmarkResponse>
) => {
  return useListQuery<BookmarkResponse>(
    ['bookmarks', params],
    () => BookmarkApi.find(params),
    options
  );
};

/**
 * Hook to search bookmarks
 * @param params Search parameters
 * @param options Query options
 */
export const useSearchBookmarks = (
  params: FindParams = {},
  options?: ListQueryOptions<BookmarkResponse>
) => {
  return useListQuery<BookmarkResponse>(
    ['bookmarks', 'search', params],
    () => BookmarkApi.search(params),
    options
  );
};

/**
 * Hook to fetch a single bookmark by ID
 * @param id Bookmark ID
 * @param options Query options
 */
export const useBookmark = (id: string, options?: ItemQueryOptions<BookmarkResponse>) => {
  return useItemQuery<BookmarkResponse>(['bookmarks', id], () => BookmarkApi.findById(id), {
    enabled: !!id,
    ...options,
  });
};

/**
 * Hook to create a new bookmark
 * @param options Mutation options
 */
export const useCreateBookmark = (
  options?: CreateMutationOptions<BookmarkRequest, BookmarkResponse>
) => {
  return useCreateMutation<BookmarkRequest, BookmarkResponse>(
    (data) => BookmarkApi.create(data),
    [['bookmarks']],
    options
  );
};

/**
 * Hook to update an existing bookmark
 * @param options Mutation options
 */
export const useUpdateBookmark = (
  options?: UpdateMutationOptions<BookmarkRequest, BookmarkResponse>
) => {
  return useUpdateMutation<BookmarkRequest, BookmarkResponse>(
    ({ id, data }) => BookmarkApi.update(id, data),
    (variables) => [['bookmarks', variables.id], ['bookmarks']],
    options
  );
};

/**
 * Hook to delete a bookmark
 * @param options Mutation options
 */
export const useDeleteBookmark = (options?: DeleteMutationOptions) => {
  return useDeleteMutation((id) => BookmarkApi.delete(id), [['bookmarks']], options);
};

/**
 * Hook to fetch bookmark status
 * @param itemIds List of item IDs
 * @param options Query options
 */
export const useBookmarkStatus = (
  itemIds: string[],
  options?: ItemQueryOptions<Record<string, string | null>>
) => {
  return useItemQuery<Record<string, string | null>>(
    ['bookmarks', 'status', itemIds],
    () => BookmarkApi.status(itemIds),
    { enabled: itemIds.length > 0, ...options }
  );
};
