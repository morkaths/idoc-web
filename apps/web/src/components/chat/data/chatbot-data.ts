import { SparklesIcon, BookOpenIcon, LibraryIcon, HelpCircleIcon } from 'lucide-react';

export const AI_MODELS = [
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    desc: "Google's fast & responsive model for general tasks",
    provider: 'gemini',
    model: 'gemini-1.5-flash',
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    desc: "Google's advanced model for complex reasoning",
    provider: 'gemini',
    model: 'gemini-1.5-pro',
  },
  {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    desc: 'High-quality reasoning and coding assistant from DeepSeek',
    provider: 'deepseek',
    model: 'deepseek-chat',
  },
  {
    id: 'llama-3.3-70b',
    name: 'Llama 3.3 70B',
    desc: 'State-of-the-art model from Meta via Cloudflare',
    provider: 'cloudflare',
    model: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
  },
  {
    id: 'llama-3.2-3b',
    name: 'Llama 3.2 3B',
    desc: 'Fast & lightweight model from Meta via Cloudflare',
    provider: 'cloudflare',
    model: '@cf/meta/llama-3.2-3b-instruct',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    desc: "OpenAI's cost-efficient and smart model",
    provider: 'openai',
    model: 'gpt-4o-mini',
  },
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
