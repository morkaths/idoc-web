'use client';

import { useState } from 'react';
import { FilterOperator, SortDirection } from '@/types';
import { formatDate } from '@/utils/date';
import { Star, MessageSquare, Loader2, User as UserIcon } from 'lucide-react';
import { useSearchReviews } from '@/hooks/data/useReview';
import { useLocale } from '@/hooks/ui/useLocale';
import { Avatar, AvatarFallback } from '@repo/ui/components/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select';
import { Pagination } from '@/components/pagination';

interface BookReviewsProps {
  bookId?: string;
  rating?: number;
  totalReviews?: number;
  enabled?: boolean;
}

export function BookReviews({
  bookId,
  rating = 0,
  totalReviews = 0,
  enabled = true,
}: BookReviewsProps) {
  const { t, keys } = useLocale('book');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('newest');
  const pageSize = 10;

  const sortParams = {
    newest: { sortBy: 'createdAt', sortOrder: SortDirection.DESC },
    oldest: { sortBy: 'createdAt', sortOrder: SortDirection.ASC },
    highestRating: { sortBy: 'rating', sortOrder: SortDirection.DESC },
    lowestRating: { sortBy: 'rating', sortOrder: SortDirection.ASC },
  }[sort] || { sortBy: 'createdAt', sortOrder: SortDirection.DESC };

  const { data, isLoading, isError } = useSearchReviews(
    {
      page,
      limit: pageSize,
      filters: [{ field: 'book.id', value: bookId, operator: FilterOperator.EQ }],
      sorts: [{ field: sortParams.sortBy, direction: sortParams.sortOrder }],
    },
    { enabled: !!bookId && enabled }
  );
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
          <div className='bg-card sticky top-20 h-fit space-y-2 rounded-xl border p-6 text-center'>
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
          {/* List Header & Sort */}
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-bold'>{t(keys.tabs.reviews.label)}</h3>
            <div className='flex items-center gap-2'>
              <span className='text-muted-foreground text-sm'>{t(keys.reviews.sort.label)}</span>
              <Select
                value={sort}
                onValueChange={(val) => {
                  setSort(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className='w-[180px]'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='newest'>{t(keys.reviews.sort.newest)}</SelectItem>
                  <SelectItem value='oldest'>{t(keys.reviews.sort.oldest)}</SelectItem>
                  <SelectItem value='highestRating'>
                    {t(keys.reviews.sort.highestRating)}
                  </SelectItem>
                  <SelectItem value='lowestRating'>{t(keys.reviews.sort.lowestRating)}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

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
                            {review.user?.username || 'User'}
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
