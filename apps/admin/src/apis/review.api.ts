import { ApiEndpoint } from '@/config/api';
import type { ReviewResponse, ReviewRequest } from '../types';
import { apiFactory } from './factory';

export const ReviewApi = apiFactory<ReviewResponse, ReviewRequest>(
  ApiEndpoint.endpoints.reviews,
  'Review',
  { find: 'public', findById: 'public' }
);
