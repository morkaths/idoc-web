import { type QueryKey } from '@tanstack/react-query';
import { BookmarkApi } from '@/apis/bookmark.api';
import type { BookmarkResponse, BookmarkRequest, FindParams, ApiResponse, PageResponse } from '@/types';
import { useListQuery, useItemQuery, useCreateMutation, useUpdateMutation, useDeleteMutation, type CreateMutationOptions, type UpdateMutationOptions, type DeleteMutationOptions, type ListQueryOptions, type ItemQueryOptions } from './factory';

/**
 * Hook to fetch bookmarks with pagination
 * @param params Search/filter parameters
 * @param options Query options
 */
export const useBookmarks = (
    params: FindParams = {},
    options?: ListQueryOptions<BookmarkResponse>
) => {
    return useListQuery<BookmarkResponse>(
        ['bookmarks', params],
        () => BookmarkApi.find(params),
        options
    );
};

/**
 * Hook to fetch a single bookmark by ID
 * @param id Bookmark ID
 * @param options Query options
 */
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

/**
 * Hook to create a new bookmark
 * @param options Mutation options
 */
export const useCreateBookmark = <TContext = unknown>(
    options?: CreateMutationOptions<BookmarkRequest, BookmarkResponse, TContext>
) => {
    return useCreateMutation<BookmarkRequest, BookmarkResponse, TContext>(
        (data) => BookmarkApi.create(data),
        [['bookmarks'], ['books']],
        options
    );
};

/**
 * Hook to update an existing bookmark
 * @param options Mutation options
 */
export const useUpdateBookmark = <TContext = unknown>(
    options?: UpdateMutationOptions<BookmarkRequest, BookmarkResponse, TContext>
) => {
    return useUpdateMutation<BookmarkRequest, BookmarkResponse, TContext>(
        ({ id, data }) => BookmarkApi.update(id, data),
        (variables) => [['bookmarks', variables.id], ['bookmarks']],
        options
    );
};

/**
 * Hook to delete a bookmark
 * @param options Mutation options
 */
export const useDeleteBookmark = <TContext = unknown>(
    options?: DeleteMutationOptions<TContext>
) => {
    return useDeleteMutation<TContext>(
        (id) => BookmarkApi.delete(id),
        [['bookmarks'], ['books']],
        options
    );
};

/**
 * Hook to fetch bookmark status for a list of items
 * @param items List of item IDs
 * @param options Query options
 */
export const useBookmarkStatus = (
    items: string[],
    options?: ItemQueryOptions<Record<string, BookmarkResponse>>
) => {
    return useItemQuery<Record<string, BookmarkResponse>>(
        ['bookmarks', 'status', items],
        () => BookmarkApi.status(items),
        {
            enabled: items.length > 0,
            ...options,
        }
    );
};

