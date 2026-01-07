import { showSubmittedData } from '@/lib/show-submitted-data';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { BorrowsMutateDialog } from './borrows-mutate-dialog';
import { useBorrowsContext } from './borrows-provider';
import { useExtendBorrow, useReturnBorrow } from '@/hooks/data/useBorrow';
import { toast } from 'sonner';
import { BorrowsExtendDialog } from './borrows-extend-dialog';
import { BorrowsHistoryDialog } from './borrows-history-dialog';

export function BorrowsDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = useBorrowsContext();
    const extendBorrowMut = useExtendBorrow();
    const returnBorrowMut = useReturnBorrow();

    return (
        <>
            <BorrowsMutateDialog
                key='borrow-export'
                open={open === 'export'}
                onOpenChange={() => setOpen('export')}
                onSubmit={async () => {
                    toast.promise(
                        new Promise((resolve) => setTimeout(resolve, 2000)),
                        {
                            loading: 'Exporting borrows...',
                            success: () => {
                                setOpen(null);
                                return 'Borrows exported successfully!';
                            },
                            error: (err) => err?.message || 'Failed to export borrows',
                        }
                    );
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
                            toast.promise(
                                extendBorrowMut.mutateAsync({ id: currentRow!._id!, ...data }),
                                {
                                    loading: 'Extending borrow...',
                                    success: () => {
                                        setOpen(null);
                                        setCurrentRow(null);
                                        return 'Borrow extended successfully!';
                                    },
                                    error: (err) => err?.message || 'Failed to extend borrow',
                                }
                            );
                        }}
                    />

                    <BorrowsHistoryDialog
                        open={open === 'history'}
                        onOpenChange={() => setOpen('history')}
                        borrow={currentRow}
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
                            toast.promise(
                                returnBorrowMut.mutateAsync(currentRow._id!),
                                {
                                    loading: 'Returning...',
                                    success: () => {
                                        setOpen(null);
                                        setTimeout(() => setCurrentRow(null), 500);
                                        showSubmittedData(currentRow, 'The following borrow has been returned:');
                                        return 'Borrow returned successfully!';
                                    },
                                    error: (err) => err?.message || 'Failed to return borrow',
                                }
                            );
                        }}
                        className='max-w-md'
                        title={`Return this borrow: ${currentRow._id} ?`}
                        desc={
                            <>
                                You are about to return a borrow with the ID <strong>{currentRow._id}</strong>.<br />
                                This action cannot be undone.
                            </>
                        }
                        confirmText='Return'
                    />
                </>
            )}
        </>
    );
}