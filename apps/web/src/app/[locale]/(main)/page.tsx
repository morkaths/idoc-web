import type { Metadata } from 'next';
import { BookmarkProvider } from '@/components/book/bookmark-provider';
import { BannerCarousel } from '@/components/home/banner-carousel';
import { RecommendationCarousel } from '@/components/home/recommendation-carousel';
import { PopularBooks } from '@/components/home/popular-books';
import { CategoriesGrid } from '@/components/home/categories-grid';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Access a world of knowledge with iDoc',
};

export default function Home() {
  return (
    <BookmarkProvider>
      <div className='flex flex-col pb-20'>
        <BannerCarousel />
        <div className='space-y-6 md:space-y-12'>
          <RecommendationCarousel />
          <PopularBooks />
          <CategoriesGrid />
        </div>
      </div>
    </BookmarkProvider>
  );
}
