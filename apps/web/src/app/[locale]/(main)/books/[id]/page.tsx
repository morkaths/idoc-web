import { BookApi } from '@/apis';
import type { Metadata } from 'next';
import { BookDetailView } from './_components/view';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const book = await BookApi.findById(id);
    if (!book) {
      return {
        title: 'Book not found',
      };
    }
    return {
      title: book.title,
      description: book.description,
      openGraph: {
        images: book.coverUrl ? [book.coverUrl] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Error',
    };
  }
}

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BookDetailView id={id} />;
}
