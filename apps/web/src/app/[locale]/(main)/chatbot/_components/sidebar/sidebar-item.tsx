'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { TrashIcon, PencilIcon, MoreVertical } from 'lucide-react';
import { useLocale } from '@/hooks/ui/useLocale';
import { Button } from '@repo/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@repo/ui/components/dropdown-menu';

interface Conversation {
  id: string;
  title: string;
}

interface SidebarItemProps {
  conv: Conversation;
  isActive: boolean;
  onSelect: () => void;
  onRenameClick: () => void;
  onDeleteClick: (e: React.MouseEvent) => void;
}

export const SidebarItem = ({
  conv,
  isActive,
  onSelect,
  onRenameClick,
  onDeleteClick,
}: SidebarItemProps) => {
  const { t, keys } = useLocale('chatbot');

  return (
    <div
      onClick={onSelect}
      className={cn(
        'group flex cursor-pointer items-center justify-between rounded px-3 py-2 text-sm transition-colors',
        isActive
          ? 'bg-muted text-foreground font-medium'
          : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
      )}
    >
      <div className='mr-2 flex flex-1 items-center overflow-hidden'>
        <span className='truncate text-xs'>{conv.title}</span>
      </div>
      <div
        className='flex shrink-0 items-center opacity-0 transition-opacity group-hover:opacity-100'
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='text-muted-foreground hover:text-foreground h-6 w-6 rounded'
              title={t(keys.sidebar.options)}
            >
              <MoreVertical className='h-3.5 w-3.5' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-28'>
            <DropdownMenuItem onClick={onRenameClick} className='cursor-pointer gap-2 text-xs'>
              <PencilIcon className='h-3.5 w-3.5' />
              {t(keys.sidebar.rename)}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDeleteClick}
              className='text-destructive focus:text-destructive cursor-pointer gap-2 text-xs'
            >
              <TrashIcon className='text-destructive h-3.5 w-3.5' />
              {t(keys.sidebar.delete)}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
