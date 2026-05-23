import { AgentEndpoint } from '@/config/api';
import { type ApiResponse, type RecommendationResponse, RecommendationStrategy } from '@/types';
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
  getPopular: (): Promise<ApiResponse<RecommendationResponse>> =>
    AgentClient.get<RecommendationResponse>(AgentEndpoint.endpoints.recommendations.popular()),

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

    const mappedStrategy = mapStrategy(strategy);

    return AgentClient.get<RecommendationResponse>(
      AgentEndpoint.endpoints.recommendations.recommend(userId, mappedStrategy)
    );
  },
};
