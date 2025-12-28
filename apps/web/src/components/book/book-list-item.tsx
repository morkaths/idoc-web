import Image from "next/image";
import { Icon } from '@iconify/react';
import { Book } from "@/types";
import { Card, CardContent } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";

type BookListItemProps = {
  book: Book;
  onClick?: () => void;
};

export default function BookListItem({ book, onClick }: BookListItemProps) {
  return (
    <Card
      className="group flex w-full cursor-pointer overflow-hidden"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick?.(); }}
    >
      <div className="relative w-24 h-32 shrink-0">
        <Image
          src={book.coverUrl || "/images/placeholder-book.png"}
          alt={book.title}
          fill
          className="object-cover rounded-l-md"
          sizes="96px"
        />
      </div>
      <CardContent className="flex flex-col justify-between p-4 w-full">
        <div>
          <h3 className="font-semibold text-base mb-1 text-gray-700 dark:text-gray-300">
            {book.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{book.description}</p>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="default"
            size="sm"
            className="gap-2"
            onClick={(e) => { e.stopPropagation(); onClick?.(); }}
          >
            <Icon icon="mdi:book-open-variant" width={20} />
            Read
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500"
            onClick={(e) => { e.stopPropagation(); onClick?.(); }}
          >
            <Icon icon="mdi:arrow-right" width={20} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}