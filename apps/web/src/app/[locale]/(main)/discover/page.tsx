'use client';

import { useSession } from 'next-auth/react';
import { useLocale } from '@/hooks/ui/useLocale';
import { RecommendationRow } from '@/components/recommendation/recommendation-row';
import { useRecommendations, usePopularBooks } from '@/hooks/data/useRecommendation';
import { RecommendationStrategy } from '@/types';
import { Sparkles } from 'lucide-react';

export default function DiscoverPage() {
  const { data: session, status: authStatus } = useSession();
  const { t, keys } = useLocale('home');
  const isAuthenticated = authStatus === 'authenticated';
  const userId = session?.user?.id;

  const forYou = useRecommendations(userId, {
    strategy: RecommendationStrategy.HYBRID,
    enabled: isAuthenticated,
  });

  const interests = useRecommendations(userId, {
    strategy: RecommendationStrategy.CONTENT,
    enabled: isAuthenticated,
  });

  const collaborative = useRecommendations(userId, {
    strategy: RecommendationStrategy.USER_BASED,
    enabled: isAuthenticated,
  });

  // Common Section
  const trending = usePopularBooks({
    enabled: true,
  });

  return (
    <div className='container mx-auto px-4 py-8 space-y-12 min-h-screen'>
      {/* Page Header */}
      <div className='flex flex-col items-center text-center space-y-4 mb-12'>
        <div className='p-3 bg-primary/10 rounded-full'>
          <Sparkles className='w-8 h-8 text-primary' />
        </div>
        <h1 className='text-3xl md:text-5xl font-extrabold tracking-tight'>
          {t(keys.hero.title)}
        </h1>
        <p className='text-muted-foreground text-lg max-w-2xl'>
          {t(keys.hero.subtitle)}
        </p>
      </div>

      {/* Recommendation Sections */}
      <div className='space-y-8'>
        {isAuthenticated ? (
          <>
            <RecommendationRow
              title={t(keys.recommendations.forYou)}
              description={t(keys.recommendations.subtitle)}
              books={forYou.data}
              isLoading={forYou.isLoading}
              error={forYou.isError ? 'Could not load personalized recommendations.' : null}
            />

            <RecommendationRow
              title={t(keys.recommendations.interests)}
              description='Dựa trên các thể loại bạn thường xuyên theo dõi.'
              books={interests.data}
              isLoading={interests.isLoading}
              error={interests.isError ? 'Could not load interest-based books.' : null}
            />

            <RecommendationRow
              title={t(keys.recommendations.similarReaders)}
              description='Những cuốn sách mà độc giả có cùng sở thích với bạn đang đọc.'
              books={collaborative.data}
              isLoading={collaborative.isLoading}
              error={collaborative.isError ? 'Could not load collaborative recommendations.' : null}
            />
          </>
        ) : (
          <div className='bg-muted/30 rounded-2xl p-8 text-center space-y-4 border border-dashed'>
            <h3 className='text-xl font-semibold'>Muốn trải nghiệm cá nhân hóa?</h3>
            <p className='text-muted-foreground max-w-md mx-auto'>
              Đăng nhập để IDoc có thể đưa ra những gợi ý chính xác nhất dựa trên sở thích và lịch sử đọc của bạn.
            </p>
          </div>
        )}

        <RecommendationRow
          title={t(keys.recommendations.trending)}
          description={t(keys.popular.subtitle)}
          books={trending.data}
          isLoading={trending.isLoading}
        />
      </div>
    </div>
  );
}
