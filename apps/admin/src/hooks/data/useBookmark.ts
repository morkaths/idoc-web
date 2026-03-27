import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';
import { BookmarkApi } from '@/apis/bookmark.api';
import type { Bookmark, BookmarkRequest, FindParams, Pagination } from '@/types';

type PaginationResponse = { data: Bookmark[]; pagination?: Pagination };

export const useBookmarks = (
    params: FindParams = {},
    options?: Omit<UseQueryOptions<PaginationResponse, Error, PaginationResponse, QueryKey>, 'queryKey' | 'queryFn'>
) => {
    return useQuery<PaginationResponse, Error, PaginationResponse, QueryKey>({
        queryKey: ['bookmarks', params],
        queryFn: async () => await BookmarkApi.find(params),
        enabled: true,
        refetchOnWindowFocus: false,
        staleTime: 5 * 60 * 1000,
        select: (data) => ({
            data: data.data,
            pagination: data.pagination,
        }),
        ...options,
    });
};

export const useBookmark = (id: string) => {
    return useQuery({
        queryKey: ['bookmarks', id],
        queryFn: () => BookmarkApi.findById(id),
        enabled: !!id,
        staleTime: 10 * 60 * 1000,
    });
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
export const useBookmarkStatus = (itemIds: string[]) => {
    return useQuery({
        queryKey: ['bookmarks', 'status', itemIds],
        queryFn: () => BookmarkApi.status(itemIds),
        enabled: itemIds.length > 0,
        staleTime: 5 * 60 * 1000,
    });
};
