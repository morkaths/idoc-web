import { ApiEndpoint } from '@/config/api';
import type { Review, ReviewRequest } from '../types';
import { apiFactory } from './factory';

export const ReviewApi = apiFactory<Review, ReviewRequest>(
  ApiEndpoint.endpoints.reviews,
  'Review',
  { find: 'public', findById: 'public' }
);
