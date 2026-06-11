'use client';

import React, { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  Ban,
  ChevronRight,
  Code2,
  Loader2,
  Terminal,
  Copy,
  Check,
  RotateCw,
  Pencil,
} from 'lucide-react';
import { useLocale } from '@/hooks/ui/useLocale';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@repo/ui/components/collapsible';
import { FilePreview } from './file-preview';
import { MarkdownRenderer } from './markdown-renderer';
import { BookGridItems } from '@/components/book/book-grid-items';
import { type BookResponse } from '@/types';

const chatBubbleVariants = cva(
  'group/message relative break-words rounded-md p-3 text-sm sm:max-w-[70%] border transition-all duration-200',
  {
    variants: {
      isUser: {
        true: 'bg-primary text-primary-foreground border-transparent',
        false: 'bg-muted text-foreground border-primary/15 hover:border-primary/30',
      },
      animation: {
        none: '',
        slide: 'duration-300 animate-in fade-in-0',
        scale: 'duration-300 animate-in fade-in-0 zoom-in-75',
        fade: 'duration-500 animate-in fade-in-0',
      },
    },
    compoundVariants: [
      {
        isUser: true,
        animation: 'slide',
        class: 'slide-in-from-right',
      },
      {
        isUser: false,
        animation: 'slide',
        class: 'slide-in-from-left',
      },
      {
        isUser: true,
        animation: 'scale',
        class: 'origin-bottom-right',
      },
      {
        isUser: false,
        animation: 'scale',
        class: 'origin-bottom-left',
      },
    ],
  }
);

type Animation = VariantProps<typeof chatBubbleVariants>['animation'];

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const { t, keys } = useLocale('chatbot');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_err) {}
  };

  return (
    <div className='relative flex items-center justify-center'>
      <button
        onClick={handleCopy}
        className='text-muted-foreground hover:text-foreground hover:bg-muted/50 shrink-0 cursor-pointer rounded bg-transparent p-1 transition-all duration-200'
        title='Copy to clipboard'
      >
        {copied ? <Check className='h-3 w-3' /> : <Copy className='h-3 w-3' />}
      </button>
      {copied && (
        <span className='text-muted-foreground bg-popover text-popover-foreground border-border/80 animate-in fade-in-0 zoom-in-95 pointer-events-none absolute -top-8 left-1/2 z-50 -translate-x-1/2 rounded border px-1.5 py-0.5 text-[10px] whitespace-nowrap shadow-sm duration-200 select-none'>
          {t(keys.copied)}
        </span>
      )}
    </div>
  );
};

interface Attachment {
  name?: string;
  contentType?: string;
  url: string;
}

interface PartialToolCall {
  state: 'partial-call';
  toolName: string;
}

interface ToolCall {
  state: 'call';
  toolName: string;
}

interface ToolResult {
  state: 'result';
  toolName: string;
  result: {
    __cancelled?: boolean;
    [key: string]: unknown;
  };
}

type ToolInvocation = PartialToolCall | ToolCall | ToolResult;

interface ReasoningPart {
  type: 'reasoning';
  reasoning: string;
}

interface ToolInvocationPart {
  type: 'tool-invocation';
  toolInvocation: ToolInvocation;
}

interface TextPart {
  type: 'text';
  text: string;
}

interface SourcePart {
  type: 'source';
  source?: unknown;
}

interface FilePart {
  type: 'file';
  mimeType: string;
  data: string;
}

interface StepStartPart {
  type: 'step-start';
}

type MessagePart =
  | TextPart
  | ReasoningPart
  | ToolInvocationPart
  | SourcePart
  | FilePart
  | StepStartPart;

export interface Message {
  id: string;
  role: 'user' | 'assistant' | (string & {});
  content: string;
  createdAt?: Date;
  experimental_attachments?: Attachment[];
  toolInvocations?: ToolInvocation[];
  parts?: MessagePart[];
  books?: BookResponse[];
}

