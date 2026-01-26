import { Book } from "@/types";
import { Skeleton } from "@repo/ui/components/skeleton";
import { Card, CardContent } from "@repo/ui/components/card";
import { useRouter } from "next/navigation";
import paths from "@/config/path";
import { BookListItem } from "./book-list-item";

interface BookListItemsProps {
  data?: Book[];
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export function BookListItems({
  data = [],
  loading = false,
  error = null,
  className = "",
}: BookListItemsProps) {
  const router = useRouter();

  if (loading) {
    return (
      <div className={`flex flex-col gap-4 ${className}`}>
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="w-full flex flex-row items-center">
            <Skeleton className="w-24 h-32 rounded-l-md" />
            <CardContent className="flex-1 py-4 px-6">
              <Skeleton className="h-5 w-1/2 mb-2" />
              <Skeleton className="h-4 w-3/4 mb-1" />
              <Skeleton className="h-4 w-1/3" />
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-4 text-center rounded-md bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
        {error}
      </div>
    );
  }
  if (!data.length) {
    return (
      <div className="p-4 text-center text-gray-600 dark:text-gray-400">
        No books found.
      </div>
    );
  }
  return (
    <div className={`grid grid-cols-1 xl:grid-cols-2 gap-6 ${className}`}>
      {data.map((book) => (
        <BookListItem
          key={book._id}
          book={book}
          onClick={() => router.push(paths.book(book._id))}
        />
      ))}
    </div>
  );
}