'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import {
  useCreateBorrow,
  useUpdateBorrow,
  useExtendBorrow,
  useReturnBorrow,
} from '@/hooks/data/useBorrow';
import { useCreateReview, useUpdateReview } from '@/hooks/data/useReview';
import { useLocale } from '@/hooks/ui/useLocale';
import { Button } from '@repo/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/dialog';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { BorrowsExtendDialog } from './borrows-extend-dialog';
import { BorrowsHistoryDialog } from './borrows-history-dialog';
import { BorrowsMutateDialog } from './borrows-mutate-dialog';
import { useBorrowsContext } from './borrows-provider';
import { ReviewMutateDialog } from './review-mutate-dialog';

export function BorrowsDialogs() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t, KEYS, keys } = useLocale('library');
  const { open, setOpen, currentRow, setCurrentRow } = useBorrowsContext();

  const createBorrowMut = useCreateBorrow();
  const updateBorrowMut = useUpdateBorrow();
  const extendBorrowMut = useExtendBorrow();
  const returnBorrowMut = useReturnBorrow();
  const createReviewMut = useCreateReview();
  const updateReviewMut = useUpdateReview();

  return (
    <>
      <BorrowsMutateDialog
        key='borrow-create'
        open={open === 'create'}
        onOpenChange={(v) => setOpen(v ? 'create' : null)}
        onSubmit={async (data) => {
          return toast.promise(
            createBorrowMut.mutateAsync(data as Parameters<typeof createBorrowMut.mutateAsync>[0]),
            {
              loading: t(keys.table.actions.mutate.loading),
              success: (response) => {
                setOpen(null);
                return response?.message || t(keys.table.actions.mutate.success);
              },
              error: (err) => err?.message || t(keys.table.actions.mutate.error),
            }
          );
        }}
      />

      <Dialog open={open === 'export'} onOpenChange={(v) => setOpen(v ? 'export' : null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t(keys.table.bulkActions.export.label)}</DialogTitle>
            <DialogDescription>{t(keys.table.bulkActions.export.confirmDesc)}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setOpen(null)}>
              {t(KEYS.common.actions.cancel)}
            </Button>
            <Button
              onClick={async () => {
                return toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
                  loading: t(keys.table.bulkActions.export.loading),
                  success: () => {
                    setOpen(null);
                    return t(keys.table.bulkActions.export.success);
                  },
                  error: (err) => err?.message || t(keys.table.bulkActions.export.error),
                });
              }}
            >
              {t(keys.table.bulkActions.export.label)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {currentRow && (
        <>
          <BorrowsMutateDialog
            key='borrow-update'
            open={open === 'edit'}
            onOpenChange={(v) => setOpen(v ? 'edit' : null)}
            initialData={currentRow}
            onSubmit={async (data) => {
              return toast.promise(
                updateBorrowMut.mutateAsync({
                  id: currentRow.id,
                  data,
                }),
                {
                  loading: t(keys.table.actions.mutate.loading),
                  success: (response) => {
                    setOpen(null);
                    setCurrentRow(null);
                    return response?.message || t(keys.table.actions.mutate.success);
                  },
                  error: (err) => err?.message || t(keys.table.actions.mutate.error),
                }
              );
            }}
          />

          <BorrowsExtendDialog
            key='borrows-extend'
            open={open === 'extend'}
            borrowedDate={currentRow.borrowedDate}
            dueDate={currentRow.dueDate}
            notes={currentRow.notes}
            onOpenChange={(v) => setOpen(v ? 'extend' : null)}
            onSubmit={async (data) => {
              return toast.promise(extendBorrowMut.mutateAsync({ id: currentRow.id, data }), {
                loading: t(keys.table.actions.extend.loading),
                success: (response) => {
                  setOpen(null);
                  setCurrentRow(null);
                  return response?.message || t(keys.table.actions.extend.success);
                },
                error: (err) => err?.message || t(keys.table.actions.extend.error),
              });
            }}
          />

          <BorrowsHistoryDialog
            open={open === 'history'}
            onOpenChange={(v) => setOpen(v ? 'history' : null)}
            borrow={currentRow}
          />

          <ReviewMutateDialog
            open={open === 'review'}
            onOpenChange={(v) => setOpen(v ? 'review' : null)}
            borrow={currentRow}
            onSubmit={async (data, existingReview) => {
              const payload = {
                rating: data.rating,
                content: data.content ?? '',
              };

              const onError = (err: unknown) => {
                const error = err as Record<string, unknown>;
                toast.error(
                  (error?.message as string) ||
                    (existingReview
                      ? t(keys.table.actions.review.messages.create.error)
                      : t(keys.table.actions.review.messages.update.error))
                );
              };

              if (existingReview) {
                return updateReviewMut
                  .mutateAsync({ id: existingReview.id, data: payload })
                  .then((response) => {
                    toast.success(
                      response?.message || t(keys.table.actions.review.messages.update.success)
                    );
                    setOpen(null);
                    setCurrentRow(null);
                  })
                  .catch(onError);
              } else {
                return createReviewMut
                  .mutateAsync({
                    bookId: currentRow.book.id,
                    rating: payload.rating,
                    content: payload.content,
                  })
                  .then((response) => {
                    toast.success(
                      response?.message || t(keys.table.actions.review.messages.create.success)
                    );
                    setOpen(null);
                    setCurrentRow(null);
                  })
                  .catch(onError);
              }
            }}
          />

          <ConfirmDialog
            key='borrow-return'
            destructive
            open={open === 'return'}
            onOpenChange={(v) => {
              setOpen(v ? 'return' : null);
              if (!v) {
                setTimeout(() => {
                  setCurrentRow(null);
                }, 500);
              }
            }}
            handleConfirm={async () => {
              if (isSubmitting) return;
              setIsSubmitting(true);
              try {
                await toast.promise(
                  returnBorrowMut.mutateAsync({ id: currentRow.id, data: undefined }),
                  {
                    loading: t(keys.table.actions.return.loading),
                    success: (response) => {
                      setOpen(null);
                      setTimeout(() => setCurrentRow(null), 500);
                      return response?.message || t(keys.table.actions.return.success);
                    },
                    error: (err) => err?.message || t(keys.table.actions.return.error),
                  }
                );
              } finally {
                setIsSubmitting(false);
              }
            }}
            isLoading={isSubmitting}
            className='max-w-md'
            title={t(keys.table.actions.return.title, { borrowId: currentRow.id })}
            desc={t.rich(keys.table.actions.return.confirmDesc, {
              title: currentRow.book?.title || currentRow.id,
              strong: (chunks) => <strong>{chunks}</strong>,
              br: () => <br />,
            })}
            confirmText={t(keys.table.actions.return.label)}
          />
        </>
      )}
    </>
  );
}