export interface ChatMessageProps extends Message {
  showTimeStamp?: boolean;
  animation?: Animation;
  actions?: React.ReactNode;
  onRetry?: () => void;
  onEdit?: () => void;
  isLoading?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  role,
  content,
  createdAt,
  showTimeStamp = false,
  animation = 'scale',
  experimental_attachments,
  toolInvocations,
  parts,
  onRetry,
  onEdit,
  isLoading = false,
  books,
}) => {
  const files = useMemo(() => {
    return experimental_attachments?.map((attachment) => {
      const dataArray = dataUrlToUint8Array(attachment.url);
      const file = new File([dataArray], attachment.name ?? 'Unknown', {
        type: attachment.contentType,
      });
      return file;
    });
  }, [experimental_attachments]);

  const isUser = role === 'user';

  const { t, keys } = useLocale('chatbot');

  const formattedTime = createdAt?.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isUser) {
    return (
      <div
        className={cn(
          'group/message-container flex flex-col',
          isUser ? 'items-end' : 'items-start'
        )}
      >
        {files ? (
          <div className='mb-1 flex flex-wrap gap-2'>
            {files.map((file, index) => {
              return <FilePreview file={file} key={index} />;
            })}
          </div>
        ) : null}

        <div className={cn(chatBubbleVariants({ isUser, animation }))}>
          <MarkdownRenderer>{content}</MarkdownRenderer>
        </div>

        <div className='mt-1 flex items-center gap-1.5 opacity-0 transition-opacity duration-200 group-hover/message-container:opacity-100'>
          <CopyButton text={content} />
          {onEdit && (
            <button
              onClick={onEdit}
              className='text-muted-foreground hover:text-foreground hover:bg-muted/50 shrink-0 cursor-pointer rounded bg-transparent p-1 transition-all duration-200'
              title={t(keys.edit)}
            >
              <Pencil className='h-3 w-3' />
            </button>
          )}
        </div>

        {showTimeStamp && createdAt ? (
          <time
            dateTime={createdAt.toISOString()}
            className={cn(
              'mt-1 block px-1 text-xs opacity-50',
              animation !== 'none' && 'animate-in fade-in-0 duration-500'
            )}
          >
            {formattedTime}
          </time>
        ) : null}
      </div>
    );
  }

  if (parts && parts.length > 0) {
    return (
      <>
        {parts.map((part, index) => {
          if (part.type === 'text') {
            return (
              <div
                className={cn(
                  'group/message-container flex flex-col',
                  isUser ? 'items-end' : 'items-start'
                )}
                key={`text-${index}`}
              >
                <div className={cn(chatBubbleVariants({ isUser, animation }))}>
                  {isLoading && !part.text ? (
                    <div className='flex items-center gap-2 py-0.5 pr-2'>
                      <Loader2 className='text-primary h-3.5 w-3.5 animate-spin' />
                      <span className='text-muted-foreground text-xs'>{t(keys.thinking)}</span>
                    </div>
                  ) : (
                    <MarkdownRenderer>{part.text}</MarkdownRenderer>
                  )}
                </div>

                {isLoading ? (
                  <div className='text-muted-foreground/80 mt-1 flex items-center gap-1.5 px-1 text-[10px]'>
                    <Loader2 className='text-primary/70 h-3 w-3 animate-spin' />
                    <span>{t(keys.typing)}</span>
                  </div>
                ) : (
                  <div className='mt-1 flex items-center gap-1.5 opacity-0 transition-opacity duration-200 group-hover/message-container:opacity-100'>
                    <CopyButton text={part.text} />
                    {onRetry && (
                      <button
                        onClick={onRetry}
                        className='text-muted-foreground hover:text-foreground hover:bg-muted/50 shrink-0 cursor-pointer rounded bg-transparent p-1 transition-all duration-200'
                        title={t(keys.retry)}
                      >
                        <RotateCw className='h-3 w-3' />
                      </button>
                    )}
                  </div>
                )}

                {showTimeStamp && createdAt ? (
                  <time
                    dateTime={createdAt.toISOString()}
                    className={cn(
                      'mt-1 block px-1 text-xs opacity-50',
                      animation !== 'none' && 'animate-in fade-in-0 duration-500'
                    )}
                  >
                    {formattedTime}
                  </time>
                ) : null}
              </div>
            );
          } else if (part.type === 'reasoning') {
            return <ReasoningBlock key={`reasoning-${index}`} part={part} />;
          } else if (part.type === 'tool-invocation') {
            return <ToolCallBlock key={`tool-${index}`} toolInvocations={[part.toolInvocation]} />;
          }
          return null;
        })}
      </>
    );
  }

  if (toolInvocations && toolInvocations.length > 0) {
    return <ToolCallBlock toolInvocations={toolInvocations} />;
  }

  return (
    <div
      className={cn('group/message-container flex flex-col', isUser ? 'items-end' : 'items-start')}
    >
      <div className={cn(chatBubbleVariants({ isUser, animation }))}>
        {isLoading && !content ? (
          <div className='flex items-center gap-2 py-0.5 pr-2'>
            <Loader2 className='text-primary h-3.5 w-3.5 animate-spin' />
            <span className='text-muted-foreground text-xs'>{t(keys.thinking)}</span>
          </div>
        ) : (
          <>
            <MarkdownRenderer>{content}</MarkdownRenderer>
            {books && books.length > 0 && (
              <div className='border-border/60 mt-4 border-t pt-3 flex flex-col gap-2 w-full'>
                <span className='text-muted-foreground text-xs font-semibold mb-2'>Sách liên quan:</span>
                <BookGridItems data={books} />
              </div>
            )}
          </>
        )}
      </div>

      {isLoading ? (
        <div className='text-muted-foreground/80 mt-1 flex items-center gap-1.5 px-1 text-[10px]'>
          <Loader2 className='text-primary/70 h-3 w-3 animate-spin' />
          <span>{t(keys.typing)}</span>
        </div>
      ) : (
        <div className='mt-1 flex items-center gap-1.5 opacity-0 transition-opacity duration-200 group-hover/message-container:opacity-100'>
          <CopyButton text={content} />
          {onRetry && (
            <button
              onClick={onRetry}
              className='text-muted-foreground hover:text-foreground hover:bg-muted/50 shrink-0 cursor-pointer rounded-md bg-transparent p-1 transition-all duration-200'
              title={t(keys.retry)}
            >
              <RotateCw className='h-3 w-3' />
            </button>
          )}
        </div>
      )}

      {showTimeStamp && createdAt ? (
        <time
          dateTime={createdAt.toISOString()}
          className={cn(
            'mt-1 block px-1 text-xs opacity-50',
            animation !== 'none' && 'animate-in fade-in-0 duration-500'
          )}
        >
          {formattedTime}
        </time>
      ) : null}
    </div>
  );
};

