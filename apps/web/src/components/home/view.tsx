import { BookApi, CategoryApi, BorrowApi, AuthorApi, UserApi, RecommendationApi } from '@/apis';
import { auth } from '@/auth';
import type { BookResponse, CategoryResponse, RecommendedBookResponse } from '@/types';
import { FilterOperator, RecommendationStrategy, SortDirection } from '@repo/types';
import { BannerSection } from '@/components/home/banner-section';
import { CategoriesGridSection } from '@/components/home/categories-grid-section';
import { CategoryBookSections } from '@/components/home/category-book-sections';
import { CTASection } from '@/components/home/cta-section';
import { FeaturedAuthorsSection } from '@/components/home/featured-authors-section';
import { NewArrivalsSection } from '@/components/home/new-arrivals-section';
import { PersonalRecommendationSection } from '@/components/home/personal-recommendation-section';
import { StatsSection } from '@/components/home/stats-section';

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @param {Array} array - The array to shuffle.
 * @returns {Array} The shuffled array.
 */
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    if (temp && shuffled[j]) {
      shuffled[i] = shuffled[j]!;
      shuffled[j] = temp;
    }
  }
  return shuffled;
};

/**
 * Helper to fetch multiple books by ID in parallel.
 * Replaces BookApi.findByIds since bulk fetching is not supported on the backend.
 * @param {string[]} ids - Array of book IDs to fetch.
 * @returns {Promise<BookResponse[]>} A promise resolving to the list of fetched books.
 */
const fetchBooksByIds = async (ids: string[]): Promise<BookResponse[]> => {
  const promises = ids.map((id) =>
    BookApi.findById(id)
      .then((res) => res.data)
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(`Failed to fetch book ${id}:`, err);
        return null;
      })
  );
  const results = await Promise.all(promises);
  return results.filter((book): book is BookResponse => !!book);
};

/**
 * Structural container for the landing page.
 * Rendered as a Server Component, wrapping isolated section components with centralized data fetching.
 */
