"use client";

import { useState } from "react";
import { Button } from "@repo/ui/components/button";
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@repo/ui/components/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@repo/ui/components/tabs";
import { Card } from "@repo/ui/components/card";
import BookFilter from "./_components/book-filter";
import BookSort from "./_components/book-sort";
import { FindParams } from "@/types";
import { ArrowDownAZ, FilterIcon, LayoutGrid, List, SlidersHorizontal, Sparkles } from "lucide-react";
import BookView from "./_components/book-view";

export default function BooksPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<Partial<FindParams>>({});
  const [sort, setSort] = useState<{ sortBy: string; sortOrder: "desc" | "asc" }>({ sortBy: "createdAt", sortOrder: "desc" });

  const handleSetSort = (params: { sortBy?: string; sortOrder?: "desc" | "asc" }) => {
    setSort({
      sortBy: params.sortBy ?? "createdAt",
      sortOrder: params.sortOrder ?? "desc",
    });
  };

  return (
    <main className="container py-8 flex gap-8">
      {/* Sidebar */}
      <aside className="w-64 hidden lg:block">
        <Card className="p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4" />
            <span className="font-semibold">Discover</span>
          </div>
          <FilterTabs
            filter={filter}
            setFilter={setFilter}
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
                    <span className="font-semibold">Discover</span>
                  </div>
                </SheetTitle>
                <FilterTabs
                  filter={filter}
                  setFilter={setFilter}
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
        <BookView filter={{ ...filter, ...sort }} view={view} />
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
  filter: Partial<FindParams>;
  setFilter: (params: Partial<FindParams>) => void;
  sort: { sortBy: string; sortOrder: "desc" | "asc" };
  setSort: (params: { sortBy?: string; sortOrder?: "desc" | "asc" }) => void;
  defaultValue?: string;
}) {
  return (
    <Tabs defaultValue={defaultValue} className="w-full">
      <TabsList className="w-full mb-4 bg-card border">
        <TabsTrigger value="filter" className="flex-1">
          <FilterIcon className="w-4 h-4" />
          Filter
        </TabsTrigger>
        <TabsTrigger value="sort" className="flex-1">
          <ArrowDownAZ className="w-4 h-4" />
          Sort
        </TabsTrigger>
      </TabsList>
      <TabsContent value="filter">
        <BookFilter
          filter={filter}
          onFilter={setFilter}
          onReset={() => setFilter({})}
        />
      </TabsContent>
      <TabsContent value="sort">
        <BookSort
          sort={sort}
          onSort={params => setSort({
            sortBy: params.sortBy ?? "createdAt",
            sortOrder: params.sortOrder ?? "desc"
          })}
          onReset={() => setSort({ sortBy: "createdAt", sortOrder: "desc" })}
        />
      </TabsContent>
    </Tabs>
  );
}