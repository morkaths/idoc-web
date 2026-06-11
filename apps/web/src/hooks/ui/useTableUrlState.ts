import { useCallback, useMemo, useRef, useEffect } from 'react';
import type { ColumnFiltersState, OnChangeFn, PaginationState } from '@tanstack/react-table';

type SearchRecord = Record<string, unknown>;

export type NavigateFn = (opts: {
  search: true | SearchRecord | ((prev: SearchRecord) => Partial<SearchRecord> | SearchRecord);
  replace?: boolean;
}) => void;

type UseTableUrlStateParams = {
  search: SearchRecord;
  navigate: NavigateFn;
  pagination?: {
    pageKey?: string;
    pageSizeKey?: string;
    defaultPage?: number;
    defaultPageSize?: number;
  };
  globalFilter?: {
    enabled?: boolean;
    key?: string;
    trim?: boolean;
  };
  columnFilters?: Array<
    | {
        columnId: string;
        searchKey: string;
        type?: 'string';
        serialize?: (value: unknown) => unknown;
        deserialize?: (value: unknown) => unknown;
      }
    | {
        columnId: string;
        searchKey: string;
        type: 'array';
        serialize?: (value: unknown) => unknown;
        deserialize?: (value: unknown) => unknown;
      }
  >;
};

type UseTableUrlStateReturn = {
  globalFilter?: string;
  onGlobalFilterChange?: OnChangeFn<string>;
  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  ensurePageInRange: (pageCount: number, opts?: { resetTo?: 'first' | 'last' }) => void;
};

