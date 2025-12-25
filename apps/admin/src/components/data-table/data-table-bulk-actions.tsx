import React, { useState } from 'react';
import { type Table } from '@tanstack/react-table';
import { Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { sleep } from '@/lib/utils';
import { Button } from '@repo/ui/components/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip';
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table';
import { ConfirmDialogDelete } from '../confirm-dialog-delete';

type Option = { label: string; value: string; icon?: React.ComponentType<{ className?: string }> };

export type DataTableBulkActionsProps<T> = {
  table: Table<T>;
  entityName?: string;
  statuses?: Option[];
  priorities?: Option[];
  onBulkStatusChange?: (status: string, items: T[]) => Promise<void> | void;
  onBulkPriorityChange?: (priority: string, items: T[]) => Promise<void> | void;
  onBulkExport?: (items: T[]) => Promise<void> | void;
  onBulkDelete?: (items: T[]) => Promise<void> | void;
};

export function DataTableBulkActions<T>({
  table,
  entityName = 'item',
  onBulkExport,
  onBulkDelete,
}: DataTableBulkActionsProps<T>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const items = selectedRows.map((r) => r.original as T);
  const count = items.length;

  const renderToast = async (
    promiseOrCb: Promise<void> | (() => Promise<void> | void),
    messages: {
      loading: string;
      success: string | (() => string);
      error?: string;
    }
  ) => {
    const promise =
      typeof promiseOrCb === 'function' ? Promise.resolve().then(() => promiseOrCb()) : promiseOrCb;
    await toast.promise(
      promise.then(() => sleep(700)),
      {
        loading: messages.loading,
        success:
          typeof messages.success === 'function'
            ? (messages.success as () => string)()
            : (messages.success as string),
        error: messages.error ?? 'Error',
      }
    );
    table.resetRowSelection();
  };

  const handleExport = () => {
    return renderToast(
      async () => {
        if (onBulkExport) {
          await Promise.resolve(onBulkExport(items));
        } else {
          await sleep(1000);
        }
      },
      {
        loading: `Exporting ${entityName}${count > 1 ? 's' : ''}...`,
        success: () => `Exported ${count} ${entityName}${count > 1 ? 's' : ''}.`,
      }
    );
  };

  if (!table) return null;

  return (
    <>
      <BulkActionsToolbar table={table} entityName={entityName}>
        {/* Export */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={handleExport}
              className='size-8'
              aria-label='Export'
              title='Export'
            >
              <Download />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export</p>
          </TooltipContent>
        </Tooltip>

        {/* Delete */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Delete selected items'
              title='Delete selected items'
            >
              <Trash2 />
              <span className='sr-only'>Delete selected items</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete selected</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      {/* Confirm delete dialog */}
      <ConfirmDialogDelete
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        table={table}
        itemName={entityName}
        confirmWord='DELETE'
        onConfirm={async () => {
          if (onBulkDelete) {
            await Promise.resolve(onBulkDelete(items));
          } else {
            await sleep(1000);
          }
        }}
      />
    </>
  );
}

export default DataTableBulkActions;
