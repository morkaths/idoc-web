import type { Metadata } from 'next';
import { LibraryView } from './_components/view';

export const metadata: Metadata = {
  title: 'My Library',
  description: 'Manage your borrowed books and reading history',
};

export default function LibraryPage() {
  return <LibraryView />;
}