export function useTableUrlState(params: UseTableUrlStateParams): UseTableUrlStateReturn {
  const {
    search,
    navigate,
    pagination: paginationCfg,
    globalFilter: globalFilterCfg,
    columnFilters: columnFiltersCfg = [],
  } = params;

  const pageKey = paginationCfg?.pageKey ?? 'page';
  const pageSizeKey = paginationCfg?.pageSizeKey ?? 'pageSize';
  const defaultPage = paginationCfg?.defaultPage ?? 1;
  const defaultPageSize = paginationCfg?.defaultPageSize ?? 10;

  const globalFilterKey = globalFilterCfg?.key ?? 'filter';
  const globalFilterEnabled = globalFilterCfg?.enabled ?? true;
  const trimGlobal = globalFilterCfg?.trim ?? true;

  // Use refs to keep callbacks stable
  const searchRef = useRef(search);
  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  const initialColumnFilters: ColumnFiltersState = useMemo(() => {
    const collected: ColumnFiltersState = [];
    for (const cfg of columnFiltersCfg) {
      const raw = (search as SearchRecord)[cfg.searchKey];
      const deserialize = cfg.deserialize ?? ((v: unknown) => v);
      if (cfg.type === 'string') {
        const value = (deserialize(raw) as string) ?? '';
        if (typeof value === 'string' && value.trim() !== '') {
          collected.push({ id: cfg.columnId, value });
        }
      } else {
        const value = (deserialize(raw) as unknown[]) ?? [];
        if (Array.isArray(value) && value.length > 0) {
          collected.push({ id: cfg.columnId, value });
        }
      }
    }
    return collected;
  }, [columnFiltersCfg, search]);

  const columnFilters = initialColumnFilters;

  const pagination: PaginationState = useMemo(() => {
    const rawPage = (search as SearchRecord)[pageKey];
    const rawPageSize = (search as SearchRecord)[pageSizeKey];

    // URL params are strings, need to parse them
    const pageNum =
      typeof rawPage === 'string'
        ? parseInt(rawPage, 10)
        : typeof rawPage === 'number'
          ? rawPage
          : defaultPage;

    const pageSizeNum =
      typeof rawPageSize === 'string'
        ? parseInt(rawPageSize, 10)
        : typeof rawPageSize === 'number'
          ? rawPageSize
          : defaultPageSize;

    return {
      pageIndex: isNaN(pageNum) ? 0 : Math.max(0, pageNum - 1),
      pageSize: isNaN(pageSizeNum) ? defaultPageSize : pageSizeNum,
    };
  }, [search, pageKey, pageSizeKey, defaultPage, defaultPageSize]);

  const paginationRef = useRef(pagination);
  useEffect(() => {
    paginationRef.current = pagination;
  }, [pagination]);

  const onPaginationChange: OnChangeFn<PaginationState> = useCallback(
    (updater) => {
      const currentPagination = paginationRef.current;
      const next = typeof updater === 'function' ? updater(currentPagination) : updater;

      // Don't navigate if values haven't actually changed to avoid unnecessary re-renders
      if (
        next.pageIndex === currentPagination.pageIndex &&
        next.pageSize === currentPagination.pageSize
      ) {
        return;
      }

      const nextPage = next.pageIndex + 1;
      const nextPageSize = next.pageSize;

      const nextQuery: Record<string, string> = {};

      for (const [key, value] of Object.entries({
        ...searchRef.current,
        [pageKey]: nextPage <= defaultPage ? undefined : nextPage,
        [pageSizeKey]: nextPageSize === defaultPageSize ? undefined : nextPageSize,
      })) {
        if (value === undefined || value === null) continue;
        nextQuery[key] = String(value);
      }

      navigate({
        search: nextQuery,
      });
    },
    [pageKey, pageSizeKey, defaultPage, defaultPageSize, navigate]
  );

  const globalFilter = useMemo(() => {
    if (!globalFilterEnabled) return '';
    const raw = (search as SearchRecord)[globalFilterKey];
    return typeof raw === 'string' ? raw : '';
  }, [search, globalFilterEnabled, globalFilterKey]);

  const onGlobalFilterChange: OnChangeFn<string> | undefined = useMemo(
    () =>
      globalFilterEnabled
        ? (updater: string | ((prev: string) => string)) => {
            const next = typeof updater === 'function' ? updater(globalFilter) : updater;
            const value = trimGlobal ? next.trim() : next;

            if (value === globalFilter) return;

            navigate({
              search: (prev) => ({
                ...(prev as SearchRecord),
                [pageKey]: undefined,
                [globalFilterKey]: value ? value : undefined,
              }),
            });
          }
        : undefined,
    [globalFilterEnabled, globalFilter, trimGlobal, navigate, pageKey, globalFilterKey]
  );

  const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = useCallback(
    (updater) => {
      const next = typeof updater === 'function' ? updater(columnFilters) : updater;
      const patch: Record<string, unknown> = {};
      for (const cfg of columnFiltersCfg) {
        const found = next.find((f) => f.id === cfg.columnId);
        const serialize = cfg.serialize ?? ((v: unknown) => v);
        if (cfg.type === 'string') {
          const value = typeof found?.value === 'string' ? (found.value as string) : '';
          patch[cfg.searchKey] = value.trim() !== '' ? serialize(value) : undefined;
        } else {
          const value = Array.isArray(found?.value) ? (found!.value as unknown[]) : [];
          patch[cfg.searchKey] = value.length > 0 ? serialize(value) : undefined;
        }
      }

      const nextQuery: Record<string, string> = {};

      for (const [key, value] of Object.entries({
        ...searchRef.current,
        [pageKey]: undefined,
        ...patch,
      })) {
        if (value === undefined || value === null) continue;
        nextQuery[key] = String(value);
      }

      navigate({ search: nextQuery });
    },
    [columnFilters, columnFiltersCfg, navigate, pageKey]
  );

  const ensurePageInRange = useCallback(
    (pageCount: number, opts: { resetTo?: 'first' | 'last' } = { resetTo: 'first' }) => {
      const currentSearch = searchRef.current;
      const rawPage = currentSearch[pageKey];
      const pageNum =
        typeof rawPage === 'string'
          ? parseInt(rawPage, 10)
          : typeof rawPage === 'number'
            ? rawPage
            : defaultPage;

      if (pageCount > 0 && pageNum > pageCount) {
        const nextQuery: Record<string, string> = {};

        for (const [key, value] of Object.entries({
          ...currentSearch,
          [pageKey]: opts.resetTo === 'last' ? pageCount : undefined,
        })) {
          if (value === undefined || value === null) continue;
          nextQuery[key] = String(value);
        }

        navigate({
          replace: true,
          search: nextQuery,
        });
      }
    },
    [pageKey, defaultPage, navigate]
  );

  return {
    globalFilter: globalFilterEnabled ? globalFilter : undefined,
    onGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  };
}
