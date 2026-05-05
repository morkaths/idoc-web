import { Book, Code, Globe, History, Music, FlaskConical, Palette, Terminal, BookOpen, User, type LucideIcon } from 'lucide-react';

/**
 * Mapping of category names to their respective Lucide icons.
 */
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'Science': FlaskConical,
  'Technology': Code,
  'History': History,
  'Art': Palette,
  'Music': Music,
  'Fiction': Book,
  'Global': Globe,
  'Development': Terminal,
  'Biography': User,
  'Education': BookOpen,
};

/**
 * Default number of items to show in grids and carousels.
 */
export const HOME_LIMITS = {
  CATEGORIES: 8,
  POPULAR_BOOKS: 10,
  RECOMMENDATIONS: 15,
};

/**
 * Statistics and other static data for the home page.
 */
export const HOME_STATS = {
  TOTAL_READERS: '10,000+',
};
