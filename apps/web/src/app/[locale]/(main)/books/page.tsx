import type { Metadata } from 'next';
import { BooksView } from './_components/view';

export const metadata: Metadata = {
  title: 'Books',
  description: 'Explore the vast collection of books on iDoc',
};

export default function BooksPage() {
  return <BooksView />;
}
