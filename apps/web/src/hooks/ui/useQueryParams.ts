import { useCallback, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { FilterItem, FindParams } from '@/types';

/**
 * Custom hook để quản lý URL query parameters theo chuẩn FindParams
 * Tự động reset page về 1 khi các params khác thay đổi (trừ khi chỉ định không reset)
 */
export function useQueryParams() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    /**
     * Parse FindParams từ URL
     */
    const params = useMemo<Partial<FindParams>>(() => {
        const result: Partial<FindParams> = {};
        const page = searchParams.get('page');
        const limit = searchParams.get('limit');
        const query = searchParams.get('query');
        const sortBy = searchParams.get('sortBy');
        const sortOrder = searchParams.get('sortOrder');

        if (page) result.page = Number(page);
        if (limit) result.limit = Number(limit);
        if (query) result.query = query;
        if (sortBy && sortOrder) result.sorts = [{ field: sortBy, direction: sortOrder as 'asc' | 'desc' }];

        const filters: FilterItem[] = [];

        searchParams.forEach((value, key) => {
            if (!['page', 'limit', 'query', 'sortBy', 'sortOrder'].includes(key)) {
                const values = value.includes(',') ? value.split(',').filter(Boolean) : value;
                filters.push({
                    field: key,
                    value: values,
                    operator: Array.isArray(values) ? 'in' : 'eq',
                });
                result[key] = values;
            }
        });

        if (filters.length > 0) {
            result.filters = filters;
        }

        return result;
    }, [searchParams]);

    /**
     * Đồng bộ hóa URL với các update mới
     */
    const setParams = useCallback(
        (
            updates: Partial<FindParams> | Record<string, string | string[] | number | null | undefined>,
            options: { replace?: boolean; preservePage?: boolean } = {}
        ) => {
            const newParams = new URLSearchParams(searchParams.toString());

            Object.entries(updates).forEach(([key, value]) => {
                if (value === null || value === undefined || value === '') {
                    newParams.delete(key);
                    return;
                }

                if (key === 'sorts' && Array.isArray(value) && value.length > 0) {
                    const sort = value[0] as import('@/types').SortItem;
                    if (sort.field && sort.direction) {
                        newParams.set('sortBy', sort.field);
                        newParams.set('sortOrder', sort.direction);
                    }
                } else if (key === 'filters' && Array.isArray(value)) {
                    value.forEach((filter: any) => {
                        if (filter.field && filter.value !== undefined && filter.value !== null) {
                            if (Array.isArray(filter.value)) {
                                newParams.set(filter.field, filter.value.join(','));
                            } else {
                                newParams.set(filter.field, String(filter.value));
                            }
                        }
                    });
                } else if (Array.isArray(value)) {
                    if (value.length) {
                        newParams.set(key, value.join(','));
                    } else {
                        newParams.delete(key);
                    }
                } else {
                    newParams.set(key, String(value));
                }
            });

            const hasNonPageUpdate = Object.keys(updates).some(key => key !== 'page');
            if (hasNonPageUpdate && !options.preservePage) {
                newParams.set('page', '1');
            }

            const url = `${pathname}?${newParams.toString()}`;
            if (options.replace) {
                router.replace(url);
            } else {
                router.push(url);
            }
        },
        [searchParams, pathname, router]
    );

    return {
        params,
        searchParams,
        getParam: (key: string) => searchParams.get(key),
        getArrayParam: (key: string) => searchParams.get(key)?.split(',').filter(Boolean) || null,
        setParams,
        removeParam: (key: string) => setParams({ [key]: null }),
        clearParams: () => router.push(pathname),
    };
}
