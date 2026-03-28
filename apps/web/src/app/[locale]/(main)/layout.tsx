'use client';
import { LayoutProvider } from '@/context/layout-provider';
import { SearchProvider } from '@/context/search-provider';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SearchProvider>
      <LayoutProvider>
        <Header />
        <div className='block md:hidden' />
        {children}
        <Footer />
      </LayoutProvider>
    </SearchProvider>
  );
}
