import { showSubmittedData } from '@/lib/show-submitted-data';
import { toast } from 'sonner';
import { useExtendBorrow, useReturnBorrow } from '@/hooks/data/useBorrow';
import { useCreateReview, useUpdateReview } from '@/hooks/data/useReview';
import { useLocale } from '@/hooks/ui/useLocale';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { BorrowsExtendDialog } from './borrows-extend-dialog';
import { BorrowsHistoryDialog } from './borrows-history-dialog';
import { BorrowsMutateDialog } from './borrows-mutate-dialog';
import { useBorrowsContext } from './borrows-provider';
import { ReviewMutateDialog } from './review-mutate-dialog';

export function BorrowsDialogs() {
  const { t, keys } = useLocale('library');
  const { open, setOpen, currentRow, setCurrentRow } = useBorrowsContext();
  const extendBorrowMut = useExtendBorrow();
  const returnBorrowMut = useReturnBorrow();
  const createReviewMut = useCreateReview();
  const updateReviewMut = useUpdateReview();

  return (
    <>
      <BorrowsMutateDialog
        key='borrow-export'
        open={open === 'export'}
        onOpenChange={() => setOpen('export')}
        onSubmit={async () => {
          toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
            loading: 'Exporting borrows...',
            success: () => {
              setOpen(null);
              return 'Borrows exported successfully!';
            },
            error: (err) => err?.message || 'Failed to export borrows',
          });
        }}
      />

      {currentRow && (
        <>
          <BorrowsExtendDialog
            key='borrows-extend'
            open={open === 'extend'}
            borrowTime={currentRow.borrowTime}
            expireTime={currentRow.expireTime}
            note={currentRow.note}
            onOpenChange={() => setOpen('extend')}
            onSubmit={async (data) => {
              toast.promise(extendBorrowMut.mutateAsync({ id: currentRow!.id!, ...data }), {
                loading: t(keys.table.actions.extend.loading),
                success: () => {
                  setOpen(null);
                  setCurrentRow(null);
                  return t(keys.table.actions.extend.success);
                },
                error: (err) => err?.message || t(keys.table.actions.extend.error),
              });
            }}
          />

          <BorrowsHistoryDialog
            open={open === 'history'}
            onOpenChange={() => setOpen('history')}
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

              const onSuccess = () => {
                toast.success(
                  existingReview
                    ? t(keys.table.actions.review.update.success)
                    : t(keys.table.actions.review.create.success)
                );
                setOpen(null);
                setCurrentRow(null);
              };

              const onError = (err: any) => {
                toast.error(
                  err?.message ||
                    (existingReview
                      ? t(keys.table.actions.review.update.error)
                      : t(keys.table.actions.review.create.error))
                );
              };

              if (existingReview) {
                await updateReviewMut
                  .mutateAsync({ id: existingReview.id, data: payload })
                  .then(onSuccess)
                  .catch(onError);
              } else {
                await createReviewMut
                  .mutateAsync({
                    item: currentRow.item.id,
                    user: currentRow.borrower.id,
                    ...payload,
                  })
                  .then(onSuccess)
                  .catch(onError);
              }
            }}
          />

          <ConfirmDialog
            key='borrow-return'
            destructive
            open={open === 'return'}
            onOpenChange={() => {
              setOpen('return');
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            handleConfirm={async () => {
              toast.promise(returnBorrowMut.mutateAsync(currentRow.id!), {
                loading: t(keys.table.actions.return.loading),
                success: () => {
                  setOpen(null);
                  setTimeout(() => setCurrentRow(null), 500);
                  return t(keys.table.actions.return.success);
                },
                error: (err) => err?.message || t(keys.table.actions.return.error),
              });
            }}
            className='max-w-md'
            title={t(keys.table.actions.return.title, { borrowId: currentRow.id })}
            desc={t.rich(keys.table.actions.return.desc, {
              title: currentRow.item?.title || currentRow.id,
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
