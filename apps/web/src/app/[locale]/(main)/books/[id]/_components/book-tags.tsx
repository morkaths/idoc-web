'use client';

import * as React from 'react';
import { useLocale } from '@/hooks/ui/useLocale';

type TagItem = string | { id?: string; name: string; count?: number };

interface TagsProps {
  tags?: TagItem[];
  variant?: 'pill' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  clickable?: boolean;
  maxVisible?: number;
  onClick?: (tag: TagItem) => void;
  className?: string;
  showCount?: boolean;
}

export default function BookTags({
  tags = [],
  variant = 'pill',
  size = 'md',
  clickable = false,
  maxVisible = 0,
  onClick,
  className = '',
  showCount = false,
}: TagsProps) {
  const { t } = useLocale('books');
  const [showAll, setShowAll] = React.useState(false);

  const normalized = React.useMemo(() => {
    return tags.map((t) => (typeof t === 'string' ? { name: t } : t));
  }, [tags]);

  const visible = maxVisible && !showAll ? normalized.slice(0, maxVisible) : normalized;

  const sizeClass =
    size === 'sm'
      ? 'text-sm px-2 py-0.5'
      : size === 'lg'
        ? 'text-base px-4 py-1.5'
        : 'text-sm px-3 py-1';

  const variantClass = (v: string) => {
    if (v === 'outline')
      return 'border border-gray-200 dark:border-zinc-700 bg-transparent text-muted-foreground';
    if (v === 'ghost') return 'bg-transparent text-muted-foreground';
    return 'bg-primary/10 text-primary';
  };

  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {visible.map((tag, idx) => (
        <button
          key={tag.id ?? `${tag.name}-${idx}`}
          type={clickable ? 'button' : 'button'}
          onClick={() => clickable && onClick?.(tag)}
          className={`inline-flex items-center gap-2 rounded-full ${sizeClass} ${variantClass(variant)} ${
            clickable ? 'cursor-pointer hover:opacity-90' : 'cursor-default'
          }`}
        >
          <span className='truncate'>{tag.name}</span>
          {showCount && tag.count ? (
            <span className='text-muted-foreground text-xs'>({tag.count})</span>
          ) : null}
        </button>
      ))}

      {maxVisible > 0 && normalized.length > maxVisible ? (
        <button
          type='button'
          onClick={() => setShowAll((s) => !s)}
          className='text-primary ml-1 text-sm font-medium'
        >
          {showAll
            ? t('common.actions.showLess') || 'Show less'
            : t('common.actions.showMore') || `+${normalized.length - maxVisible} more`}
        </button>
      ) : null}
    </div>
  );
}
