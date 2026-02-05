"use client";

import { useBook } from "@/hooks/data/useBook";
import { useSession } from "next-auth/react";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import Image from "next/image";
import dayjs from "dayjs";
import { Bookmark, Plus, BookX } from "lucide-react";
import { BookTabs } from "./book-tabs";
import { useState } from "react";
import { BorrowBookDialog } from "./borrow-book-dialog";
import { toast } from "sonner";
import { useCreateBorrow } from "@/hooks/data/useBorrow";
import { useRouter } from "next/navigation";
import { Skeleton } from "@repo/ui/components/skeleton";

interface BookDetailViewProps {
  id: string;
}

const CoverImage = ({ title, src }: { title: string, src?: string }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative w-46 sm:w-64 md:w-72 lg:w-80 aspect-[3/4] rounded-xl overflow-hidden border-2 bg-white dark:bg-zinc-800">
      {!imageError && src ? (
        <Image
          src={src}
          alt={title}
          fill
          className="object-cover"
          priority
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center p-6 text-center">
          <span className="font-bold text-lg md:text-xl line-clamp-4 leading-tight opacity-90 break-words w-full">
            {title}
          </span>
        </div>
      )}
    </div>
  );
};

function BookDetailSkeleton() {
  return (
    <div className="relative min-h-screen py-10">
      {/* Banner */}
      <Skeleton className="w-full h-64 md:h-72 lg:h-96 relative rounded-none" />

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto -mt-40 flex flex-col md:flex-row gap-8 px-4">
        {/* Book cover */}
        <div className="w-46 sm:w-64 md:w-72 lg:w-80 aspect-[3/4] rounded-md overflow-hidden border-2 bg-white dark:bg-zinc-800">
          <Skeleton className="w-full h-full rounded-none" />
        </div>

        {/* Book info */}
        <div className="flex-1 flex flex-col justify-end space-y-4 pb-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 md:h-10 w-3/4" />
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-6 w-24 rounded-md" />
            <Skeleton className="h-6 w-16 rounded-md" />
          </div>
          {/* Author */}
          <Skeleton className="h-4 w-48" />
          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-10 px-4 space-y-6">
        {/* Tabs List */}
        <div className="flex justify-center p-1 w-fit mx-auto gap-1 border rounded-md bg-background">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>

        {/* Tab Content (Info style) */}
        <div className="bg-card/30 rounded-xl p-6 mt-4 border border-gray-100 dark:border-zinc-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Description - Spanning full width */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-2 mb-2">
              <Skeleton className="h-3 w-24 mb-2" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </div>

            {/* Other Info Items */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-32" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BookDetailError() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center animate-in fade-in zoom-in duration-300">
      <div className="relative">
        <div className="bg-background relative p-6 rounded-md border shadow-sm">
          <BookX className="w-12 h-12 text-muted-foreground" />
        </div>
      </div>
      <div className="space-y-2 max-w-md mx-auto">
        <h2 className="text-2xl font-bold tracking-tight">Không tìm thấy sách</h2>
        <p className="text-muted-foreground">
          Cuốn sách bạn đang tìm kiếm có thể đã bị xóa, không tồn tại hoặc đường dẫn không chính xác.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Tải lại trang
        </Button>
        <Button onClick={() => router.push('/')}>
          Về trang chủ
        </Button>
      </div>
    </div>
  );
}

export function BookDetailView({ id }: BookDetailViewProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const { data: book, isLoading, error } = useBook(id);
  const [openBorrow, setOpenBorrow] = useState(false);
  const createBorrowMut = useCreateBorrow();

  if (isLoading) return <BookDetailSkeleton />;
  if (error || !book) return <BookDetailError />;

  const handleBorrowClick = () => {
    if (!user) {
      router.push(`/sign-in?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setOpenBorrow(true);
  };

  return (
    <div className="relative min-h-screen py-10">
      {/* Banner */}
      <div className="w-full h-64 md:h-72 lg:h-96 bg-primary/10 dark:bg-primary/10 relative" />

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto -mt-40 flex flex-col md:flex-row gap-8 px-4">
        {/* Book cover */}
        <CoverImage title={book.title} src={book.coverUrl} />

        {/* Book info */}
        <div className="flex-1 flex flex-col justify-end">
          <div className="mb-2 text-sm">
            {book.publishedDate && dayjs(book.publishedDate).format("MMMM D, YYYY")}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{book.title}</h2>
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-4">
            {book.categories?.map((cat) => (
              <Badge key={cat.id} variant="outline">
                {cat.translations?.[0]?.name || cat.id}
              </Badge>
            ))}
          </div>
          {/* Description */}
          {/* Author */}
          <div className="text-sm text-muted-foreground mb-6">
            By{" "}
            {book.authors?.length ? (
              book.authors.map((a, i) => (
                <span key={i}>
                  <span className="font-semibold text-muted-foreground underline hover:text-primary transition-colors cursor-pointer">
                    {a.name}
                  </span>
                  {i < (book.authors?.length || 0) - 1 && ", "}
                </span>
              ))
            ) : (
              "Unknown Author"
            )}
          </div>
          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline">
              <Plus className="w-4 h-4" />
              Add to list
            </Button>
            <Button variant="default" onClick={handleBorrowClick}>
              <Bookmark className="w-4 h-4" />
              Borrow Now
            </Button>
            <BorrowBookDialog
              open={openBorrow}
              onOpenChange={setOpenBorrow}
              onSubmit={(data) => {
                toast.promise(
                  createBorrowMut.mutateAsync({
                    itemId: book.id!,
                    ...data,
                  }),
                  {
                    loading: 'Creating borrow...',
                    success: () => {
                      setOpenBorrow(false);
                      return 'Book borrowed successfully!';
                    },
                    error: (err) => err?.message || 'Failed to borrow book',
                  }
                );
              }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-10 px-4">
        <BookTabs book={book} />
      </div>
    </div>
  );
}