export async function HomeView() {
  const session = await auth();
  const userId = session?.user?.id;

  // --- Phase 1: Parallel fetches for top-level meta & base data ---
  const [
    popularRecRes,
    newArrivalsRes,
    categoriesGridRes,
    featuredAuthorsRes,
    categoriesAllRes,
    personalRecRes,
    borrowHistoryRes,
    booksCountRes,
    authorsCountRes,
  ] = await Promise.allSettled([
    RecommendationApi.getPopular(1, 5),
    BookApi.search({
      sorts: [{ field: 'createdAt', direction: SortDirection.DESC }],
      limit: 10,
    }),
    CategoryApi.find({ limit: 11 }),
    AuthorApi.find({ limit: 15 }),
    CategoryApi.find({ limit: 20 }), // for category recommendations selection
    RecommendationApi.getForUser(userId || 'anonymous', RecommendationStrategy.HYBRID, 1, 10),
    userId ? BorrowApi.history({ limit: 10 }) : Promise.resolve(null),
    BookApi.find({ limit: 1 }),
    AuthorApi.find({ limit: 1 }),
  ]);

  // Extract Phase 1 values
  const popularRecData = popularRecRes.status === 'fulfilled' ? popularRecRes.value?.data : null;
  const newArrivalsBooks =
    newArrivalsRes.status === 'fulfilled' ? (newArrivalsRes.value?.data?.content ?? []) : [];
  const gridCategories =
    categoriesGridRes.status === 'fulfilled' ? (categoriesGridRes.value?.data?.content ?? []) : [];
  const featuredAuthors =
    featuredAuthorsRes.status === 'fulfilled'
      ? (featuredAuthorsRes.value?.data?.content ?? [])
      : [];
  const allCats =
    categoriesAllRes.status === 'fulfilled' ? (categoriesAllRes.value?.data?.content ?? []) : [];
  const personalRecData = personalRecRes.status === 'fulfilled' ? personalRecRes.value?.data : null;
  const borrowHistory =
    borrowHistoryRes.status === 'fulfilled' ? (borrowHistoryRes.value?.data?.content ?? []) : [];
  const booksCount =
    booksCountRes.status === 'fulfilled' ? (booksCountRes.value?.data?.total ?? 0) : 0;
  const authorsCount =
    authorsCountRes.status === 'fulfilled' ? (authorsCountRes.value?.data?.total ?? 0) : 0;

  // eslint-disable-next-line no-console
  console.log('[DEBUG] HomeView Phase 1 values:', {
    userId,
    popularRecDataExists: !!popularRecData,
    popularRecDataContentLength: popularRecData?.content?.length,
    newArrivalsBooksLength: newArrivalsBooks.length,
    gridCategoriesLength: gridCategories.length,
    personalRecDataExists: !!personalRecData,
    personalRecDataContentLength: personalRecData?.content?.length,
  });
  if (popularRecRes.status === 'rejected') {
    // eslint-disable-next-line no-console
    console.error('[DEBUG] popularRecRes failed:', popularRecRes.reason);
  }
  if (personalRecRes.status === 'rejected') {
    // eslint-disable-next-line no-console
    console.error('[DEBUG] personalRecRes failed:', personalRecRes.reason);
  }

  // --- Process Category Recommendations Selection ---
  let recommendedCategories: CategoryResponse[] = [];
  if (userId && borrowHistory.length > 0) {
    try {
      const borrowedBookIds = borrowHistory.map((loan) => loan.book.id);
      if (borrowedBookIds.length > 0) {
        const fullBorrowedBooks = await fetchBooksByIds(borrowedBookIds);
        const freq: Record<string, { count: number; category: CategoryResponse }> = {};

        fullBorrowedBooks.forEach((book) => {
          book.categories?.forEach((cat) => {
            if (!freq[cat.id]) {
              freq[cat.id] = { count: 0, category: cat };
            }
            const item = freq[cat.id];
            if (item) {
              item.count += 1;
            }
          });
        });

        const sorted = Object.values(freq).sort((a, b) => b.count - a.count);
        recommendedCategories = sorted.map((item) => item.category);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to resolve recommended categories from history on server:', err);
    }
  }

  const shuffledHistory = shuffleArray(recommendedCategories);
  const shuffledAll = shuffleArray(allCats);
  const selectedCategories: CategoryResponse[] = [];
  const selectedIds = new Set<string>();

  // Fetch books for multiple recommended categories (e.g. up to 3 categories)
  const maxCategorySections = 3;

  for (const cat of shuffledHistory) {
    if (selectedCategories.length >= maxCategorySections) break;
    selectedCategories.push(cat);
    selectedIds.add(cat.id);
  }
  for (const cat of shuffledAll) {
    if (selectedCategories.length >= maxCategorySections) break;
    if (!selectedIds.has(cat.id)) {
      selectedCategories.push(cat);
      selectedIds.add(cat.id);
    }
  }

  // Create book fetch promises for selected categories
  const categoryBooksPromises = selectedCategories.map((cat) =>
    BookApi.search({
      limit: 10,
      filters: [
        {
          field: 'categories.id',
          value: [cat.id],
          operator: FilterOperator.IN,
        },
      ],
      sorts: [{ field: 'totalBorrows', direction: SortDirection.DESC }],
    })
  );

  // --- Phase 2: Parallel fetches for detailed books & counts ---
  const popularIds = popularRecData?.content?.map((item) => item.id) ?? [];
  const personalIds = personalRecData?.content?.map((item) => item.id) ?? [];

  const [
    popularBooksRes,
    personalBooksRes,
    usersCountRes,
    borrowsCountRes,
    ...categoryBooksResults
  ] = await Promise.allSettled([
    popularIds.length > 0 ? fetchBooksByIds(popularIds) : Promise.resolve([]),
    personalIds.length > 0 ? fetchBooksByIds(personalIds) : Promise.resolve([]),
    userId ? UserApi.find({ limit: 1 }) : Promise.resolve(null),
    userId ? BorrowApi.find({ limit: 1 }) : Promise.resolve(null),
    ...categoryBooksPromises,
  ]);

  // Extract and sort Popular Books
  let popularBooks: BookResponse[] = [];
  if (popularBooksRes.status === 'fulfilled' && popularBooksRes.value) {
    popularBooks = popularBooksRes.value as BookResponse[];
    if (popularBooks.length > 0 && popularRecData?.content) {
      const scoreMap = new Map(popularRecData.content.map((item) => [item.id, item.score]));
      popularBooks = [...popularBooks].sort(
        (a, b) => (scoreMap.get(b.id) ?? 0) - (scoreMap.get(a.id) ?? 0)
      );
    }
  }

  // eslint-disable-next-line no-console
  console.log('[DEBUG] HomeView Phase 2 values:', {
    popularBooksLength: popularBooks.length,
    popularBooksResStatus: popularBooksRes.status,
    personalBooksResStatus: personalBooksRes.status,
  });
  if (popularBooksRes.status === 'rejected') {
    // eslint-disable-next-line no-console
    console.error('[DEBUG] popularBooksRes failed:', popularBooksRes.reason);
  }
  if (personalBooksRes.status === 'rejected') {
    // eslint-disable-next-line no-console
    console.error('[DEBUG] personalBooksRes failed:', personalBooksRes.reason);
  }

  // Extract and enrich/sort Personal Recommendation Books
  let personalRecBooks: RecommendedBookResponse[] = [];
  if (
    personalBooksRes.status === 'fulfilled' &&
    personalBooksRes.value &&
    personalRecData?.content
  ) {
    const personalBooks = personalBooksRes.value as BookResponse[];
    const recMap = new Map(personalRecData.content.map((i) => [i.id, i]));
    personalRecBooks = personalBooks
      .map((book) => ({
        ...book,
        score: recMap.get(book.id)?.score,
        reason: recMap.get(book.id)?.reason,
        predicted: recMap.get(book.id)?.predicted,
      }))
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  }

  // Extract dynamic Category Book sections
  const categorySections: { category: CategoryResponse; books: BookResponse[] }[] = [];
  selectedCategories.forEach((cat, index) => {
    const res = categoryBooksResults[index];
    const books = res?.status === 'fulfilled' && res.value ? (res.value.data?.content ?? []) : [];
    if (books.length > 0) {
      categorySections.push({
        category: cat,
        books,
      });
    }
  });

  const usersCount =
    usersCountRes.status === 'fulfilled' && usersCountRes.value
      ? (usersCountRes.value.data?.total ?? 0)
      : 0;
  const borrowsCount =
    borrowsCountRes.status === 'fulfilled' && borrowsCountRes.value
      ? (borrowsCountRes.value.data?.total ?? 0)
      : 0;

  const stats = {
    books: booksCount,
    users: usersCount,
    authors: authorsCount,
    borrows: borrowsCount,
  };

  return (
    <div className='flex flex-col pb-20'>
      <BannerSection books={popularBooks} />
      <div className='space-y-12 md:space-y-24'>
        {personalRecBooks.length > 0 && <PersonalRecommendationSection books={personalRecBooks} />}
        <CategoryBookSections sections={categorySections} />
        <NewArrivalsSection books={newArrivalsBooks} />
        <CategoriesGridSection categories={gridCategories} />
        <FeaturedAuthorsSection authors={featuredAuthors} />
        <StatsSection stats={stats} />
        <CTASection />
      </div>
    </div>
  );
}
