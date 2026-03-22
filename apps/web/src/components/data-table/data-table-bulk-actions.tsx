import React, { useState } from 'react';
import { type Table } from '@tanstack/react-table';
import { Button } from '@repo/ui/components/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@repo/ui/components/tooltip';
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table';
import { ConfirmBulkDialog } from './confirm-bulk-dialog';

export type DataTableBulkActionsProps<T> = {
  table: Table<T>;
  entityName?: string;
  actions?: {
    key: string;
    icon: React.ReactNode;
    label: string;
    onClick: (items: T[]) => void | Promise<void>;
    variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link";
    tooltip?: string;
    title?: string;
    disabled?: boolean;
    confirm?: boolean;
    confirmWord?: string;
    confirmDesc?: string;
  }[];
};

export function DataTableBulkActions<T>({
  table,
  entityName = 'item',
  actions = [],
}: DataTableBulkActionsProps<T>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const items = selectedRows.map((r) => r.original as T);
  const [confirming, setConfirming] = useState<null | string>(null);

  if (!table) return null;

  return (
    <BulkActionsToolbar table={table} entityName={entityName}>
      {actions.map((action) => (
        <React.Fragment key={action.key}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={action.variant || 'outline'}
                size='icon'
                onClick={() => {
                  if (action.confirm) {
                    setConfirming(action.key);
                  } else {
                    action.onClick(items);
                  }
                }}
                className='size-8'
                aria-label={action.label}
                title={action.title || action.label}
                disabled={action.disabled}
              >
                {action.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{action.tooltip || action.label}</p>
            </TooltipContent>
          </Tooltip>
          {action.confirm && confirming === action.key && (
            <ConfirmBulkDialog
              open
              onOpenChange={(open) => !open && setConfirming(null)}
              onConfirm={async () => {
                await action.onClick(items);
                setConfirming(null);
              }}
              action={action.label}
              itemName={entityName}
              selectedCount={items.length}
              confirmWord={action.confirmWord || 'CONFIRM'}
              confirmDesc={action.confirmDesc}
            />
          )}
        </React.Fragment>
      ))}
    </BulkActionsToolbar>
  );
}