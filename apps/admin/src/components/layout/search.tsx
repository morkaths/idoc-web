import { SearchIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearch } from '@/context/search-provider';
import { Button } from '@repo/ui/components/button';

type SearchProps = {
  className?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
};

export function Search({ className = '', placeholder = 'Search' }: SearchProps) {
  const { setOpen } = useSearch();
  return (
    <Button
      variant='outline'
      className={cn(
        'bg-muted/25 group text-muted-foreground hover:bg-accent relative flex h-8 w-full flex-1 items-center justify-start overflow-hidden text-sm font-normal shadow-none transition-all sm:w-40 sm:pe-12 md:flex-none lg:w-52 xl:w-64',
        'rounded-theme overflow-hidden',
        className
      )}
      onClick={() => setOpen(true)}
    >
      <SearchIcon aria-hidden='true' className='h-4 w-4 shrink-0' size={16} />
      <span className='ms-2 truncate'>{placeholder}</span>
      <kbd
        className='bg-muted group-hover:bg-accent pointer-events-none absolute end-1.5 top-1/2 hidden inline-flex h-5 items-center justify-center gap-0.5 rounded-md border px-1.5 font-mono text-[10px] leading-none font-medium tracking-tight whitespace-nowrap opacity-100 select-none sm:flex'
        style={{ transform: 'translateY(calc(-50% + 1px))' }}
      >
        <span className='relative top-px leading-none'>⌘</span>
        <span className='relative top-px leading-none'>K</span>
      </kbd>
    </Button>
  );
}
