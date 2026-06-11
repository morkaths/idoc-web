'use client';
import { type ReactNode, useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { NextIntlClientProvider, type AbstractIntlMessages } from 'next-intl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReaderProvider } from '@/context/reader-provider';
import { ThemeProvider } from '@/context/theme-provider';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@repo/ui/components/tooltip';
import { AuthSync } from '@/components/auth-sync';

export function Providers({
  children,
  locale,
  messages,
  timeZone,
}: {
  children: ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
  timeZone: string;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
          },
        },
      })
  );
  return (
    <SessionProvider>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
        <AuthSync />
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <TooltipProvider>
              <ReaderProvider>
                {children}
                <Toaster duration={5000} />
              </ReaderProvider>
            </TooltipProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </NextIntlClientProvider>
    </SessionProvider>
  );
}
