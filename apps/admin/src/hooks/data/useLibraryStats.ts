import { LibraryApi } from '@/apis/library.api';
import type { LibraryStatsResponse } from '@/types';
import { useItemQuery, type ItemQueryOptions } from './factory';

/**
 * Hook to fetch library statistics from the server.
 * @param options - Query options for the library stats query.
 * @returns A query result containing the library statistics.
 */
export const useLibraryStats = (options?: ItemQueryOptions<LibraryStatsResponse>) => {
  return useItemQuery<LibraryStatsResponse>(
    ['library', 'stats'],
    () => LibraryApi.getStats(),
    options
  );
};
