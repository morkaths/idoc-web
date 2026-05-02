import { BookmarkApi } from '@/apis/bookmark.api';
import type { BookmarkResponse, BookmarkRequest, FindParams } from '@/types';
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

export const useBookmarks = (
  params: FindParams = {},
  options?: ListQueryOptions<BookmarkResponse>
) => {
  return useListQuery<BookmarkResponse>(
    ['bookmarks', params],
    () => BookmarkApi.find(params),
    {
      staleTime: 5 * 60 * 1000,
      ...options,
    }
  );
};

export const useBookmark = (
  id: string,
  options?: ItemQueryOptions<BookmarkResponse>
) => {
  return useItemQuery<BookmarkResponse>(
    ['bookmarks', id],
    () => BookmarkApi.findById(id),
    {
      enabled: !!id,
      ...options,
    }
  );
};

export const useCreateBookmark = (
  options?: CreateMutationOptions<BookmarkRequest, BookmarkResponse>
) => {
  return useCreateMutation<BookmarkRequest, BookmarkResponse>(
    (data) => BookmarkApi.create(data),
    [['bookmarks']],
    options
  );
};

export const useUpdateBookmark = (
  options?: UpdateMutationOptions<BookmarkRequest, BookmarkResponse>
) => {
  return useUpdateMutation<BookmarkRequest, BookmarkResponse>(
    ({ id, data }) => BookmarkApi.update(id, data),
    (variables) => [['bookmarks', variables.id], ['bookmarks']],
    options
  );
};

export const useDeleteBookmark = (options?: DeleteMutationOptions) => {
  return useDeleteMutation(
    (id) => BookmarkApi.delete(id),
    [['bookmarks']],
    options
  );
};

export const useBookmarkStatus = (
  itemIds: string[],
  options?: ItemQueryOptions<Record<string, string | null>>
) => {
  return useItemQuery<Record<string, string | null>>(
    ['bookmarks', 'status', itemIds],
    () => BookmarkApi.status(itemIds),
    {
      enabled: itemIds.length > 0,
      staleTime: 5 * 60 * 1000,
      ...options,
    }
  );
};

