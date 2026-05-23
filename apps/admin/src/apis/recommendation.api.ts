import { AgentEndpoint } from '@/config/api';
import {
  type ApiResponse,
  type RecommendationStrategy,
  type RecommendationSyncResponse,
  type RecommendationTrainResponse,
  type RecommendationEvaluationResponse,
} from '@/types';
import { AgentClient } from './agent.config';

/**
 * Maps frontend recommendation strategy to the corresponding backend Enum string.
 * @param {string} strategy - The frontend recommendation strategy.
 * @returns {string} The backend compatible recommendation strategy.
 */
const mapStrategy = (strategy: string): string => {
  switch (strategy) {
    case 'content':
      return 'cbf';
    case 'item_based':
      return 'ibcf';
    case 'popularity':
    case 'hybrid':
      return strategy;
    default:
      return 'hybrid';
  }
};

export const RecommendationApi = {
  sync: (): Promise<ApiResponse<RecommendationSyncResponse>> =>
    AgentClient.post<RecommendationSyncResponse>(AgentEndpoint.endpoints.recommendations.sync()),

  train: (strategy?: RecommendationStrategy): Promise<ApiResponse<RecommendationTrainResponse>> => {
    let target = 'all';
    if (strategy === 'content') {
      target = 'cbf';
    } else if (strategy === 'item_based') {
      target = 'ibcf';
    }
    return AgentClient.post<RecommendationTrainResponse>(
      AgentEndpoint.endpoints.recommendations.train(),
      {},
      { params: { target } }
    );
  },

  evaluate: (
    strategy: RecommendationStrategy
  ): Promise<
    ApiResponse<RecommendationEvaluationResponse | RecommendationEvaluationResponse[]>
  > => {
    const mappedStrategy = mapStrategy(strategy);
    return AgentClient.get<RecommendationEvaluationResponse | RecommendationEvaluationResponse[]>(
      AgentEndpoint.endpoints.recommendations.evaluate(mappedStrategy)
    );
  },
};
