import { useSearch } from '@/context/search-provider';
import { cn } from '@/lib/utils';
import { SearchIcon } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import { Kbd } from '@repo/ui/components/kbd';

type SearchProps = {
  className?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  variant?: 'default' | 'icon';
};

export function Search({
  className = '',
  placeholder = 'Search',
  variant = 'default',
}: SearchProps) {
  const { setOpen } = useSearch();

  if (variant === 'icon') {
    return (
      <Button
        variant='ghost'
        size='icon'
        className={cn('rounded-md border', className)}
        onClick={() => setOpen(true)}
      >
        <SearchIcon size={18} />
      </Button>
    );
  }

  return (
    <Button
      variant='outline'
      className={cn(
        'bg-muted/25 group text-muted-foreground hover:bg-accent relative w-full flex-1 justify-start text-sm font-normal shadow-none',
        'rounded-theme overflow-hidden',
        className
      )}
      onClick={() => setOpen(true)}
    >
      <SearchIcon
        aria-hidden='true'
        className='absolute start-1.5 top-1/2 -translate-y-1/2'
        size={16}
      />
      <span className='ms-4'>{placeholder}</span>
      <Kbd className='pointer-events-none absolute end-[0.3rem] top-1/2 h-5 -translate-y-1/2 items-center justify-center gap-1 opacity-100 select-none sm:flex'>
        <span className='text-xs'>⌘</span>K
      </Kbd>
    </Button>
  );
}
