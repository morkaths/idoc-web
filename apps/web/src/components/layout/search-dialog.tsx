"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/context/search-provider';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@repo/ui/components/command';
import { ScrollArea } from '@repo/ui/components/scroll-area';
import { useBooks } from '@/hooks/data/useBook';
import { useAuthors } from '@/hooks/data/useAuthor';
import { useDebounce } from '@/hooks/ui/useDebounce';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';

const SearchBookCover = ({ title, src }: { title: string; src?: string }) => {
  const [error, setError] = React.useState(false);

  return (
    <div className="w-10 h-[60px] shrink-0 rounded overflow-hidden bg-background border flex items-center justify-center text-center">
      {!error && (src || "/images/book-cover-placeholder.png") ? (
        <Image
          src={src || "/images/book-cover-placeholder.png"}
          alt={title}
          width={40}
          height={60}
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <span className="text-xs font-bold text-muted-foreground line-clamp-2 px-0.5 leading-none break-all">
          {title.substring(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  );
};

export function SearchDialog() {
  const router = useRouter();
  const { open, setOpen } = useSearch();
  const [query, setQuery] = React.useState("");
  const params = {
    query: useDebounce(query, 300),
    page: 1,
    limit: 5,
  }
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
            <CommandGroup heading="Books" className='w-full'>
              {booksData.data.map((book) => (
                <CommandItem
                  key={book.id}
                  value={`${book.title}`}
                  onSelect={() => runCommand(() => router.push(`/books/${book.id}`))}
                  className="p-2 w-full cursor-pointer rounded-md aria-selected:bg-accent"
                >
                  <div className="flex items-start gap-3 w-full">
                    <SearchBookCover title={book.title} src={book.coverUrl} />
                    <div className="flex-1 min-w-0 flex flex-col justify-start py-0.5">
                      <div className="font-semibold text-sm text-foreground truncate">
                        {book.title}
                      </div>

                      <div className="text-xs text-muted-foreground/70 line-clamp-2 mt-0.5 whitespace-normal">
                        {book.description || "No description"}
                      </div>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Nhóm Tác giả */}
          {Array.isArray(authorsData?.data) && authorsData.data.length > 0 && (
            <CommandGroup heading="Authors">
              {authorsData.data.map((author) => (
                <CommandItem
                  key={author.id}
                  value={author.name}
                  onSelect={() => runCommand(() => router.push(`/authors/${author.id}`))}
                >
                  <Avatar className="w-7 h-7 mr-2">
                    <AvatarImage
                      src={author.avatar || ""}
                      alt={author.name}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {author.name?.charAt(0).toUpperCase() || "A"}
                    </AvatarFallback>
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