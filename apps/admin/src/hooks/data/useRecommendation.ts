import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import { RecommendationApi } from '@/apis/recommendation.api';
import {
  type ApiResponse,
  type TrainingTarget,
  type RecommendationSyncResponse,
  type RecommendationTrainResponse,
  type RecommendationMetricsResponse,
} from '@/types';
import { useItemQuery, type ItemQueryOptions } from './factory';

export const useRecommendationSync = (
  options?: UseMutationOptions<ApiResponse<RecommendationSyncResponse>, Error, void>
) => {
  return useMutation({
    mutationFn: () => RecommendationApi.sync(),
    ...options,
  });
};

export const useRecommendationTrain = (
  options?: UseMutationOptions<
    ApiResponse<RecommendationTrainResponse>,
    Error,
    TrainingTarget | undefined
  >
) => {
  return useMutation({
    mutationFn: (target?: TrainingTarget) => RecommendationApi.train(target),
    ...options,
  });
};

export const useRecommendationMetrics = (
  startDate?: string,
  endDate?: string,
  options?: ItemQueryOptions<RecommendationMetricsResponse>
) => {
  return useItemQuery(
    ['recommendations', 'metrics', startDate, endDate],
    () => RecommendationApi.getMetrics(startDate, endDate),
    options
  );
};
