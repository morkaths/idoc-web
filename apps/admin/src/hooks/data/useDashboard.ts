import { DashboardApi } from '@/apis';
import type { DashboardStatsResponse } from '@/types';
import { useItemQuery, type ItemQueryOptions } from './factory';

/**
 * Hook to fetch dashboard stats from the server
 * @param options Query options
 */
export const useDashboardStats = (options?: ItemQueryOptions<DashboardStatsResponse>) => {
  return useItemQuery<DashboardStatsResponse>(
    ['dashboard', 'stats'],
    () => DashboardApi.getStats(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes stale time
      ...options,
    }
  );
};
