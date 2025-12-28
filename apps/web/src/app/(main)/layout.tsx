"use client";

import { Header } from "@/components/layout/header";
import { SearchProvider } from "@/context/search-provider";
import { LayoutProvider } from "@/context/layout-provider";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SearchProvider>
      <LayoutProvider>
        <Header />
        <div className="block md:hidden h-14" />
        {children}
      </LayoutProvider>
    </SearchProvider>
  );
}