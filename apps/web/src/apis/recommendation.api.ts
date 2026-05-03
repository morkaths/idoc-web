import { ApiEndpoint } from '@/config/api';
import { AgentClient } from './agent.config';
import type { ApiResponse } from '@/types';

/** Strategies supported by the recommendation engine */
export type RecommendationStrategy =
  | 'popularity'
  | 'content'
  | 'user_based'
  | 'item_based'
  | 'svd'
  | 'hybrid';

/** A single recommendation item returned by the Agent */
export interface RecommendationItem {
  id: string;
  title: string;
  score: number;
  reason: string;
}

/** Full response from Agent recommendation endpoint */
export interface RecommendationResponse {
  user_id: string;
  strategy: RecommendationStrategy;
  items: RecommendationItem[];
}

export const RecommendationApi = {
  /**
   * Fetches personalized book recommendations for a user.
   * @param userId - The ID of the current user
   * @param strategy - Recommendation algorithm (default: 'hybrid')
   * @returns List of { id, title, score, reason } items
   */
  getForUser: (
    userId: string,
    strategy: RecommendationStrategy = 'hybrid'
  ): Promise<ApiResponse<RecommendationResponse>> =>
    AgentClient.get<RecommendationResponse>(
      ApiEndpoint.agent.recommendation(userId),
      { params: { strategy } }
    ),

  /**
   * Fetches books similar to a given book (item-based).
   * @param bookId - The ID of the source book
   */
  getSimilarBooks: (bookId: string): Promise<ApiResponse<RecommendationResponse>> =>
    AgentClient.get<RecommendationResponse>(
      ApiEndpoint.agent.similarBooks(bookId)
    ),
};
