import type { RecentSaleStat } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import { Skeleton } from '@repo/ui/components/skeleton';

interface RecentSalesProps {
  data?: RecentSaleStat[];
  isLoading?: boolean;
}

export const RecentSales = ({ data, isLoading }: RecentSalesProps) => {
  if (isLoading) {
    return (
      <div className='space-y-8'>
        {[...Array(5)].map((_, i) => (
          <div key={i} className='flex items-center gap-4'>
            <Skeleton className='h-9 w-9 rounded-full' />
            <div className='flex flex-1 flex-wrap items-center justify-between gap-2'>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-[120px]' />
                <Skeleton className='h-3 w-[160px]' />
              </div>
              <Skeleton className='h-4 w-[60px]' />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className='text-muted-foreground flex h-[200px] items-center justify-center text-sm'>
        No recent sales available
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {data.map((sale) => (
        <div key={sale.id} className='flex items-center gap-4'>
          <Avatar className='h-9 w-9'>
            <AvatarImage src={sale.avatar} alt='Avatar' />
            <AvatarFallback>{sale.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className='flex flex-1 flex-wrap items-center justify-between gap-2'>
            <div className='space-y-1'>
              <p className='text-sm leading-none font-medium'>{sale.name}</p>
              <p className='text-muted-foreground text-sm'>{sale.email}</p>
            </div>
            <div className='font-medium'>{sale.amount}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
