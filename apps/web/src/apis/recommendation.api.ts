import { AgentEndpoint } from '@/config/api';
import { AgentClient } from './agent.config';
import { type ApiResponse, type RecommendationResponse, RecommendationStrategy } from '@/types';

export const RecommendationApi = {
  syncData: (): Promise<ApiResponse<void>> =>
    AgentClient.get<void>(
      AgentEndpoint.endpoints.recommendations.sync()
    ),

  getPopular: (): Promise<ApiResponse<RecommendationResponse>> =>
    AgentClient.get<RecommendationResponse>(
      AgentEndpoint.endpoints.recommendations.popular()
    ),

  getSimilar: (bookId: string): Promise<ApiResponse<RecommendationResponse>> =>
    AgentClient.get<RecommendationResponse>(
      AgentEndpoint.endpoints.recommendations.similar(bookId)
    ),

  getContentBased: (userId: string): Promise<ApiResponse<RecommendationResponse>> =>
    AgentClient.get<RecommendationResponse>(
      AgentEndpoint.endpoints.recommendations.content(userId)
    ),

  getUserBased: (userId: string): Promise<ApiResponse<RecommendationResponse>> =>
    AgentClient.get<RecommendationResponse>(
      AgentEndpoint.endpoints.recommendations.userBased(userId)
    ),

  getItemBased: (userId: string): Promise<ApiResponse<RecommendationResponse>> =>
    AgentClient.get<RecommendationResponse>(
      AgentEndpoint.endpoints.recommendations.itemBased(userId)
    ),

  getSVD: (userId: string): Promise<ApiResponse<RecommendationResponse>> =>
    AgentClient.get<RecommendationResponse>(
      AgentEndpoint.endpoints.recommendations.svd(userId)
    ),

  getHybrid: (userId: string): Promise<ApiResponse<RecommendationResponse>> =>
    AgentClient.get<RecommendationResponse>(
      AgentEndpoint.endpoints.recommendations.hybrid(userId)
    ),

  getForUser: (
    userId: string,
    strategy: RecommendationStrategy = RecommendationStrategy.HYBRID
  ): Promise<ApiResponse<RecommendationResponse>> => {
    switch (strategy) {
      case RecommendationStrategy.POPULARITY:
        return RecommendationApi.getPopular();
      case RecommendationStrategy.CONTENT:
        return RecommendationApi.getContentBased(userId);
      case RecommendationStrategy.USER_BASED:
        return RecommendationApi.getUserBased(userId);
      case RecommendationStrategy.ITEM_BASED:
        return RecommendationApi.getItemBased(userId);
      case RecommendationStrategy.SVD:
        return RecommendationApi.getSVD(userId);
      case RecommendationStrategy.HYBRID:
      default:
        return RecommendationApi.getHybrid(userId);
    }
  },
};


