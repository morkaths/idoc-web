import { SparklesIcon, BookOpenIcon, LibraryIcon, HelpCircleIcon } from 'lucide-react';

export const AI_MODELS = [
  { id: 'gemini-flash', name: 'Gemini 2.5 Flash', desc: 'Fast & responsive for general tasks' },
  { id: 'gemini-pro', name: 'Gemini 2.5 Pro', desc: 'Complex reasoning & writing' },
  { id: 'idoc-bot', name: 'iDoc Assistant', desc: 'Specialized in library & catalog lookup' },
] as const;

export type AIModel = (typeof AI_MODELS)[number];

export const PROMPT_SUGGESTIONS = [
  {
    id: 'discover',
    icon: SparklesIcon,
  },
  {
    id: 'borrow',
    icon: BookOpenIcon,
  },
  {
    id: 'author',
    icon: LibraryIcon,
  },
  {
    id: 'selfhelp',
    icon: HelpCircleIcon,
  },
] as const;

export const WIDGET_SUGGESTIONS = [
  {
    id: 'discover',
    icon: SparklesIcon,
  },
  {
    id: 'borrow',
    icon: BookOpenIcon,
  },
] as const;

export const INPUT_PROMPTS = [
  {
    id: 'discover',
    icon: SparklesIcon,
  },
  {
    id: 'borrow',
    icon: BookOpenIcon,
  },
  {
    id: 'author',
    icon: LibraryIcon,
  },
] as const;

export const ORB_THEME_COLORS = {
  dark: {
    bg: '#09090b',
    c1: 'oklch(75% 0.15 350)', // Original pink
    c2: 'oklch(80% 0.12 200)', // Original teal
    c3: 'oklch(78% 0.14 280)', // Original purple
  },
  light: {
    bg: '#ffffff',
    c1: 'oklch(62% 0.18 300)', // Elegant violet
    c2: 'oklch(64% 0.17 210)', // Elegant sky blue
    c3: 'oklch(66% 0.15 165)', // Elegant mint/teal
  },
} as const;
