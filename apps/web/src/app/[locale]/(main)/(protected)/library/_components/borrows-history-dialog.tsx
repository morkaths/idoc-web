'use client';

import { useParams } from 'next/navigation';
import { type BorrowResponse } from '@/types';
import { ImageOff } from 'lucide-react';
import { useLocale } from '@/hooks/ui/useLocale';
import { Badge } from '@repo/ui/components/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@repo/ui/components/dialog';
import { BorrowTimeline } from './borrows-timeline';

import { AppImage } from '@/components/app-image';

const CoverImage = ({ src, title }: { src?: string; title: string }) => {
  if (!src) {
    return (
      <div className='bg-muted/20 text-muted-foreground flex h-full w-full items-center justify-center'>
        <ImageOff className='h-6 w-6 opacity-50' />
      </div>
    );
  }

  return (
    <AppImage
      src={src}
      alt={title}
      fill
      sizes='64px'
      className='object-cover'
      loading='lazy'
    />
  );
};

type BorrowsHistoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  borrow: BorrowResponse | null;
};

export function BorrowsHistoryDialog({ open, onOpenChange, borrow }: BorrowsHistoryDialogProps) {
  const { t, keys } = useLocale('library');
  const { locale } = useParams();

  if (!borrow) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex h-[80vh] flex-col gap-0 p-0 sm:max-w-[600px]'>
        <DialogHeader className='border-b px-6 py-4'>
          <DialogTitle>{t(keys.table.actions.history.title)}</DialogTitle>
          <DialogDescription>{t(keys.table.actions.history.description)}</DialogDescription>
        </DialogHeader>

        <div className='bg-muted/10 flex items-start gap-4 border-b p-6'>
          <div className='bg-background relative h-24 w-16 shrink-0 overflow-hidden rounded-md border shadow-sm'>
            <CoverImage src={borrow.book?.coverUrl} title={borrow.book?.title || 'Book Cover'} />
          </div>
          <div className='min-w-0 flex-1'>
            <h3 className='truncate text-lg leading-tight font-semibold' title={borrow.book?.title}>
              {borrow.book?.title || t(keys.table.actions.history.unknownTitle)}
            </h3>
            <p className='text-muted-foreground mt-1 line-clamp-1 text-sm'>
              {borrow.book?.authors?.length
                ? borrow.book.authors.map((a) => a.name).join(', ')
                : t(keys.table.actions.history.unknownAuthor)}
            </p>
            <div className='mt-2 flex flex-wrap gap-2'>
              {borrow.book?.categories?.length ? (
                borrow.book.categories.map((c, i) => (
                  <Badge key={i} variant='secondary' className='h-5 px-2 py-0 text-xs font-normal'>
                    {c.translations?.find((tr) => tr.lang === locale)?.name ||
                      c.translations?.[0]?.name}
                  </Badge>
                ))
              ) : (
                <span className='text-muted-foreground text-xs'>
                  {t(keys.table.actions.history.noCategory)}
                </span>
              )}
            </div>
            <div className='text-muted-foreground mt-2 text-xs'>
              ID: <span className='font-mono'>{borrow.book?.id}</span>
            </div>
          </div>
        </div>

        <div className='flex-1 overflow-y-auto'>
          <BorrowTimeline borrow={borrow} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
