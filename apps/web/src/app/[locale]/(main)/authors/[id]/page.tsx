import { AuthorApi } from '@/apis';
import type { Metadata } from 'next';
import { AuthorDetailView } from './_components/view';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const response = await AuthorApi.findById(id);
    const author = response.data;
    if (!author) {
      return {
        title: 'Author not found',
      };
    }
    return {
      title: author.name,
      description: author.bio ?? undefined,
    };
  } catch {
    return {
      title: 'Error',
    };
  }
}

export default async function AuthorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AuthorDetailView id={id} />;
}
