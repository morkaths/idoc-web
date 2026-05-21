'use client';

import { useRouter, useParams } from 'next/navigation';
import { useAuthor } from '@/hooks/data/useAuthor';
import { useSearchBooks } from '@/hooks/data/useBook';
import { Skeleton } from '@repo/ui/components/skeleton';
import BookCover3d from '@repo/ui/components/book-cover-3d';
import { Button } from '@repo/ui/components/button';
import Link from 'next/link';
import dayjs from 'dayjs';

interface AuthorDetailViewProps {
  id: string;
}

function AuthorSkeleton() {
  return (
    <div className='relative min-h-screen pt-14 pb-10'>
      <Skeleton className='h-48 w-full rounded-md' />
      <div className='mx-auto -mt-16 max-w-5xl px-4'>
        <div className='flex gap-6'>
          <Skeleton className='aspect-square w-40 rounded-md' />
          <div className='flex-1 space-y-3'>
            <Skeleton className='h-6 w-1/3' />
            <Skeleton className='h-4 w-1/4' />
            <Skeleton className='h-12 w-full' />
          </div>
        </div>
        <div className='mt-8 grid grid-cols-2 gap-4 md:grid-cols-4'>
          {[...Array(8)].map((_, i) => (
            <div key={i} className='space-y-2'>
              <Skeleton className='h-40 w-full rounded-md' />
              <Skeleton className='h-4 w-3/4' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AuthorError() {
  const router = useRouter();
  return (
    <div className='flex min-h-[60vh] flex-col items-center justify-center space-y-6'>
      <h2 className='text-2xl font-bold'>Author not found</h2>
      <div className='flex gap-2'>
        <Button variant='outline' onClick={() => window.location.reload()}>
          Reload
        </Button>
        <Button onClick={() => router.push('/')}>Back to home</Button>
      </div>
    </div>
  );
}

export function AuthorDetailView({ id }: AuthorDetailViewProps) {
  const router = useRouter();
  const { locale } = useParams() as { locale: string };
  const { data: author, isLoading, error } = useAuthor(id);

  const { data: booksData } = useSearchBooks(
    { authorIds: [id], page: 1, limit: 12 },
    { enabled: !!author }
  );

  if (isLoading) return <AuthorSkeleton />;
  if (error || !author) return <AuthorError />;

  return (
    <div className='relative min-h-screen pt-14 pb-10'>
      <div className='bg-primary/10 relative h-48 w-full' />

      <div className='mx-auto -mt-20 max-w-5xl px-4'>
        <div className='flex gap-6'>
          <div className='w-40 shrink-0'>
            {author.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={author.avatar} alt={author.name} className='rounded-md object-cover' />
            ) : (
              <div className='flex h-40 w-40 items-center justify-center rounded-md bg-muted-foreground/10'>
                <span className='text-lg font-semibold'>{author.name?.charAt(0)}</span>
              </div>
            )}
          </div>

          <div className='flex-1'>
            <div className='text-muted-foreground mb-1 text-sm'>
              {author.dob ? dayjs(author.dob).format('MMMM D, YYYY') : null}
              {author.nationality ? ` • ${author.nationality}` : null}
            </div>
            <h1 className='text-3xl font-bold mb-3'>{author.name}</h1>
            <div className='prose max-w-none mb-4'>{author.bio}</div>
            <div className='flex gap-2'>
              <Button variant='outline' onClick={() => router.push(`/${locale}/authors`)}>
                Back to authors
              </Button>
            </div>
          </div>
        </div>

        <div className='mt-10'>
          <h2 className='mb-4 text-xl font-semibold'>Books by {author.name}</h2>
          <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
            {booksData?.data?.length ? (
              booksData.data.map((b) => (
                <Link key={b.id} href={`/${locale}/books/${b.id}`} className='space-y-2'>
                  <div className='rounded-md bg-card p-2'>
                    <BookCover3d src={b.coverUrl} title={b.title} width={200} />
                  </div>
                  <div className='text-sm font-medium'>{b.title}</div>
                </Link>
              ))
            ) : (
              <div className='text-muted-foreground'>No books found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
