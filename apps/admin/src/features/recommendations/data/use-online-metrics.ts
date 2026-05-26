import { useMemo } from 'react';
import { type ChartConfig } from '@repo/ui/components/chart';

export interface OnlineMetricItem {
  date: string;
  strategy: string;
  impressions: number;
  fallbacks: number;
  avgLatencyMs: number;
  clicks: number;
  borrows: number;
  ctr: number;
  cvr: number;
}

export interface StrategyDistItem {
  strategy: string;
  count: number;
  percentage: number;
}

export interface UseOnlineMetricsProps {
  onlineMetrics: OnlineMetricItem[];
  strategyDistribution: StrategyDistItem[];
}

const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

export const IMPRESSIONS_CHART_CONFIG = {
  impressions: {
    label: 'Impressions',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export const LATENCY_CHART_CONFIG = {
  avgLatencyMs: {
    label: 'Avg Latency',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

/**
 * Custom hook to prepare and calculate metrics data for the OnlineMetrics dashboard.
 * @param {UseOnlineMetricsProps} props - The hook inputs containing online metrics and strategy distribution.
 * @returns {object} Calculated and formatted charts and summary datasets.
 */
export function useOnlineMetrics({
  onlineMetrics = [],
  strategyDistribution = [],
}: UseOnlineMetricsProps) {
  const normalizedOnlineMetrics = useMemo(() => {
    return onlineMetrics.map((item) => ({
      ...item,
      strategy: item.strategy,
    }));
  }, [onlineMetrics]);

  const normalizedStrategyDistribution = useMemo(() => {
    return strategyDistribution.map((item) => ({
      ...item,
      strategy: item.strategy,
    }));
  }, [strategyDistribution]);

  // Calculate aggregated summary cards
  const summary = useMemo(() => {
    const totalImpressions = normalizedOnlineMetrics.reduce(
      (sum, item) => sum + item.impressions,
      0
    );
    const totalClicks = normalizedOnlineMetrics.reduce((sum, item) => sum + item.clicks, 0);
    const totalBorrows = normalizedOnlineMetrics.reduce((sum, item) => sum + item.borrows, 0);
    const totalFallbacks = normalizedOnlineMetrics.reduce((sum, item) => sum + item.fallbacks, 0);

    const totalWeightedLatency = normalizedOnlineMetrics.reduce(
      (sum, item) => sum + item.avgLatencyMs * item.impressions,
      0
    );
    const avgLatencyMs = totalImpressions > 0 ? totalWeightedLatency / totalImpressions : 0;

    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const cvr = totalImpressions > 0 ? (totalBorrows / totalImpressions) * 100 : 0;
    const fallbackRate = totalImpressions > 0 ? (totalFallbacks / totalImpressions) * 100 : 0;

    return {
      totalImpressions,
      avgLatencyMs,
      ctr,
      cvr,
      fallbackRate,
    };
  }, [normalizedOnlineMetrics]);

  // Aggregate data by strategy for chart visualization
  const strategyAggregates = useMemo(() => {
    const aggregates: Record<
      string,
      {
        strategy: string;
        impressions: number;
        clicks: number;
        borrows: number;
        fallbacks: number;
        totalLatency: number;
        latencyCount: number;
      }
    > = {};

    normalizedOnlineMetrics.forEach((m) => {
      const s = m.strategy;
      if (!aggregates[s]) {
        aggregates[s] = {
          strategy: s,
          impressions: 0,
          clicks: 0,
          borrows: 0,
          fallbacks: 0,
          totalLatency: 0,
          latencyCount: 0,
        };
      }
      aggregates[s].impressions += m.impressions;
      aggregates[s].clicks += m.clicks;
      aggregates[s].borrows += m.borrows;
      aggregates[s].fallbacks += m.fallbacks;
      aggregates[s].totalLatency += m.avgLatencyMs * m.impressions;
      aggregates[s].latencyCount += m.impressions;
    });

    return Object.values(aggregates).map((agg) => {
      const ctr = agg.impressions > 0 ? (agg.clicks / agg.impressions) * 100 : 0;
      const cvr = agg.impressions > 0 ? (agg.borrows / agg.impressions) * 100 : 0;
      const avgLatencyMs = agg.latencyCount > 0 ? agg.totalLatency / agg.latencyCount : 0;
      return {
        strategy: agg.strategy,
        impressions: agg.impressions,
        avgLatencyMs,
        ctr,
        cvr,
        fallbacks: agg.fallbacks,
      };
    });
  }, [normalizedOnlineMetrics]);

  const strategyChartConfig = useMemo(() => {
    const config: ChartConfig = {
      count: {
        label: 'Calls',
      },
    };
    normalizedStrategyDistribution.forEach((item, index) => {
      config[item.strategy] = {
        label: item.strategy,
        color: CHART_COLORS[index % CHART_COLORS.length],
      };
    });
    return config;
  }, [normalizedStrategyDistribution]);

  return {
    normalizedOnlineMetrics,
    normalizedStrategyDistribution,
    summary,
    strategyAggregates,
    strategyChartConfig,
    impressionsChartConfig: IMPRESSIONS_CHART_CONFIG,
    latencyChartConfig: LATENCY_CHART_CONFIG,
  };
}
