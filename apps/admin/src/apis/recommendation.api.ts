import { AgentEndpoint } from '@/config/api';
import {
  type ApiResponse,
  RecommendationStrategy,
  type RecommendationSyncResponse,
  type RecommendationTrainResponse,
  type RecommendationMetricsResponse,
} from '@/types';
import { AgentClient } from './agent.config';



export const RecommendationApi = {
  sync: (): Promise<ApiResponse<RecommendationSyncResponse>> =>
    AgentClient.post<RecommendationSyncResponse>(AgentEndpoint.endpoints.recommendations.sync()),

  syncBook: (bookId: string): Promise<ApiResponse<boolean>> =>
    AgentClient.post<boolean>(AgentEndpoint.endpoints.recommendations.syncBook(bookId)),

  removeBook: (bookId: string): Promise<ApiResponse<boolean>> =>
    AgentClient.delete<boolean>(AgentEndpoint.endpoints.recommendations.removeBook(bookId)),

  train: (strategy?: RecommendationStrategy): Promise<ApiResponse<RecommendationTrainResponse>> => {
    let target = 'all';
    if (strategy === RecommendationStrategy.CBF || strategy === RecommendationStrategy.IBCF) {
      target = strategy;
    }
    return AgentClient.post<RecommendationTrainResponse>(
      AgentEndpoint.endpoints.recommendations.train(),
      {},
      { params: { target } }
    );
  },

  getMetrics: (
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<RecommendationMetricsResponse>> => {
    return AgentClient.get<RecommendationMetricsResponse>(
      AgentEndpoint.endpoints.recommendations.metrics(),
      { params: { start_date: startDate, end_date: endDate } }
    );
  },
};
