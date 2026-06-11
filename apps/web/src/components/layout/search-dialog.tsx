'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { useSearch } from '@/context/search-provider';
import { useAuthors } from '@/hooks/data/useAuthor';
import { useBooks } from '@/hooks/data/useBook';
import { useDebounce } from '@/hooks/ui/useDebounce';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import BookCover3d from '@repo/ui/components/book-cover-3d';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/ui/components/command';
import { ScrollArea } from '@repo/ui/components/scroll-area';
import { AppImage as Image } from '../app-image';

const SearchBookCover = ({ title, src }: { title: string; src?: string }) => {
  const [error, setError] = React.useState(false);
  const fallbackText = title.trim().substring(0, 2).toUpperCase();
  const showImage = !!src && !error;

  return (
    <div className='bg-background flex h-[60px] w-10 shrink-0 items-center justify-center overflow-hidden rounded border text-center'>
      {showImage ? (
        <Image
          src={src}
          alt={title}
          width={40}
          height={60}
          className='h-full w-full object-cover'
          onError={() => setError(true)}
        />
      ) : (
        <BookCover3d
          src={undefined}
          title={title}
          fallbackText={fallbackText}
          width={40}
          className='drop-shadow-[0_4px_6px_rgba(0,0,0,0.2)]'
        />
      )}
    </div>
  );
};

export function SearchDialog() {
  const router = useRouter();
  const { open, setOpen } = useSearch();
  const [query, setQuery] = React.useState('');
  const params = {
    query: useDebounce(query, 300),
    page: 1,
    limit: 5,
  };
  const { data: booksData } = useBooks(params, { enabled: open });
  const { data: authorsData } = useAuthors(params, { enabled: open });

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false);
      command();
    },
    [setOpen]
  );

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder='Type a command or search...'
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <ScrollArea type='hover' className='h-72 pe-1'>
          <CommandEmpty>No results found.</CommandEmpty>

          {/* Nhóm Sách */}
          {Array.isArray(booksData?.data) && booksData.data.length > 0 && (
            <CommandGroup heading='Books' className='w-full'>
              {booksData.data.map((book) => (
                <CommandItem
                  key={book.id}
                  value={`${book.title}`}
                  onSelect={() => runCommand(() => router.push(`/books/${book.id}`))}
                  className='hover:border-border/60 hover:bg-muted/40 aria-selected:border-border/60 aria-selected:bg-muted/60 w-full cursor-pointer rounded-md border border-transparent p-2 transition-colors'
                >
                  <div className='flex w-full items-start gap-3'>
                    <SearchBookCover title={book.title} src={book.coverUrl} />
                    <div className='flex min-w-0 flex-1 flex-col justify-start py-0.5'>
                      <div className='text-foreground truncate text-sm font-semibold'>
                        {book.title}
                      </div>

                      <div className='text-muted-foreground/70 mt-0.5 line-clamp-2 text-xs whitespace-normal'>
                        {book.description || 'No description'}
                      </div>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Nhóm Tác giả */}
          {Array.isArray(authorsData?.data) && authorsData.data.length > 0 && (
            <CommandGroup heading='Authors'>
              {authorsData.data.map((author) => (
                <CommandItem
                  key={author.id}
                  value={author.name}
                  onSelect={() => runCommand(() => router.push(`/authors/${author.id}`))}
                >
                  <Avatar className='mr-2 h-7 w-7'>
                    <AvatarImage
                      src={author.avatar || ''}
                      alt={author.name}
                      className='object-cover'
                    />
                    <AvatarFallback>{author.name?.charAt(0).toUpperCase() || 'A'}</AvatarFallback>
                  </Avatar>
                  {author.name}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  );
}
