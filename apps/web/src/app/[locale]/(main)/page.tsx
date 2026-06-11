import type { Metadata } from 'next';
import { BookmarkProvider } from '@/components/book/bookmark-provider';
import { HomeView } from '@/components/home/view';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Access a world of knowledge with iDoc',
};

export default function Home() {
  return (
    <BookmarkProvider>
      <HomeView />
    </BookmarkProvider>
  );
}
