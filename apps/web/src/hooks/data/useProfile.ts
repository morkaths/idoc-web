import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query';
import { ProfileApi } from '@/apis';
import type { Profile, FindParams, Pagination } from '@/types';

type ProfileResponse = { data: Profile[]; pagination?: Pagination };

export const useProfiles = (
    params: FindParams = {},
    options?: Omit<UseQueryOptions<ProfileResponse, Error, ProfileResponse, any[]>, 'queryKey' | 'queryFn'>
) => {
    return useQuery<ProfileResponse, Error, ProfileResponse, any[]>({
        queryKey: ['profiles', params],
        queryFn: async () => {
            const res = await ProfileApi.find(params);
            return res;
        },
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

export const useProfile = (id: string) => {
    return useQuery({
        queryKey: ['profiles', id],
        queryFn: () => ProfileApi.findById(id),
        enabled: !!id,
        staleTime: 10 * 60 * 1000,
    });
};

export const useMyProfile = () => {
    return useQuery({
        queryKey: ['profiles', 'me'],
        queryFn: () => ProfileApi.me(),
        staleTime: 10 * 60 * 1000,
    });
};

export const useCreateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (newProfile: Partial<Profile>) => ProfileApi.create(newProfile),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profiles'] });
        },
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Profile> }) => ProfileApi.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['profiles', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['profiles'] });
            queryClient.invalidateQueries({ queryKey: ['profiles', 'me'] });
        },
    });
};

export const useDeleteProfile = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => ProfileApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profiles'] });
        },
    });
};