function dataUrlToUint8Array(data: string) {
  const base64 = data.split(',')[1];
  const buf = Buffer.from(base64 || '', 'base64');
  return new Uint8Array(buf);
}

const ReasoningBlock = ({ part }: { part: ReasoningPart }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='mb-2 flex w-full flex-col items-start sm:max-w-[70%]'>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className='group bg-muted/50 w-full overflow-hidden rounded-md border'
      >
        <div className='flex items-center p-2'>
          <CollapsibleTrigger asChild>
            <button className='text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm'>
              <ChevronRight className='h-4 w-4 transition-transform group-data-[state=open]:rotate-90' />
              <span>Thinking</span>
            </button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className='border-t p-2'>
            <div className='text-muted-foreground text-xs leading-relaxed whitespace-pre-wrap'>
              {part.reasoning}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

function ToolCallBlock({ toolInvocations }: Pick<ChatMessageProps, 'toolInvocations'>) {
  if (!toolInvocations?.length) return null;

  return (
    <div className='flex flex-col items-start gap-2'>
      {toolInvocations.map((invocation, index) => {
        const isCancelled = invocation.state === 'result' && invocation.result.__cancelled === true;

        if (isCancelled) {
          return (
            <div
              key={index}
              className='bg-muted/50 text-muted-foreground flex items-center gap-2 rounded-md border px-3 py-2 text-sm'
            >
              <Ban className='h-4 w-4' />
              <span>
                Cancelled{' '}
                <span className='font-mono'>
                  {`\``}
                  {invocation.toolName}
                  {`\``}
                </span>
              </span>
            </div>
          );
        }

        switch (invocation.state) {
          case 'partial-call':
          case 'call':
            return (
              <div
                key={index}
                className='bg-muted/50 text-muted-foreground flex items-center gap-2 rounded-md border px-3 py-2 text-sm'
              >
                <Terminal className='h-4 w-4' />
                <span>
                  Calling{' '}
                  <span className='font-mono'>
                    {`\``}
                    {invocation.toolName}
                    {`\``}
                  </span>
                  ...
                </span>
                <Loader2 className='h-3 w-3 animate-spin' />
              </div>
            );
          case 'result':
            return (
              <div
                key={index}
                className='bg-muted/50 flex flex-col gap-1.5 rounded-none border px-3 py-2 text-sm'
              >
                <div className='text-muted-foreground flex items-center gap-2'>
                  <Code2 className='h-4 w-4' />
                  <span>
                    Result from{' '}
                    <span className='font-mono'>
                      {`\``}
                      {invocation.toolName}
                      {`\``}
                    </span>
                  </span>
                </div>
                <pre className='text-foreground overflow-x-auto whitespace-pre-wrap'>
                  {JSON.stringify(invocation.result, null, 2)}
                </pre>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
