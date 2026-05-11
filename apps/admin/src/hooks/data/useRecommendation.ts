import { useMutation } from '@tanstack/react-query';
import { RecommendationApi } from '@/apis/recommendation.api';
import { type RecommendationStrategy } from '@/types';
import { useItemQuery } from './factory';

export const useRecommendationSync = () => {
  return useMutation({
    mutationFn: () => RecommendationApi.sync(),
  });
};

export const useRecommendationTrain = () => {
  return useMutation({
    mutationFn: (strategy?: RecommendationStrategy) => RecommendationApi.train(strategy),
  });
};

export const useRecommendationEvaluation = (strategy: RecommendationStrategy) => {
  return useItemQuery(
    ['recommendations', 'evaluation', strategy],
    () => RecommendationApi.evaluate(strategy),
    {
      enabled: !!strategy,
      staleTime: 0,
    }
  );
};
