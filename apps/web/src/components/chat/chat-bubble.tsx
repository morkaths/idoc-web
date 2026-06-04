'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Dot } from 'lucide-react';

interface ChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'sent' | 'received';
  children: React.ReactNode;
}

/**
 * Minimalist ChatBubble container to align message boxes to left/right.
 */
export const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ className, variant = 'received', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'animate-in fade-in-0 slide-in-from-bottom-1 mb-1 flex w-full duration-300',
          variant === 'sent' ? 'justify-end' : 'justify-start',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ChatBubble.displayName = 'ChatBubble';

interface ChatBubbleMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'sent' | 'received';
  isLoading?: boolean;
}

/**
 * Simple client-side Markdown Parser to render basic formats safely.
 */
const renderMarkdown = (text: string) => {
  if (!text) return '';

  // Format code blocks ```code```
  let formatted = text.replace(/```([\s\S]*?)```/g, (_, code) => {
    return `<pre class="bg-muted-foreground/10 text-foreground p-3 rounded-lg overflow-x-auto my-2 border border-border/50 font-mono text-xs leading-relaxed"><code>${escapeHtml(code.trim())}</code></pre>`;
  });

  // Format inline code `code`
  formatted = formatted.replace(
    /`([^`]+)`/g,
    '<code class="bg-muted-foreground/15 text-primary px-1.5 py-0.5 rounded font-mono text-xs">$1</code>'
  );

  // Format bold **text**
  formatted = formatted.replace(
    /\*\*([^*]+)\*\*/g,
    '<strong class="font-semibold text-foreground">$1</strong>'
  );

  // Format italic *text*
  formatted = formatted.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');

  // Format links [text](url)
  formatted = formatted.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline font-medium transition-colors">$1</a>'
  );

  // Format unordered lists (starting with - or *)
  const lines = formatted.split('\n');
  let inList = false;
  const processedLines = lines.map((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const content = trimmed.substring(2);
      let listLine = '';
      if (!inList) {
        inList = true;
        listLine = '<ul class="list-disc pl-5 my-1.5 space-y-1">';
      }
      return `${listLine}<li class="text-sm">${content}</li>`;
    } else {
      if (inList) {
        inList = false;
        return `</ul>${line}`;
      }
      return line;
    }
  });

  if (inList) {
    processedLines.push('</ul>');
  }

  return processedLines.join('\n').replace(/\n/g, '<br />');
};

const escapeHtml = (text: string) => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * TypingIndicator component renders bouncing dots representing loading state.
 * Built with rounded-none to match minimalist requirements.
 */
export function TypingIndicator() {
  return (
    <div className='justify-left flex space-x-1'>
      <div className='bg-muted border-border/60 rounded-none border p-2.5'>
        <div className='flex -space-x-2'>
          <Dot className='animate-typing-dot-bounce h-5 w-5' />
          <Dot className='animate-typing-dot-bounce h-5 w-5 [animation-delay:90ms]' />
          <Dot className='animate-typing-dot-bounce h-5 w-5 [animation-delay:180ms]' />
        </div>
      </div>
    </div>
  );
}

/**
 * Minimalist Message Box containing styled text content.
 */
export const ChatBubbleMessage = React.forwardRef<HTMLDivElement, ChatBubbleMessageProps>(
  ({ className, variant = 'received', children, isLoading, ...props }, ref) => {
    const content = typeof children === 'string' ? renderMarkdown(children) : '';

    if (!isLoading) {
      return <TypingIndicator />;
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative max-w-[85%] rounded-md px-4 py-2.5 text-sm break-words transition-all duration-300 sm:max-w-[75%]',
          variant === 'sent'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted border-primary/15 text-foreground border',
          className
        )}
        {...props}
      >
        {typeof children === 'string' ? (
          <div
            className={cn(
              'space-y-1 leading-relaxed',
              variant === 'sent' ? 'text-primary-foreground' : 'text-foreground'
            )}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          children
        )}
      </div>
    );
  }
);
ChatBubbleMessage.displayName = 'ChatBubbleMessage';
