import type { Metadata } from 'next';
import { BookmarkProvider } from '@/components/book/bookmark-provider';
import { BannerCarousel } from '@/components/home/banner-carousel';
import { CategoriesGrid } from '@/components/home/categories-grid';
import { CTASection } from '@/components/home/cta-section';
import { FeaturedAuthors } from '@/components/home/featured-authors';
import { NewArrivals } from '@/components/home/new-arrivals';
import { PopularBooks } from '@/components/home/popular-books';
import { RecommendationCarousel } from '@/components/home/recommendation-carousel';
import { StatsSection } from '@/components/home/stats-section';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Access a world of knowledge with iDoc',
};

export default function Home() {
  return (
    <BookmarkProvider>
      <div className='flex flex-col pb-20'>
        <BannerCarousel />
        <div className='space-y-12 md:space-y-24'>
          <RecommendationCarousel />
          <PopularBooks />
          <NewArrivals />
          <CategoriesGrid />
          <FeaturedAuthors />
          <StatsSection />
          <CTASection />
        </div>
      </div>
    </BookmarkProvider>
  );
}
