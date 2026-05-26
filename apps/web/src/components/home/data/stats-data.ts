import { BookOpen, Users, PenTool, BookmarkCheck, type LucideIcon } from 'lucide-react';

export interface StatsDataProps {
  books: number;
  users: number;
  authors: number;
  borrows: number;
}

export interface StatItemConfig {
  labelKey: string;
  icon: LucideIcon;
  getValue: (stats: StatsDataProps) => number;
}

/**
 * Static configuration for dashboard statistic items.
 */
export const STATS_ITEMS_CONFIG: StatItemConfig[] = [
  {
    labelKey: 'stats.books',
    icon: BookOpen,
    getValue: (stats) => stats.books,
  },
  {
    labelKey: 'stats.users',
    icon: Users,
    getValue: (stats) => stats.users,
  },
  {
    labelKey: 'stats.authors',
    icon: PenTool,
    getValue: (stats) => stats.authors,
  },
  {
    labelKey: 'stats.borrows',
    icon: BookmarkCheck,
    getValue: (stats) => stats.borrows,
  },
];
