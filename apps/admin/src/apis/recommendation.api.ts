import { ApiEndpoint } from '@/config/api';
import {
  type ApiResponse,
  TrainingTarget,
  type RecommendationSyncResponse,
  type RecommendationTrainResponse,
  type RecommendationMetricsResponse,
} from '@/types';
import { ApiClient } from './config';

export const RecommendationApi = {
  sync: (): Promise<ApiResponse<RecommendationSyncResponse>> =>
    ApiClient.post<RecommendationSyncResponse>(ApiEndpoint.endpoints.recommendations.sync()),

  syncBook: (bookId: string): Promise<ApiResponse<boolean>> =>
    ApiClient.post<boolean>(ApiEndpoint.endpoints.recommendations.syncBook(bookId)),

  removeBook: (bookId: string): Promise<ApiResponse<boolean>> =>
    ApiClient.delete<boolean>(ApiEndpoint.endpoints.recommendations.removeBook(bookId)),

  train: (
    target: TrainingTarget = TrainingTarget.ALL
  ): Promise<ApiResponse<RecommendationTrainResponse>> => {
    return ApiClient.post<RecommendationTrainResponse>(
      ApiEndpoint.endpoints.recommendations.train(),
      { params: { target } }
    );
  },

  getMetrics: (
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<RecommendationMetricsResponse>> => {
    return ApiClient.get<RecommendationMetricsResponse>(
      ApiEndpoint.endpoints.recommendations.metrics(),
      { params: { startDate, endDate } }
    );
  },
};
