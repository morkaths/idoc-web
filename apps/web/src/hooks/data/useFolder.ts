import { FolderApi } from '@/apis/folder.api';
import type { FolderResponse, FolderRequest, PageParams } from '@/types';
import { useListQuery, useItemQuery, useCreateMutation, useUpdateMutation, useDeleteMutation, type ListQueryOptions, type ItemQueryOptions, type CreateMutationOptions, type UpdateMutationOptions, type DeleteMutationOptions } from './factory';

/**
 * Hook to fetch folders with pagination
 * @param params Page parameters
 * @param options Query options
 */
export const useFolders = (
    params: PageParams = {},
    options?: ListQueryOptions<FolderResponse>
) => {
    return useListQuery<FolderResponse>(
        ['folders', params],
        () => FolderApi.find(params),
        options
    );
};

/**
 * Hook to fetch current user's folders with pagination
 * @param params Page parameters
 * @param options Query options
 */
export const useMyFolders = (
    params: PageParams = {},
    options?: ListQueryOptions<FolderResponse>
) => {
    return useListQuery<FolderResponse>(
        ['folders', 'me', params],
        () => FolderApi.findMe(params),
        {
            staleTime: 0,
            ...options,
        }
    );
};


/**
 * Hook to fetch a single folder by ID
 * @param id Folder ID
 * @param options Query options
 */
export const useFolder = (
    id: string,
    options?: ItemQueryOptions<FolderResponse>
) => {
    return useItemQuery<FolderResponse>(
        ['folders', id],
        () => FolderApi.findById(id),
        {
            enabled: !!id,
            ...options,
        }
    );
};

/**
 * Hook to create a new folder
 * @param options Mutation options
 */
export const useCreateFolder = <TContext = unknown>(
    options?: CreateMutationOptions<FolderRequest, FolderResponse, TContext>
) => {
    return useCreateMutation<FolderRequest, FolderResponse, TContext>(
        (data) => FolderApi.create(data),
        [['folders']],
        options
    );
};

/**
 * Hook to update an existing folder
 * @param options Mutation options
 */
export const useUpdateFolder = <TContext = unknown>(
    options?: UpdateMutationOptions<FolderRequest, FolderResponse, TContext>
) => {
    return useUpdateMutation<FolderRequest, FolderResponse, TContext>(
        ({ id, data }) => FolderApi.update(id, data),
        (variables) => [['folders'], ['folders', variables.id]],
        options
    );
};

/**
 * Hook to delete a folder
 * @param options Mutation options
 */
export const useDeleteFolder = <TContext = unknown>(
    options?: DeleteMutationOptions<TContext>
) => {
    return useDeleteMutation<TContext>(
        (id) => FolderApi.delete(id),
        [['folders']],
        options
    );
};

