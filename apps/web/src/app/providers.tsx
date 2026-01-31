"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/context/theme-provider";
import { Toaster } from "sonner";
import { ReactNode, useMemo } from "react";
import { ReaderProvider } from "@/context/reader-provider";

import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl';

import { AuthSync } from "@/components/auth-sync";

export function Providers({
  children,
  locale,
  messages
}: {
  children: ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}) {
  const queryClient = useMemo(() => new QueryClient(), []);
  return (
    <SessionProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <AuthSync />
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <ReaderProvider>
              {children}
              <Toaster duration={5000} />
            </ReaderProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </NextIntlClientProvider>
    </SessionProvider>
  );
}