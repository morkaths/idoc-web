'use client';

import type { BookResponse } from '@/types';
import { BannerCarousel } from './banner-carousel';

interface BannerSectionProps {
  books: BookResponse[];
}

/**
 * Client-side component to display the popular books banner.
 * Receives fetched books via props.
 */
export const BannerSection = ({ books }: BannerSectionProps) => {
  if (!books || books.length === 0) {
    return null;
  }

  return <BannerCarousel books={books} />;
};

export default BannerSection;
