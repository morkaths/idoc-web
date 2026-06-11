'use client';

import { useSession } from 'next-auth/react';
import { RecommendationStrategy } from '@/types';
import { useRecommendations } from '@/hooks/data/useRecommendation';
import { BookGridItems } from '@/components/book/book-grid-items';

export default function BookGridView() {
  const { data: session } = useSession();
  const userId = session?.user?.id?.toString();

  const {
    data: books = [],
    isLoading,
    isError,
  } = useRecommendations(userId, {
    strategy: RecommendationStrategy.HYBRID,
    limit: 12,
  });

  return (
    <div className='space-y-6'>
      <BookGridItems
        data={books}
        loading={isLoading}
        error={isError ? 'Không thể tải danh sách gợi ý. Vui lòng thử lại sau.' : undefined}
      />
    </div>
  );
}
