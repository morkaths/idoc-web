import React, { useState } from 'react';
import { type Table } from '@tanstack/react-table';
import { Trash2, CircleArrowUp, ArrowUpDown, Download } from 'lucide-react';
import { toast } from 'sonner';
import { sleep } from '@/lib/utils';
import { Button } from '@repo/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip';
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table';
import { ConfirmDialogDelete } from './confirm-dialog-delete';

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
  statuses = [],
  priorities = [],
  onBulkStatusChange,
  onBulkPriorityChange,
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

  const handleStatus = (status: string) => {
    return renderToast(
      async () => {
        if (onBulkStatusChange) {
          await Promise.resolve(onBulkStatusChange(status, items));
        } else {
          await sleep(1000);
        }
      },
      {
        loading: `Updating status...`,
        success: () =>
          `Status updated to "${status}" for ${count} ${count > 1 ? `${entityName}s` : entityName}.`,
      }
    );
  };

  const handlePriority = (priority: string) => {
    return renderToast(
      async () => {
        if (onBulkPriorityChange) {
          await Promise.resolve(onBulkPriorityChange(priority, items));
        } else {
          await sleep(1000);
        }
      },
      {
        loading: `Updating priority...`,
        success: () =>
          `Priority updated to "${priority}" for ${count} ${count > 1 ? `${entityName}s` : entityName}.`,
      }
    );
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
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  className='size-8'
                  aria-label='Update status'
                  title='Update status'
                >
                  <CircleArrowUp />
                  <span className='sr-only'>Update status</span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Update status</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent sideOffset={8}>
            {statuses.map((status) => (
              <DropdownMenuItem
                key={status.value}
                defaultValue={status.value}
                onClick={() => handleStatus(status.value)}
              >
                {status.icon && <status.icon className='text-muted-foreground size-4' />}
                {status.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  aria-label='Update priority'
                  title='Update priority'
                  className='size-8'
                >
                  <ArrowUpDown />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Update priority</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent sideOffset={8}>
            {priorities.map((priority) => (
              <DropdownMenuItem
                key={priority.value}
                defaultValue={priority.value}
                onClick={() => handlePriority(priority.value)}
              >
                {priority.icon && <priority.icon className='text-muted-foreground size-4' />}
                {priority.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

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
