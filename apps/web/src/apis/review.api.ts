import { API_CONFIG } from '@/config/api';
import type { ReviewResponse, ReviewRequest } from '../types';
import { apiFactory } from './factory';

export const ReviewApi = apiFactory<ReviewResponse, ReviewRequest>(
  API_CONFIG.endpoints.reviews,
  {
    find: 'public',
    findById: 'public',
  }
);
