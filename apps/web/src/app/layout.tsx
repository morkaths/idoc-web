import type { Metadata } from "next";
import "./globals.css";
import "flag-icons/css/flag-icons.min.css";
import { cn } from "@/lib/utils";
import { fontVariables } from "@/config/fonts";
import { getThemeConfig } from "@/lib/theme-server";
import { ThemeScript } from "@/components/layout/theme-script";


export const metadata: Metadata = {
  title: {
    default: "iDoc",
    template: "%s | iDoc",
  },
  description: "Digital Document Library",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { mode, theme, cssVars } = await getThemeConfig();

  return (
    <html
      suppressHydrationWarning
      className={cn(
        fontVariables,
        mode === 'dark' ? 'dark' : ''
      )}
      style={cssVars as React.CSSProperties}
    >
      <head>
        <ThemeScript theme={theme} />
      </head>
      <body className={cn("min-h-screen bg-background antialiased")}>
        {children}
      </body>
    </html>
  );
}
