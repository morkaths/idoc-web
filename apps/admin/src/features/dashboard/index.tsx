import {
  BookOpen,
  BookCopy,
  Users,
  Layers,
  MessageSquare,
  Bookmark,
  FolderHeart,
  Star,
} from 'lucide-react';
import { useLibraryStats } from '@/hooks/data/useLibraryStats';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card';
import { Skeleton } from '@repo/ui/components/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import { BookStatusChart } from './components/book-status-chart';
import { LoanStatusChart } from './components/loan-status-chart';

export const Dashboard = () => {
  const { data: stats, isLoading } = useLibraryStats();

  return (
    <>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>Library Overview</h1>
      </div>
      <Tabs orientation='vertical' defaultValue='overview' className='space-y-4'>
        <div className='w-full overflow-x-auto pb-2'>
          <TabsList>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='engagement'>User Engagement</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value='overview' className='space-y-4'>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {/* Total Books */}
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Total Books</CardTitle>
                <BookOpen className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className='space-y-2'>
                    <Skeleton className='h-8 w-[100px]' />
                    <Skeleton className='h-4 w-[140px]' />
                  </div>
                ) : (
                  <>
                    <div className='text-2xl font-bold'>{stats?.bookStats.total}</div>
                    <p className='text-muted-foreground text-xs'>
                      Available: {stats?.bookStats.available} ({stats?.bookStats.availabilityRate}%)
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Active Loans */}
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Active Loans</CardTitle>
                <BookCopy className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className='space-y-2'>
                    <Skeleton className='h-8 w-[100px]' />
                    <Skeleton className='h-4 w-[140px]' />
                  </div>
                ) : (
                  <>
                    <div className='text-2xl font-bold'>{stats?.loanStats.active}</div>
                    <p className='text-muted-foreground text-xs'>
                      Overdue: {stats?.loanStats.overdue} ({stats?.loanStats.overdueRate}%)
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Total Borrows */}
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Total Borrows</CardTitle>
                <Layers className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className='space-y-2'>
                    <Skeleton className='h-8 w-[100px]' />
                    <Skeleton className='h-4 w-[140px]' />
                  </div>
                ) : (
                  <>
                    <div className='text-2xl font-bold'>{stats?.bookStats.totalBorrows}</div>
                    <p className='text-muted-foreground text-xs'>
                      Return Rate: {stats?.loanStats.returnRate}%
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Catalog Diversity */}
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Catalog Diversity</CardTitle>
                <Users className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className='space-y-2'>
                    <Skeleton className='h-8 w-[100px]' />
                    <Skeleton className='h-4 w-[140px]' />
                  </div>
                ) : (
                  <>
                    <div className='text-2xl font-bold'>
                      {stats?.catalogStats.totalAuthors} / {stats?.catalogStats.totalCategories}
                    </div>
                    <p className='text-muted-foreground text-xs'>Authors / Categories in system</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
            <Card className='col-span-1 lg:col-span-3'>
              <CardHeader>
                <CardTitle>Book Availability</CardTitle>
                <CardDescription>Current book inventory availability status</CardDescription>
              </CardHeader>
              <CardContent>
                <BookStatusChart
                  available={stats?.bookStats.available || 0}
                  outOfStock={stats?.bookStats.outOfStock || 0}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>

            <Card className='col-span-1 lg:col-span-4'>
              <CardHeader>
                <CardTitle>Loan Distribution</CardTitle>
                <CardDescription>Breakdown of loan lifecycle and status</CardDescription>
              </CardHeader>
              <CardContent>
                <LoanStatusChart
                  active={stats?.loanStats.active || 0}
                  overdue={stats?.loanStats.overdue || 0}
                  returned={stats?.loanStats.returned || 0}
                  canceled={stats?.loanStats.canceled || 0}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='engagement' className='space-y-4'>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {/* Total Reviews */}
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Total Reviews</CardTitle>
                <MessageSquare className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className='space-y-2'>
                    <Skeleton className='h-8 w-[100px]' />
                    <Skeleton className='h-4 w-[140px]' />
                  </div>
                ) : (
                  <>
                    <div className='text-2xl font-bold'>{stats?.interactionStats.totalReviews}</div>
                    <p className='text-muted-foreground text-xs'>
                      Avg: {stats?.interactionStats.avgReviewsPerBook.toFixed(2)} reviews/book
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Total Bookmarks */}
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Total Bookmarks</CardTitle>
                <Bookmark className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className='space-y-2'>
                    <Skeleton className='h-8 w-[100px]' />
                    <Skeleton className='h-4 w-[140px]' />
                  </div>
                ) : (
                  <>
                    <div className='text-2xl font-bold'>
                      {stats?.interactionStats.totalBookmarks}
                    </div>
                    <p className='text-muted-foreground text-xs'>
                      Avg: {stats?.interactionStats.avgBookmarksPerBook.toFixed(2)} bookmarks/book
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Reading Folders */}
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Reading Folders</CardTitle>
                <FolderHeart className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className='space-y-2'>
                    <Skeleton className='h-8 w-[100px]' />
                    <Skeleton className='h-4 w-[140px]' />
                  </div>
                ) : (
                  <>
                    <div className='text-2xl font-bold'>{stats?.interactionStats.totalFolders}</div>
                    <p className='text-muted-foreground text-xs'>
                      Organized reading list collections
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Avg Rating */}
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Average Rating</CardTitle>
                <Star className='text-muted-foreground h-4 w-4' />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className='space-y-2'>
                    <Skeleton className='h-8 w-[100px]' />
                    <Skeleton className='h-4 w-[140px]' />
                  </div>
                ) : (
                  <>
                    <div className='text-2xl font-bold'>
                      {stats?.bookStats.avgRating ? stats.bookStats.avgRating.toFixed(2) : '0.00'} /
                      5.0
                    </div>
                    <p className='text-muted-foreground text-xs'>System-wide average rating</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Catalog Density</CardTitle>
                <CardDescription>Distribution metrics of catalog books</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                {isLoading ? (
                  <div className='space-y-4'>
                    <Skeleton className='h-12 w-full' />
                    <Skeleton className='h-12 w-full' />
                  </div>
                ) : (
                  <div className='space-y-6'>
                    <div>
                      <div className='mb-2 flex items-center justify-between text-sm'>
                        <span className='text-muted-foreground'>Average Books per Author</span>
                        <span className='font-bold'>
                          {stats?.catalogStats.avgBooksPerAuthor.toFixed(2)}
                        </span>
                      </div>
                      <div className='bg-muted h-2.5 w-full overflow-hidden rounded-full'>
                        <div
                          className='bg-primary h-full rounded-full transition-all duration-500'
                          style={{
                            width: `${Math.min((stats?.catalogStats.avgBooksPerAuthor || 0) * 10, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className='mb-2 flex items-center justify-between text-sm'>
                        <span className='text-muted-foreground'>Average Books per Category</span>
                        <span className='font-bold'>
                          {stats?.catalogStats.avgBooksPerCategory.toFixed(2)}
                        </span>
                      </div>
                      <div className='bg-muted h-2.5 w-full overflow-hidden rounded-full'>
                        <div
                          className='bg-primary h-full rounded-full transition-all duration-500'
                          style={{
                            width: `${Math.min((stats?.catalogStats.avgBooksPerCategory || 0) * 10, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interaction Density</CardTitle>
                <CardDescription>Bookmarks and reviews engagement ratios</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                {isLoading ? (
                  <div className='space-y-4'>
                    <Skeleton className='h-12 w-full' />
                    <Skeleton className='h-12 w-full' />
                  </div>
                ) : (
                  <div className='space-y-6'>
                    <div>
                      <div className='mb-2 flex items-center justify-between text-sm'>
                        <span className='text-muted-foreground'>Average Bookmarks per Book</span>
                        <span className='font-bold'>
                          {stats?.interactionStats.avgBookmarksPerBook.toFixed(2)}
                        </span>
                      </div>
                      <div className='bg-muted h-2.5 w-full overflow-hidden rounded-full'>
                        <div
                          className='bg-primary h-full rounded-full transition-all duration-500'
                          style={{
                            width: `${Math.min((stats?.interactionStats.avgBookmarksPerBook || 0) * 10, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className='mb-2 flex items-center justify-between text-sm'>
                        <span className='text-muted-foreground'>Average Reviews per Book</span>
                        <span className='font-bold'>
                          {stats?.interactionStats.avgReviewsPerBook.toFixed(2)}
                        </span>
                      </div>
                      <div className='bg-muted h-2.5 w-full overflow-hidden rounded-full'>
                        <div
                          className='bg-primary h-full rounded-full transition-all duration-500'
                          style={{
                            width: `${Math.min((stats?.interactionStats.avgReviewsPerBook || 0) * 10, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Dashboard;
