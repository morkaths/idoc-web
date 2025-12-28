import Image from "next/image";
import { Icon } from '@iconify/react';
import { Book } from "@/types";
import { Card, CardContent, CardFooter } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { AspectRatio } from "@repo/ui/components/aspect-ratio";

type BookGridItemProps = {
  book: Book;
  onClick?: () => void;
};

export default function BookGridItem({
  book,
  onClick,
}: BookGridItemProps) {
  return (
    <Card
      className="group w-full max-w-60 flex flex-col cursor-pointer overflow-hidden"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick?.(); }}
    >
      <CardContent className="p-0">
        <div className="relative">
          <AspectRatio ratio={3 / 4}>
            <Image
              src={book.coverUrl || "/images/placeholder-book.png"}
              alt={book.title}
              fill
              className="object-cover rounded-t-md"
              sizes="(max-width: 640px) 100vw, 240px"
            />
          </AspectRatio>
          <div className="absolute inset-0 bg-black/70 flex flex-col justify-between p-4
                          opacity-0 translate-y-2 pointer-events-none
                          group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto
                          group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto
                          transition-all duration-200 ease-out
                          rounded-t-md"
          >
            <div className="text-left text-white text-sm leading-relaxed mb-4 max-h-40 overflow-auto hide-scrollbar">
              {book.description && <p>{book.description}</p>}
            </div>
            <div className="flex items-center justify-between">
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
                className="text-white bg-white/10 hover:bg-white/20"
                onClick={(e) => { e.stopPropagation(); onClick?.(); }}
              >
                <Icon icon="mdi:arrow-right" width={20} />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start p-2">
        <h3 className="font-semibold mb-1 line-clamp-2 text-sm text-gray-700 dark:text-gray-300">
          {book.title}
        </h3>
      </CardFooter>
    </Card>
  );
}