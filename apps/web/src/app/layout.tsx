import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import { Devtools } from "./dev-tools";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href="/images/favicon.svg"
          type="image/svg+xml"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          href="/images/favicon_light.svg"
          type="image/svg+xml"
          media="(prefers-color-scheme: dark)"
        />
        <link rel="icon" href="/images/favicon_light.svg" type="image/svg+xml" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = document.cookie.match(/vite-ui-theme=([^;]+)/)?.[1];
                var mode = theme || 'light';
                document.documentElement.setAttribute('data-color-theme', mode);
                if (mode === 'dark') document.documentElement.classList.add('dark');
                else document.documentElement.classList.remove('dark');
              } catch {}
            `,
          }}
        />
      </head>
      <body className={cn(
        "min-h-screen bg-background antialiased",
        inter.className,
        geistSans.variable,
        geistMono.variable
      )}>
        <Providers>
          {children}
          <Devtools />
        </Providers>
      </body>
    </html>
  );
}