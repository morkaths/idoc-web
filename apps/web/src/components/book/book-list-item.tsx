import Image from "next/image";
import { Icon } from '@iconify/react';
import { Book } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";

type BookListItemProps = {
  book: Book;
  onClick?: () => void;
};

export default function BookListItem({ book, onClick }: BookListItemProps) {
  return (
    <Card className="w-full py-0 flex-row gap-0 overflow-hidden cursor-pointer group" role="button" tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick?.(); }}
    >
      <CardContent className="p-0 min-w-30 shrink-0">
        <div className="relative w-full h-full">
          <Image
            src={book.coverUrl || "/images/placeholder-book.png"}
            alt={book.title}
            fill
            className="object-cover rounded-l-xl"
            sizes="96px"
          />
        </div>
      </CardContent>
      <div className="flex-1 min-w-0">
        <CardHeader className="pt-6">
          <CardTitle className="text-base font-semibold text-gray-700 dark:text-gray-300">{book.title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground line-clamp-2">{book.description}</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-end py-6">
          <Button
            className="gap-2"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onClick?.(); }}
          >
            Read
            <Icon icon="mdi:arrow-right" width={20} />
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}