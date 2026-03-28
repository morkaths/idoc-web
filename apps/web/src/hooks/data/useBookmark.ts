import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';
import { BookmarkApi } from '@/apis/bookmark.api';
import type { Bookmark, BookmarkRequest, FindParams, Pagination } from '@/types';

type PaginationResponse = { data: Bookmark[]; pagination?: Pagination };

export const useBookmarks = (
    params: FindParams = {},
    options?: Omit<UseQueryOptions<PaginationResponse, Error, PaginationResponse, QueryKey>, 'queryKey' | 'queryFn'>
) => {
    const query = useQuery<PaginationResponse, Error, PaginationResponse, QueryKey>({
        queryKey: ['bookmarks', params],
        queryFn: () => BookmarkApi.find(params),
        enabled: true,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
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

export const useBookmark = (id: string, options?: Omit<UseQueryOptions<Bookmark, Error, Bookmark, QueryKey>, 'queryKey' | 'queryFn'>) => {
    const query = useQuery<Bookmark, Error, Bookmark, QueryKey>({
        queryKey: ['bookmarks', id],
        queryFn: () => BookmarkApi.findById(id),
        enabled: !!id,
        staleTime: 10 * 60 * 1000,
        ...options,
    });

    return {
        ...query,
        data: query.data || null,
    };
};

export const useCreateBookmark = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: BookmarkRequest) => BookmarkApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
        },
    });
};

export const useUpdateBookmark = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<BookmarkRequest> }) => BookmarkApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['bookmarks', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
        },
    });
};

export const useDeleteBookmark = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => BookmarkApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
        },
    });
};

export const useBookmarkStatus = (itemIds: string[], options?: Omit<UseQueryOptions<Record<string, string>, Error, Record<string, string>, QueryKey>, 'queryKey' | 'queryFn'>) => {
    return useQuery<Record<string, string>, Error, Record<string, string>, QueryKey>({
        queryKey: ['bookmarks', 'status', itemIds],
        queryFn: () => BookmarkApi.status(itemIds),
        enabled: itemIds.length > 0,
        staleTime: 5 * 60 * 1000,
        ...options,
    });
};
