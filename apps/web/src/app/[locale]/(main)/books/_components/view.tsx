"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Button } from "@repo/ui/components/button";
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@repo/ui/components/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@repo/ui/components/tabs";
import { Card } from "@repo/ui/components/card";
import BookFilter from "./book-filter";
import BookSort from "./book-sort";
import { FindParams } from "@/types";
import { ArrowDownAZ, FilterIcon, LayoutGrid, List, SlidersHorizontal, Sparkles } from "lucide-react";
import { BookView } from "./book-view";
import { useLocale } from '@/hooks/ui/useLocale';

// Types
interface FilterState extends Partial<FindParams> {
  query?: string;
  categoryIds?: string[];
}

interface SortState {
  sortBy: string;
  sortOrder: "desc" | "asc";
}

// Helper: Parse URL params
const parseFilter = (p: URLSearchParams): FilterState => ({
  query: p.get('query') || undefined,
  categoryIds: p.get('categoryIds')?.split(',').filter(Boolean),
});

const parseSort = (p: URLSearchParams): SortState => ({
  sortBy: p.get('sortBy') || 'createdAt',
  sortOrder: (p.get('sortOrder') as 'desc' | 'asc') || 'desc',
});

export function BooksView() {
  const { t, keys } = useLocale('books');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // View state
  const [view, setView] = useState<"grid" | "list">("grid");

  // State - khởi tạo từ URL
  const [filter, setFilter] = useState<FilterState>(() => parseFilter(searchParams));
  const [sort, setSort] = useState<SortState>(() => parseSort(searchParams));

  // Sync state → URL
  useEffect(() => {
    const p = new URLSearchParams();
    if (filter.query) p.set('query', filter.query);
    if (filter.categoryIds?.length) p.set('categoryIds', filter.categoryIds.join(','));
    if (sort.sortBy !== 'createdAt') p.set('sortBy', sort.sortBy);
    if (sort.sortOrder !== 'desc') p.set('sortOrder', sort.sortOrder);
    p.set('page', '1');
    router.replace(`${pathname}?${p.toString()}`, { scroll: false });
  }, [filter, sort, pathname, router]);

  // Handlers
  const handleSetFilter = useCallback((f: Partial<FindParams>) => {
    setFilter({
      query: (f.query as string) || undefined,
      categoryIds: Array.isArray(f.categoryIds) ? f.categoryIds : undefined,
    });
  }, []);

  const handleSetSort = useCallback((s: Partial<SortState>) => {
    setSort(prev => ({ ...prev, ...s }));
  }, []);

  // Merge filter + sort
  const activeFilter = useMemo<Partial<FindParams>>(() => ({ ...filter, ...sort }), [filter, sort]);

  return (
    <main className="container py-8 flex gap-8">
      {/* Sidebar */}
      <aside className="w-64 hidden lg:block">
        <Card className="p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4" />
            <span className="font-semibold">{t(keys.sidebar.title)}</span>
          </div>
          <FilterTabs
            filter={filter}
            setFilter={handleSetFilter}
            sort={sort}
            setSort={handleSetSort}
            defaultValue="filter"
          />
        </Card>
      </aside>

      {/* Main content */}
      <section className="flex-1">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <div className="block lg:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Open filter">
                  <SlidersHorizontal className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-4">
                <SheetTitle className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-semibold">{t(keys.sidebar.title)}</span>
                  </div>
                </SheetTitle>
                <FilterTabs
                  filter={filter}
                  setFilter={handleSetFilter}
                  sort={sort}
                  setSort={handleSetSort}
                  defaultValue="filter"
                />
              </SheetContent>
            </Sheet>
          </div>
          <div className="flex gap-2">
            <Button
              variant={view === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setView("grid")}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={view === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setView("list")}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Danh sách sách */}
        <BookView filter={activeFilter} view={view} />
      </section>
    </main>
  );
}

function FilterTabs({
  filter,
  setFilter,
  sort,
  setSort,
  defaultValue = "filter",
}: {
  filter: FilterState;
  setFilter: (params: Partial<FindParams>) => void;
  sort: SortState;
  setSort: (params: { sortBy?: string; sortOrder?: "desc" | "asc" }) => void;
  defaultValue?: string;
}) {
  const { t, keys } = useLocale('books');
  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <TabsList className="w-full mb-4 bg-background gap-1 border p-1">
        <TabsTrigger value="filter" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          <FilterIcon className="w-4 h-4 mr-1" />
          {t(keys.sidebar.tabs.filter)}
        </TabsTrigger>
        <TabsTrigger value="sort" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          <ArrowDownAZ className="w-4 h-4" />
          {t(keys.sidebar.tabs.sort)}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="filter">
        <BookFilter filter={filter} onFilter={setFilter} onReset={() => setFilter({})} />
      </TabsContent>
      <TabsContent value="sort">
        <BookSort
          sort={sort}
          onSort={setSort}
          onReset={() => setSort({ sortBy: "createdAt", sortOrder: "desc" })}
        />
      </TabsContent>
    </Tabs>
  );
}
