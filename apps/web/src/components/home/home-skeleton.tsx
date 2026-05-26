import { Skeleton } from '@repo/ui/components/skeleton';

/**
 * Reusable skeleton loader for a book carousel section.
 */
const CarouselSkeleton = () => {
  return (
    <div className='container py-12 pb-20'>
      <div className='mb-8 flex flex-col space-y-2'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-4 w-64' />
      </div>
      <div className='flex gap-4 overflow-hidden py-6'>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className='min-w-[200px] flex-1 space-y-3'>
            <Skeleton className='h-[280px] w-full rounded-xl' />
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-4 w-1/2' />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Reusable skeleton loader for a book grid section.
 */
const GridSkeleton = () => {
  return (
    <div className='container py-12 pb-20'>
      <div className='mb-8 flex items-end justify-between'>
        <div className='flex flex-col space-y-2'>
          <Skeleton className='h-8 w-48' />
          <Skeleton className='h-4 w-64' />
        </div>
        <Skeleton className='h-10 w-24' />
      </div>
      <div className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] items-start justify-items-center gap-6'>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className='w-[200px] max-w-[200px] min-w-[200px] shrink-0 space-y-3'>
            <Skeleton className='h-[280px] w-full rounded-xl' />
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-4 w-1/2' />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Unified skeleton loader for the entire Home page layout.
 * Prevents layout shifting by matching the structure of main components.
 */
export const HomeSkeleton = () => {
  return (
    <div className='flex flex-col space-y-12 pb-20 md:space-y-24'>
      {/* Banner Skeleton */}
      <div className='container py-8'>
        <Skeleton className='h-[400px] w-full rounded-md md:h-[500px]' />
      </div>

      {/* Recommendations Carousel & Grid Skeletons */}
      <CarouselSkeleton />
      <GridSkeleton />
      <GridSkeleton />
    </div>
  );
};
export default HomeSkeleton;
