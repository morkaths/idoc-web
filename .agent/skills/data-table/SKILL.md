---
name: Data Table Pattern
description: How to create TanStack Table column definitions and integrate with the shared DataTable component
---

# Data Table Pattern

This skill covers creating TanStack Table column definitions and integrating them with the shared `DataTable` component in `apps/admin/src/components/data-table/`.

## Shared Components

The project provides these reusable data-table components in `src/components/data-table/`:

| Component | Purpose |
|---|---|
| `DataTableColumnHeader` | Sortable column header with sort indicators |
| `DataTableToolbar` | Search + filter toolbar |
| `DataTablePagination` | Pagination controls |
| `DataTableFacetedFilter` | Multi-select filter dropdown |
| `DataTableViewOptions` | Column visibility toggle |
| `DataTableBulkActions` | Toolbar for bulk operations on selected rows |

## Column Definition Template

```typescript
import { type ColumnDef } from '@tanstack/react-table';
import type { Entity } from '@/types';
import { Badge } from '@repo/ui/components/badge';
import { Checkbox } from '@repo/ui/components/checkbox';
import { DataTableColumnHeader } from '@/components/data-table';
import Highlight from '@/components/highlight';
import { EntityTableRowActions } from './entity-table-row-actions';

export const entityColumns: ColumnDef<Entity>[] = [
  // ─── CHECKBOX COLUMN ────────────────────────────────────────────────────────
  {
    id: 'select',
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-0.5'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-0.5'
      />
    ),
  },

  // ─── TEXT COLUMN WITH SEARCH HIGHLIGHT ──────────────────────────────────────
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
    cell: ({ row, table }) => {
      const name = row.getValue('name') as string;
      const query = String(table.getState().globalFilter ?? '');
      return (
        <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-124'>
          <Highlight text={name} query={query} />
        </span>
      );
    },
  },

  // ─── BADGE COLUMN (for arrays / enums) ──────────────────────────────────────
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return <Badge variant='outline'>{status}</Badge>;
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },

  // ─── DATE COLUMN ───────────────────────────────────────────────────────────
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Created' />,
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt') as string);
      return <span>{date.toLocaleDateString()}</span>;
    },
  },

  // ─── ACTIONS COLUMN ────────────────────────────────────────────────────────
  {
    id: 'actions',
    cell: ({ row }) => <EntityTableRowActions row={row} />,
  },
];
```

## Table Component Template

```typescript
'use client';

import { useEntities } from '@/hooks/data/useEntity';
import { DataTable } from '@/components/data-table';
import { entityColumns } from './entity-columns';
import { useTableUrlState } from '@/hooks/ui/useTableUrlState';

export function EntityTable() {
  const { pagination, sorting, filters, search, setPagination, setSorting, setFilters, setSearch } =
    useTableUrlState();

  const { data, isLoading } = useEntities({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    query: search,
    sorts: sorting,
    filters,
  });

  return (
    <DataTable
      columns={entityColumns}
      data={data.data}
      pagination={data.pagination}
      isLoading={isLoading}
      // ...pass table state handlers
    />
  );
}
```

## Key Conventions

### Column Types
- **`accessorKey`**: Maps to a field in the data object
- **`id`**: For computed columns (select, actions) that don't map to data fields
- **`enableSorting: false`**: Disable sorting for checkbox, image, and action columns
- **`enableHiding: false`**: Prevent user from hiding essential columns (select, primary identifier)

### Cell Patterns
1. **Text with highlight**: Use `<Highlight text={value} query={globalFilter} />` for searchable columns
2. **Truncation**: Always add `max-w-*` and `truncate` classes for text columns
3. **Image with fallback**: Create a separate cell component with `useState` for error handling
4. **Number formatting**: Use `toLocaleString()` for prices and quantities
5. **Array of badges**: Slice to show max 2–3, add `+N` badge for overflow

### Column Meta
Use `meta` for custom styling:
```typescript
{
  accessorKey: 'price',
  meta: { className: 'ps-1', tdClassName: 'ps-4' },
}
```

### URL State Sync
Use `useTableUrlState` hook to sync pagination, sorting, and filters with URL search params for shareable table states.
