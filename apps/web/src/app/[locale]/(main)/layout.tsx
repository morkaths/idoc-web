'use client';

import React, { useState } from 'react';
import { LayoutProvider } from '@/context/layout-provider';
import { SearchProvider } from '@/context/search-provider';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { FloatingChatButton, FloatingChatWindow } from '@/components/chat';
import { useLocale } from '@/hooks/ui/useLocale';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { t, keys } = useLocale('chatbot');

  return (
    <SearchProvider>
      <LayoutProvider>
        <Header />
        <div className='block md:hidden' />
        {children}
        
        {/* Floating Chat Container */}
        <div className='fixed right-6 bottom-6 z-50 flex flex-col items-end'>
          <FloatingChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          <FloatingChatButton
            isOpen={isChatOpen}
            onClick={() => setIsChatOpen(!isChatOpen)}
            title={t(keys.widget.title)}
          />
        </div>

        <Footer />
      </LayoutProvider>
    </SearchProvider>
  );
}
