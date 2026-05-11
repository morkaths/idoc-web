import { AgentEndpoint } from '@/config/api';
import { AgentClient } from './agent.config';
import {
  type ApiResponse,
  type RecommendationStrategy,
  type RecommendationSyncResponse,
  type RecommendationTrainResponse,
  type RecommendationEvaluationResponse,
} from '@/types';

export const RecommendationApi = {

  sync: (): Promise<ApiResponse<RecommendationSyncResponse>> =>
    AgentClient.post<RecommendationSyncResponse>(
      AgentEndpoint.endpoints.recommendations.sync()
    ),

  train: (strategy?: RecommendationStrategy): Promise<ApiResponse<RecommendationTrainResponse>> =>
    AgentClient.post<RecommendationTrainResponse>(
      AgentEndpoint.endpoints.recommendations.train(),
      {},
      { params: { strategy } }
    ),

  evaluate: (
    strategy: RecommendationStrategy
  ): Promise<ApiResponse<RecommendationEvaluationResponse | RecommendationEvaluationResponse[]>> =>
    AgentClient.get<RecommendationEvaluationResponse | RecommendationEvaluationResponse[]>(
      AgentEndpoint.endpoints.recommendations.evaluate(strategy)
    ),
};
