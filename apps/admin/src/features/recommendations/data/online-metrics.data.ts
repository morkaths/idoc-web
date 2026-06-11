import type React from 'react';
import { Eye, Clock, Activity, AlertCircle } from 'lucide-react';

/** Skeleton bar heights (%) for the Impressions chart placeholder */
export const BAR_HEIGHTS_1 = [55, 35, 75, 45] as const;

/** Skeleton bar heights (%) for the Latency chart placeholder */
export const BAR_HEIGHTS_2 = [40, 65, 30, 55] as const;

export interface MetricCardConfig {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string; size?: number | string }>;
  description: string;
}

export interface MetricsSummary {
  totalImpressions: number;
  avgLatencyMs: number;
  ctr: number;
  cvr: number;
  fallbackRate: number;
}

/**
 * Builds the metric card config array from computed summary values.
 * Kept in data layer so the component stays purely presentational.
 * @param {MetricsSummary} summary - Aggregated metrics from useOnlineMetrics.
 * @returns {MetricCardConfig[]} Array of card configs ready for rendering.
 */
export const buildMetricCards = (summary: MetricsSummary): MetricCardConfig[] => [
  {
    title: 'Online Impressions',
    value: summary.totalImpressions.toLocaleString(),
    icon: Eye,
    description: 'Total served recommendations',
  },
  {
    title: 'Average Latency',
    value: `${summary.avgLatencyMs.toFixed(1)} ms`,
    icon: Clock,
    description: 'Weighted response latency',
  },
  {
    title: 'Overall CTR / CVR',
    value: `${summary.ctr.toFixed(2)}% / ${summary.cvr.toFixed(2)}%`,
    icon: Activity,
    description: 'Click & Borrow conversion rates',
  },
  {
    title: 'Fallback Rate',
    value: `${summary.fallbackRate.toFixed(2)}%`,
    icon: AlertCircle,
    description: 'Percentage of fallback triggers',
  },
];
