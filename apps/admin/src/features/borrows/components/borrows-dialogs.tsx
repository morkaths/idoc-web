import { showSubmittedData } from '@/lib/show-submitted-data';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { BorrowsMutateDialog } from './borrows-mutate-dialog';
import { useBorrowsContext } from './borrows-provider';
import { useCreateBorrow, useUpdateBorrow, useDeleteBorrow, useExtendBorrow } from '@/hooks/data/useBorrow';
import { toast } from 'sonner';
import { BorrowsExtendDialog } from './borrows-extend-dialog';

export function BorrowsDialogs() {
    const { open, setOpen, currentRow, setCurrentRow } = useBorrowsContext();
    const createBorrowMut = useCreateBorrow();
    const updateBorrowMut = useUpdateBorrow();
    const extendBorrowMut = useExtendBorrow();
    const deleteBorrowMut = useDeleteBorrow();

    return (
        <>
            <BorrowsMutateDialog
                key='borrow-create'
                open={open === 'create'}
                onOpenChange={() => setOpen('create')}
                onSubmit={async (data) => {
                    toast.promise(
                        createBorrowMut.mutateAsync(data),
                        {
                            loading: 'Creating borrow...',
                            success: () => {
                                setOpen(null);
                                return 'Borrow created successfully!';
                            },
                            error: (err) => err?.message || 'Failed to create borrow',
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
                                extendBorrowMut.mutateAsync({ id: currentRow!.id!, ...data }),
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

                    <BorrowsMutateDialog
                        key={`borrow-update-${currentRow.id}`}
                        open={open === 'update'}
                        onOpenChange={() => {
                            setOpen('update');
                            setTimeout(() => {
                                setCurrentRow(null);
                            }, 500);
                        }}
                        initialData={currentRow}
                        onSubmit={async (data) => {
                            toast.promise(
                                updateBorrowMut.mutateAsync({ id: currentRow.id!, data }),
                                {
                                    loading: 'Updating borrow...',
                                    success: () => {
                                        setOpen(null);
                                        setTimeout(() => setCurrentRow(null), 500);
                                        return 'Borrow updated successfully!';
                                    },
                                    error: (err) => err?.message || 'Failed to update borrow',
                                }
                            );
                        }}
                    />

                    <ConfirmDialog
                        key='borrow-delete'
                        destructive
                        open={open === 'delete'}
                        onOpenChange={() => {
                            setOpen('delete');
                            setTimeout(() => {
                                setCurrentRow(null);
                            }, 500);
                        }}
                        handleConfirm={async () => {
                            toast.promise(
                                deleteBorrowMut.mutateAsync(currentRow.id!),
                                {
                                    loading: 'Deleting borrow...',
                                    success: () => {
                                        setOpen(null);
                                        setTimeout(() => setCurrentRow(null), 500);
                                        showSubmittedData(currentRow, 'The following borrow has been deleted:');
                                        return 'Borrow deleted successfully!';
                                    },
                                    error: (err) => err?.message || 'Failed to delete borrow',
                                }
                            );
                        }}
                        className='max-w-md'
                        title={`Delete this borrow: ${currentRow.id} ?`}
                        desc={
                            <>
                                You are about to delete a borrow with the ID <strong>{currentRow.id}</strong>.<br />
                                This action cannot be undone.
                            </>
                        }
                        confirmText='Delete'
                    />
                </>
            )}
        </>
    );
}