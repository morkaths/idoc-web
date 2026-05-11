import { AgentEndpoint } from '@/config/api';
import { AgentClient } from './agent.config';
import {
  type ApiResponse,
  type RecommendationResponse,
  RecommendationStrategy,
} from '@/types';

export const RecommendationApi = {
  getPopular: (): Promise<ApiResponse<RecommendationResponse>> =>
    AgentClient.get<RecommendationResponse>(
      AgentEndpoint.endpoints.recommendations.popular()
    ),

  getSimilar: (bookId: string): Promise<ApiResponse<RecommendationResponse>> =>
    AgentClient.get<RecommendationResponse>(
      AgentEndpoint.endpoints.recommendations.similar(bookId)
    ),

  getForUser: (
    userId: string,
    strategy: RecommendationStrategy = RecommendationStrategy.HYBRID
  ): Promise<ApiResponse<RecommendationResponse>> => {
    if (strategy === RecommendationStrategy.POPULARITY && userId === 'anonymous') {
      return RecommendationApi.getPopular();
    }

    return AgentClient.get<RecommendationResponse>(
      AgentEndpoint.endpoints.recommendations.recommend(userId, strategy)
    );
  },
};
