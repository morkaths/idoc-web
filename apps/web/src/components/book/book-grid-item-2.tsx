import { Icon } from '@iconify/react';
import { Book } from "@/types";
import Image from 'next/image';
import { Button } from '@repo/ui/components/button';

type BookGridItemProps = {
  book: Book;
  onClick?: () => void;
};

export default function BookGridItem({
  book,
  onClick,
}: BookGridItemProps) {
  return (
    <div
      onClick={onClick}
      className="group w-full max-w-60 gap-1 cursor-pointer flex flex-col overflow-hidden"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick?.(); }}
    >
      {/* Card */}
      <div className="relative rounded-md w-full aspect-3/4 overflow-hidden">
        <Image
          src={book.coverUrl || "/images/placeholder-book.png"}
          alt={book.title}
          fill
          className="object-cover w-full h-full rounded-t-md"
          sizes="(max-width: 640px) 100vw, 240px"
        />

        <div className="absolute inset-0 bg-black/70 flex flex-col justify-between p-4
                        opacity-0 translate-y-2 pointer-events-none
                        group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto
                        group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto
                        transition-all duration-200 ease-out"
        >

          {/* Description */}
          <div className="text-left text-white/80 text-sm leading-relaxed mb-4 max-h-70 overflow-auto hide-scrollbar">
            {book.description ? (<p>{book.description}</p>) : (null)}
          </div>

          <div className="flex items-center justify-between">
            <h3 className="font-semibold mr-1 line-clamp-1 text-sm text-white">
              {book.title}
            </h3>

            <Button
              className="gap-2"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onClick?.(); }}
            >
              Read
              <Icon icon="mdi:arrow-right" width={20} />
            </Button>
          </div>
        </div>
      </div>
      {/* Title */}
      <div className="p-1">
        <h3 className="font-semibold mb-1 line-clamp-2 text-sm">
          {book.title}
        </h3>
      </div>
    </div>
  );
}