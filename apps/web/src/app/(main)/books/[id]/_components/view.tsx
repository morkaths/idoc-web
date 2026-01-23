"use client";

import { useBook } from "@/hooks/data/useBook";
import { useSession } from "next-auth/react";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import Image from "next/image";
import dayjs from "dayjs";
import { Bookmark, Plus } from "lucide-react";
import BookTabs from "./book-tags";
import { useState } from "react";
import { BorrowBookDialog } from "./borrow-book-dialog";
import { toast } from "sonner";
import { useCreateBorrow } from "@/hooks/data/useBorrow";
import { useRouter } from "next/navigation";

interface BookDetailViewProps {
  id: string;
}

export function BookDetailView({ id }: BookDetailViewProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const { data: book, isLoading, error } = useBook(id);
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
      <div className="w-full flex justify-center">
        <div className="relative w-full max-w-7xl h-72 md:h-96 lg:h-128 md:rounded-xl overflow-hidden border-2">
          <Image
            src={book.coverUrl || "/images/placeholder-book.png"}
            alt={book.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto -mt-40 flex flex-col md:flex-row gap-8 px-4">
        {/* Book cover */}
        <div className="relative w-46 sm:w-64 md:w-72 lg:w-80 aspect-2/3 rounded-xl overflow-hidden shadow-2xl border-2">
          <Image
            src={book.coverUrl || "/images/placeholder-book.png"}
            alt={book.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Book info */}
        <div className="flex-1 flex flex-col justify-end">
          <div className="mb-2 text-sm">
            {book.publishedDate && dayjs(book.publishedDate).format("MMMM D, YYYY")}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{book.title}</h2>
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-4">
            {book.categories?.map((cat) => (
              <Badge key={cat._id} variant="outline">
                {cat.translations?.[0]?.name || cat._id}
              </Badge>
            ))}
          </div>
          {/* Description */}
          <p className="text-sm mb-6">{book.description}</p>
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
                    itemId: book._id!,
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
        <BookTabs />
      </div>
    </div>
  );
}
