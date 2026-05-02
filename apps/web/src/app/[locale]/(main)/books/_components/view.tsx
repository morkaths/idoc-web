'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState, useMemo, useCallback } from 'react';
import {
  ArrowDownAZ,
  FilterIcon,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { useLocale } from '@/hooks/ui/useLocale';
import { Button } from '@repo/ui/components/button';
import { Card } from '@repo/ui/components/card';
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from '@repo/ui/components/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@repo/ui/components/tabs';
import BookFilter from './book-filter';
import BookSort from './book-sort';
import { BookView } from './book-view';

import {
  type BookSortState,
  type BookFilterState,
  parseBookQuery,
  buildBookQuery,
  buildBookFindParams,
  DEFAULT_BOOK_FILTER,
  DEFAULT_BOOK_SORT,
} from './book-query.utils';

export function BooksView() {
  const { t, keys } = useLocale('books');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const state = useMemo(() => parseBookQuery(searchParams), [searchParams]);
  const { page, limit } = state;

  const filter = useMemo(
    () => ({ query: state.query, categories: state.categories, languages: state.languages }),
    [state]
  );
  const sort = useMemo(
    () => ({ sortBy: state.sortBy, sortOrder: state.sortOrder }),
    [state]
  );

  // Write filter changes to URL (resets page to 1)
  const handleSetFilter = useCallback(
    (next: BookFilterState) => {
      router.replace(`${pathname}?${buildBookQuery(next, sort, 1, limit)}`, { scroll: false });
    },
    [router, pathname, sort, limit]
  );

  // Write sort changes to URL (resets page to 1)
  const handleSetSort = useCallback(
    (next: BookSortState) => {
      router.replace(`${pathname}?${buildBookQuery(filter, next, 1, limit)}`, { scroll: false });
    },
    [router, pathname, filter, limit]
  );

  // Write page changes to URL
  const handlePageChange = useCallback(
    (newPage: number) => {
      router.replace(`${pathname}?${buildBookQuery(filter, sort, newPage, limit)}`, { scroll: false });
    },
    [router, pathname, filter, sort, limit]
  );

  // Build the FindParams object to pass down to BookView
  const findParams = useMemo(
    () => buildBookFindParams(filter, sort, page, limit),
    [filter, sort, page, limit]
  );

  return (
    <main className='container flex gap-8 py-8'>
      {/* Sidebar */}
      <aside className='hidden w-64 lg:block'>
        <Card className='mb-4 p-4'>
          <div className='mb-2 flex items-center gap-2'>
            <Sparkles className='h-4 w-4' />
            <span className='font-semibold'>{t(keys.sidebar.title)}</span>
          </div>
          <FilterTabs
            filter={filter}
            setFilter={handleSetFilter}
            sort={sort}
            setSort={handleSetSort}
            defaultValue='filter'
          />
        </Card>
      </aside>

      {/* Main content */}
      <section className='flex-1'>
        {/* Toolbar */}
        <div className='mb-4 flex items-center justify-between'>
          <div className='mb-4 block lg:hidden'>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant='outline' size='icon' aria-label='Open filter'>
                  <SlidersHorizontal className='h-5 w-5' />
                </Button>
              </SheetTrigger>
              <SheetContent side='right' className='p-4'>
                <SheetTitle className='mb-4'>
                  <div className='mb-2 flex items-center gap-2'>
                    <Sparkles className='h-4 w-4' />
                    <span className='font-semibold'>{t(keys.sidebar.title)}</span>
                  </div>
                </SheetTitle>
                <FilterTabs
                  filter={filter}
                  setFilter={handleSetFilter}
                  sort={sort}
                  setSort={handleSetSort}
                  defaultValue='filter'
                />
              </SheetContent>
            </Sheet>
          </div>
          <div className='flex gap-2'>
            <Button
              variant={view === 'grid' ? 'default' : 'outline'}
              size='icon'
              onClick={() => setView('grid')}
              aria-label='Grid view'
            >
              <LayoutGrid className='h-4 w-4' />
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              size='icon'
              onClick={() => setView('list')}
              aria-label='List view'
            >
              <List className='h-4 w-4' />
            </Button>
          </div>
        </div>

        {/* Book list */}
        <BookView params={findParams} onPageChange={handlePageChange} view={view} />
      </section>
    </main>
  );
}

function FilterTabs({
  filter,
  setFilter,
  sort,
  setSort,
  defaultValue = 'filter',
}: {
  filter: BookFilterState;
  setFilter: (params: BookFilterState) => void;
  sort: BookSortState;
  setSort: (params: BookSortState) => void;
  defaultValue?: string;
}) {
  const { t, keys } = useLocale('books');
  return (
    <Tabs defaultValue={defaultValue} className='w-full'>
      <TabsList className='bg-background mb-4 w-full gap-1 border p-1'>
        <TabsTrigger
          value='filter'
          className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1'
        >
          <FilterIcon className='mr-1 h-4 w-4' />
          {t(keys.sidebar.tabs.filter)}
        </TabsTrigger>
        <TabsTrigger
          value='sort'
          className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-1'
        >
          <ArrowDownAZ className='h-4 w-4' />
          {t(keys.sidebar.tabs.sort)}
        </TabsTrigger>
      </TabsList>
      <TabsContent value='filter'>
        <BookFilter
          filter={filter}
          onFilter={setFilter}
          onReset={() => setFilter(DEFAULT_BOOK_FILTER)}
        />
      </TabsContent>
      <TabsContent value='sort'>
        <BookSort
          sort={sort}
          onSort={setSort}
          onReset={() => setSort(DEFAULT_BOOK_SORT)}
        />
      </TabsContent>
    </Tabs>
  );
}
