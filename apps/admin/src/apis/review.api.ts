import { ApiEndpoint } from '@/config/api';
import type { ReviewResponse, ReviewRequest } from '../types';
import { apiFactory } from './factory';

const factory = apiFactory<ReviewResponse, ReviewRequest>(
  ApiEndpoint.endpoints.reviews,
  { find: 'public', findById: 'public' }
);

export const ReviewApi = {
  ...factory,
};

