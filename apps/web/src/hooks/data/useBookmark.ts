import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { BookmarkApi } from '@/apis/bookmark.api';
import type { Bookmark, FindParams, Pagination } from '@/types';

type BookmarkResponse = { data: Bookmark[]; pagination?: Pagination };

export const useBookmarks = (
    params: FindParams = {},
    options?: Omit<UseQueryOptions<BookmarkResponse, Error, BookmarkResponse, any[]>, 'queryKey' | 'queryFn'>
) => {
    return useQuery<BookmarkResponse, Error, BookmarkResponse, any[]>({
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
        mutationFn: (newBookmark: Partial<Bookmark>) => BookmarkApi.create(newBookmark),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
        },
    });
};

export const useUpdateBookmark = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Bookmark> }) => BookmarkApi.update(id, data),
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
