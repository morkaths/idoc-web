"use client";
import { SearchProvider } from "@/context/search-provider";
import { LayoutProvider } from "@/context/layout-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SearchProvider>
      <LayoutProvider>
        <Header />
        <div className="block md:hidden" />
        {children}
        <Footer />
      </LayoutProvider>
    </SearchProvider>
  );
}