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
            <CommandGroup heading="Books" className='w-lg'>
              {booksData.data.map((book) => (
                <CommandItem
                  key={book.id}
                  value={`${book.title}`}
                  onSelect={() => runCommand(() => router.push(`/books/${book.id}`))}
                  className="p-2 w-full cursor-pointer rounded-md aria-selected:bg-accent"
                >
                  <div className="flex items-start gap-2 w-full">
                    <div className="shrink-0 border border-border/20 rounded overflow-hidden">
                      <Image
                        src={book.coverUrl || "/images/book-cover-placeholder.png"}
                        alt={book.title}
                        width={40}
                        height={60}
                        className="w-10 h-15 object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-start h-15">
                      <div className="font-semibold text-sm text-foreground truncate">
                        {book.title}
                      </div>

                      <div className="text-xs text-muted-foreground/70 line-clamp-2">
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
                      src={author.avatarUrl || ""}
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