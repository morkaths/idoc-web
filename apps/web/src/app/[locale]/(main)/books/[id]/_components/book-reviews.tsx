'use client';

import { useState } from 'react';
import { formatDate } from '@/utils/date';
import { Star, MessageSquare, Loader2, User as UserIcon } from 'lucide-react';
import { useReviews } from '@/hooks/data/useReview';
import { useLocale } from '@/hooks/ui/useLocale';
import { Avatar, AvatarFallback } from '@repo/ui/components/avatar';
import { Pagination } from '@/components/pagination';

interface BookReviewsProps {
  bookId?: string;
  rating?: number;
  totalReviews?: number;
}

export function BookReviews({ bookId, rating = 0, totalReviews = 0 }: BookReviewsProps) {
  const { t, keys } = useLocale('book');
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useReviews({ itemId: bookId, page }, { enabled: !!bookId });
  const reviews = data?.data || [];
  const pagination = data?.pagination;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className='mt-4 space-y-8'>
      <div className='grid gap-8 md:grid-cols-[250px_1fr]'>
        {/* Reviews summary */}
        <div className='space-y-6'>
          <div className='bg-card sticky top-4 h-fit space-y-2 rounded-xl border p-6 text-center'>
            <div className='text-foreground text-5xl font-bold tracking-tighter'>
              {rating?.toFixed(1) || 0}
            </div>
            <div className='flex justify-center gap-1'>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${star <= Math.round(rating || 0) ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}`}
                />
              ))}
            </div>
            <div className='text-muted-foreground pt-1 text-sm'>
              {t(keys.reviews.total, { count: totalReviews || 0 })}
            </div>
          </div>
        </div>
        {/* Reviews list */}
        <div className='space-y-6'>
          {isLoading ? (
            <div className='text-muted-foreground flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12'>
              <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
            </div>
          ) : isError ? (
            <div className='text-muted-foreground bg-destructive/5 border-destructive/20 text-destructive flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12'>
              <MessageSquare className='mb-3 h-12 w-12 opacity-50' />
              <p className='text-lg font-medium'>{t(keys.reviews.error.fetch)}</p>
              <p className='text-sm opacity-80'>{t(keys.reviews.error.tryAgain)}</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className='text-muted-foreground flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12'>
              <MessageSquare className='mb-3 h-12 w-12 opacity-20' />
              <p className='text-lg font-medium'>{t(keys.reviews.empty.title)}</p>
              <p className='text-sm'>{t(keys.reviews.empty.description)}</p>
            </div>
          ) : (
            <div className='space-y-4'>
              <div className='space-y-4'>
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className='bg-card space-y-4 rounded-xl border p-6 shadow-sm'
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex gap-3'>
                        <Avatar className='h-10 w-10'>
                          <AvatarFallback>
                            <UserIcon className='h-5 w-5' />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className='text-sm font-medium'>
                            {review.user?.username || review.user?.email || 'User'}
                          </div>
                          <div className='text-muted-foreground text-xs'>
                            {formatDate(review.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div className='flex gap-0.5'>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className='text-muted-foreground text-sm leading-relaxed'>
                      {review.content}
                    </div>
                  </div>
                ))}
              </div>

              {pagination && <Pagination pagination={pagination} onPageChange={handlePageChange} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
