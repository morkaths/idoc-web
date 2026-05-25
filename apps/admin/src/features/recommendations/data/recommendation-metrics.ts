import { RecommendationStrategy, type RecommendationMetricsResponse } from '@repo/types';

export type RecommendationOfflineMetric = RecommendationMetricsResponse['offlineMetrics'][number];

const getNormalizedMetricName = (metric: RecommendationOfflineMetric) => {
  return (metric.target || metric.modelName || '').toLowerCase();
};

const getStrategyTarget = (strategy: RecommendationStrategy) => {
  if (strategy === RecommendationStrategy.CBF) return 'cbf';
  if (strategy === RecommendationStrategy.IBCF) return 'ibcf';
  return 'all';
};

export function selectRecommendationOfflineMetric(
  offlineMetrics: RecommendationOfflineMetric[],
  strategy: RecommendationStrategy
) {
  const target = getStrategyTarget(strategy);

  return (
    offlineMetrics.find((metric) => getNormalizedMetricName(metric) === target) ||
    offlineMetrics.find((metric) => getNormalizedMetricName(metric) === 'all') ||
    offlineMetrics.find((metric) => getNormalizedMetricName(metric) === strategy.toLowerCase()) ||
    offlineMetrics[0]
  );
}
