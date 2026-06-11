import { fontVariables } from '@/config/fonts';
import { getThemeConfig } from '@/lib/theme-server';
import { cn } from '@/lib/utils';
import 'flag-icons/css/flag-icons.min.css';
import type { Metadata } from 'next';
import { ThemeScript } from '@/components/layout/theme-script';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'iDoc',
    template: '%s | iDoc',
  },
  description: 'Digital Document Library',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { mode, theme, cssVars } = await getThemeConfig();

  return (
    <html
      suppressHydrationWarning
      className={cn(fontVariables, mode === 'dark' ? 'dark' : '')}
      style={cssVars as React.CSSProperties}
    >
      <head>
        <ThemeScript theme={theme} />
      </head>
      <body className={cn('bg-background min-h-screen antialiased')}>{children}</body>
    </html>
  );
}
