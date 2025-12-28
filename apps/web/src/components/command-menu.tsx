"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, User } from 'lucide-react';
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

export function CommandMenu() {
  const router = useRouter();
  const { open, setOpen } = useSearch();

  // Truy vấn sách và tác giả
  const { data: booksData } = useBooks();
  const { data: authorsData } = useAuthors();

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false);
      command();
    },
    [setOpen]
  );

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput placeholder='Type a command or search...' />
      <CommandList>
        <ScrollArea type='hover' className='h-72 pe-1'>
          <CommandEmpty>No results found.</CommandEmpty>

          {/* Nhóm Sách */}
          {Array.isArray(booksData?.data) && booksData.data.length > 0 && (
            <CommandGroup heading="Books">
              {booksData.data.map((book) => (
                <CommandItem
                  key={book._id}
                  value={book.title}
                  onSelect={() => runCommand(() => router.push(`/books/${book._id}`))}
                >
                  <BookOpen className="size-4 text-muted-foreground/80 mr-2" />
                  {book.title}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Nhóm Tác giả */}
          {Array.isArray(authorsData?.data) && authorsData.data.length > 0 && (
            <CommandGroup heading="Authors">
              {authorsData.data.map((author) => (
                <CommandItem
                  key={author._id}
                  value={author.name}
                  onSelect={() => runCommand(() => router.push(`/authors/${author._id}`))}
                >
                  <User className="size-4 text-muted-foreground/80 mr-2" />
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