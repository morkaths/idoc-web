'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowDown } from 'lucide-react';

interface ChatMessageListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * ChatMessageList component wraps the chat history list and automatically
 * scrolls to the bottom when new messages are added, with a button to scroll to bottom.
 */
export const ChatMessageList = React.forwardRef<HTMLDivElement, ChatMessageListProps>(
  ({ className, children, ...props }, ref) => {
    const listRef = React.useRef<HTMLDivElement>(null);
    const [showScrollButton, setShowScrollButton] = React.useState(false);

    React.useImperativeHandle(ref, () => listRef.current as HTMLDivElement);

    React.useEffect(() => {
      if (listRef.current) {
        listRef.current.scrollTo({
          top: listRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, [children]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      const isFarFromBottom = target.scrollHeight - target.scrollTop - target.clientHeight > 200;
      setShowScrollButton(isFarFromBottom);
    };

    const scrollToBottom = () => {
      if (listRef.current) {
        listRef.current.scrollTo({
          top: listRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    };

    return (
      <div className='relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden'>
        <div
          ref={listRef}
          onScroll={handleScroll}
          className={cn(
            'scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent flex h-full w-full flex-1 flex-col gap-4 overflow-y-auto p-4 md:p-6',
            className
          )}
          {...props}
        >
          <div className='flex flex-col gap-4'>{children}</div>
        </div>

        <button
          onClick={scrollToBottom}
          className={cn(
            'text-muted-foreground hover:text-foreground absolute right-4 bottom-4 z-20 flex h-9 w-9 items-center justify-center transition-all duration-200 active:scale-95',
            showScrollButton
              ? 'pointer-events-auto translate-y-0 opacity-100'
              : 'pointer-events-none translate-y-2 opacity-0'
          )}
          aria-label='Scroll to bottom'
        >
          <ArrowDown className='h-4.5 w-4.5' />
        </button>
      </div>
    );
  }
);

ChatMessageList.displayName = 'ChatMessageList';
