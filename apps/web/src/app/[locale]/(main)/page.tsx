import type { Metadata } from 'next';
import { FaqsSection } from '@/components/home/faqs';
import FeatureSection from '@/components/home/features';
import HeroSection from '@/components/home/hero';
import { PricingSection } from '@/components/home/pricing';
import TestimonialSection from '@/components/home/testimonial';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Access a world of knowledge with iDoc',
};

export default function Home() {
  return (
    <div className='space-y-10 pt-20 md:space-y-20'>
      <HeroSection />
      <FeatureSection />
      <PricingSection />
      <TestimonialSection />
      <div className='border-t'>
        <FaqsSection />
      </div>
    </div>
  );
}
