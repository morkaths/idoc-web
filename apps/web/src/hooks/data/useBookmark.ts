import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';
import { BookmarkApi } from '@/apis/bookmark.api';
import type { BookmarkResponse, BookmarkRequest, FindParams, Pagination } from '@/types';
import { useMemo } from 'react';

type PaginationResponse = { data: BookmarkResponse[]; pagination?: Pagination };

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

    const stabilizedData = useMemo(() => ({
        data: query.data?.data || [],
        pagination: query.data?.pagination,
    }), [query.data]);

    return useMemo(() => ({
        ...query,
        data: stabilizedData,
    }), [query, stabilizedData]);
};

export const useBookmark = (id: string, options?: Omit<UseQueryOptions<BookmarkResponse, Error, BookmarkResponse, QueryKey>, 'queryKey' | 'queryFn'>) => {
    const query = useQuery<BookmarkResponse, Error, BookmarkResponse, QueryKey>({
        queryKey: ['bookmarks', id],
        queryFn: () => BookmarkApi.findById(id),
        enabled: !!id,
        staleTime: 10 * 60 * 1000,
        ...options,
    });

    const data = useMemo(() => query.data || null, [query.data]);

    return useMemo(() => ({
        ...query,
        data,
    }), [query, data]);
};

export const useCreateBookmark = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: BookmarkRequest) => BookmarkApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
            queryClient.invalidateQueries({ queryKey: ['books'] });
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
            queryClient.invalidateQueries({ queryKey: ['books'] });
        },
    });
};

export const useBookmarkStatus = (items: string[], options?: Omit<UseQueryOptions<Record<string, BookmarkResponse>, Error, Record<string, BookmarkResponse>, QueryKey>, 'queryKey' | 'queryFn'>) => {
    const query = useQuery<Record<string, BookmarkResponse>, Error, Record<string, BookmarkResponse>, QueryKey>({
        queryKey: ['bookmarks', 'status', items],
        queryFn: () => BookmarkApi.status(items),
        enabled: items.length > 0,
        staleTime: 5 * 60 * 1000,
        ...options,
    });

    const data = useMemo(() => query.data || {}, [query.data]);

    return useMemo(() => ({
        ...query,
        data,
    }), [query, data]);
};
