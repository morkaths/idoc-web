"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as AppThemeProvider } from "@/context/theme-provider";
import { ThemeProvider } from "@/context/theme-provider";
import { FontProvider } from "@/context/font-provider";
import { Toaster } from "sonner";
import { ReactNode, useMemo } from "react";

import { SessionProvider } from "next-auth/react";

import { AuthSync } from "@/components/auth-sync";

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = useMemo(() => new QueryClient(), []);
  return (
    <SessionProvider>
      <AuthSync />
      <QueryClientProvider client={queryClient}>
        <AppThemeProvider>
          <FontProvider>
            <ThemeProvider>
              {children}
              <Toaster duration={5000} />
            </ThemeProvider>
          </FontProvider>
        </AppThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}