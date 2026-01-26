"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/context/theme-provider";
import { Toaster } from "sonner";
import { ReactNode, useMemo } from "react";
import { ReaderProvider } from "@/context/reader-provider";

import { SessionProvider } from "next-auth/react";

import { AuthSync } from "@/components/auth-sync";

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = useMemo(() => new QueryClient(), []);
  return (
    <SessionProvider>
      <AuthSync />
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ReaderProvider>
            {children}
            <Toaster duration={5000} />
          </ReaderProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}