"use client";

import { useBook } from "@/hooks/data/useBook";
import { useSession } from "next-auth/react";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import Image from "next/image";
import dayjs from "dayjs";
import { Bookmark, Plus } from "lucide-react";
import { BookTabs } from "./book-tabs";
import { useState } from "react";
import { BorrowBookDialog } from "./borrow-book-dialog";
import { toast } from "sonner";
import { useCreateBorrow } from "@/hooks/data/useBorrow";
import { useRouter } from "next/navigation";

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

export function BookDetailView({ id }: BookDetailViewProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const { data: book, isLoading, error } = useBook(id);
  const [imageError, setImageError] = useState(false);
  const [openBorrow, setOpenBorrow] = useState(false);
  const createBorrowMut = useCreateBorrow();

  if (isLoading) return <div>Loading...</div>;
  if (error || !book) return <div>Book not found</div>;

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
