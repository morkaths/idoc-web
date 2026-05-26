import { AgentEndpoint } from '@/config/api';
import {
  type ApiResponse,
  type RecommendationResponse,
  RecommendationStrategy,
  type FeedRequest,
  type FeedResponse,
  type RecommendationInteractionRequest,
  type SimilarBooksResponse,
} from '@/types';
import { AgentClient } from './agent.config';

export const RecommendationApi = {
  getPopular: (page?: number, limit?: number): Promise<ApiResponse<RecommendationResponse>> => {
    const resolvedLimit = limit ?? 10;
    const offset = ((page ?? 1) - 1) * resolvedLimit;
    return AgentClient.get<RecommendationResponse>(
      AgentEndpoint.endpoints.recommendations.recommend('anonymous', 'popularity'),
      { params: { limit: resolvedLimit, offset } }
    );
  },

  getSimilar: (
    bookId: string,
    page?: number,
    limit?: number
  ): Promise<ApiResponse<SimilarBooksResponse>> => {
    const resolvedLimit = limit ?? 10;
    const offset = ((page ?? 1) - 1) * resolvedLimit;
    return AgentClient.get<SimilarBooksResponse>(
      AgentEndpoint.endpoints.recommendations.similar(bookId),
      { params: { limit: resolvedLimit, offset } }
    );
  },

  getForUser: (
    userId: string,
    strategy: RecommendationStrategy = RecommendationStrategy.HYBRID,
    page?: number,
    limit?: number
  ): Promise<ApiResponse<RecommendationResponse>> => {
    if (strategy === RecommendationStrategy.POPULARITY && userId === 'anonymous') {
      return RecommendationApi.getPopular(page, limit);
    }

    const resolvedLimit = limit ?? 10;
    const offset = ((page ?? 1) - 1) * resolvedLimit;
    return AgentClient.get<RecommendationResponse>(
      AgentEndpoint.endpoints.recommendations.recommend(userId, strategy),
      { params: { limit: resolvedLimit, offset } }
    );
  },

  getFeed: (req: FeedRequest): Promise<ApiResponse<FeedResponse>> =>
    AgentClient.post<FeedResponse>(AgentEndpoint.endpoints.recommendations.feed(), req),

  logInteraction: (req: RecommendationInteractionRequest): Promise<ApiResponse<boolean>> =>
    AgentClient.post<boolean>(AgentEndpoint.endpoints.recommendations.interactions(), req),
};
