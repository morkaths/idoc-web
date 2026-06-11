'use client';

import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ArrowUp, Paperclip, Mic, X, FileIcon } from 'lucide-react';
import { useLocale } from '@/hooks/ui/useLocale';
import { Button } from '@repo/ui/components/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select';
import { Textarea } from '@repo/ui/components/textarea';
import { AI_MODELS, INPUT_PROMPTS } from './data/chatbot-data';

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  isLoading?: boolean;
  placeholder?: string;
  selectedModelId?: string;
  onModelChange?: (id: string) => void;
  showModelSelector?: boolean;
  showSuggestions?: boolean;
  borderless?: boolean;
}

export interface Attachment {
  name: string;
  type: string;
  size: number;
  url: string;
}

export const ChatInput = ({
  value,
  onChange,
  onSubmit,
  isLoading,
  placeholder = 'Ask AI...',
  selectedModelId,
  onModelChange,
  showModelSelector = true,
  showSuggestions = true,
  borderless = false,
}: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const valueRef = useRef(value);
  const onChangeRef = useRef(onChange);
  const { t, keys } = useLocale('chatbot');

  useEffect(() => {
    valueRef.current = value;
    onChangeRef.current = onChange;
  }, [value, onChange]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (
          window as unknown as {
            SpeechRecognition?: new () => ISpeechRecognition;
            webkitSpeechRecognition?: new () => ISpeechRecognition;
          }
        ).SpeechRecognition ||
        (
          window as unknown as {
            SpeechRecognition?: new () => ISpeechRecognition;
            webkitSpeechRecognition?: new () => ISpeechRecognition;
          }
        ).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'vi-VN';

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        rec.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0]?.[0]?.transcript;
          if (transcript) {
            const currentValue = valueRef.current;
            onChangeRef.current(currentValue ? `${currentValue} ${transcript}` : transcript);
          }
        };

        recognitionRef.current = rec;
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_e) {}
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() || attachments.length > 0) {
        onSubmit(e);
        setAttachments([]);
      }
    }
  };

  const handlePromptClick = (prompt: string) => {
    onChange(prompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: Attachment[] = [];
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      newAttachments.push({
        name: file.name,
        type: file.type,
        size: file.size,
        url: url,
      });
    });

    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => {
      const updated = [...prev];
      const attachment = updated[index];
      if (attachment) {
        URL.revokeObjectURL(attachment.url);
      }
      updated.splice(index, 1);
      return updated;
    });
  };

  const isFormValid = value.trim() !== '' || attachments.length > 0;

  return (
    <div className='flex w-full flex-col gap-3'>
      <form
        onSubmit={(e) => {
          onSubmit(e);
          setAttachments([]);
        }}
        className={cn(
          'bg-card flex min-h-[80px] cursor-text flex-col transition-all duration-200',
          borderless
            ? 'border-0 bg-transparent shadow-none focus-within:border-transparent focus-within:ring-0'
            : 'border-border focus-within:ring-primary focus-within:border-primary rounded-md border focus-within:ring-1'
        )}
      >
        {/* File input (Hidden) */}
        <input
          type='file'
          ref={fileInputRef}
          onChange={handleFileChange}
          className='hidden'
          multiple
        />

        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className='border-border/40 flex flex-wrap gap-2 border-b px-3 pt-3 pb-1'>
            {attachments.map((file, idx) => (
              <div
                key={idx}
                className='group bg-muted/50 animate-in fade-in-0 relative flex max-w-[200px] items-center gap-2 rounded-md border p-2 pr-8 text-xs duration-200'
              >
                {file.type.startsWith('image/') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={file.url} alt={file.name} className='h-8 w-8 rounded-md object-cover' />
                ) : (
                  <FileIcon className='text-primary h-8 w-8 shrink-0' />
                )}
                <div className='overflow-hidden'>
                  <p className='truncate font-medium'>{file.name}</p>
                  <p className='text-muted-foreground text-[10px]'>
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  type='button'
                  onClick={() => removeAttachment(idx)}
                  className='bg-background text-muted-foreground hover:text-foreground hover:bg-muted absolute top-1 right-1 rounded-md border p-0.5 transition-colors'
                >
                  <X className='h-3 w-3' />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className='relative max-h-[200px] flex-1 overflow-y-auto'>
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={placeholder}
            className='text-foreground min-h-[38px] w-full resize-none border-0 bg-transparent px-3 py-2 text-[14px] break-words whitespace-pre-wrap shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
          />
        </div>

        <div className='border-border/20 flex min-h-[36px] items-center gap-2 border-t px-3 py-1.5'>
          {showModelSelector && selectedModelId && onModelChange && (
            <div className='relative flex shrink-0 items-center'>
              <Select value={selectedModelId} onValueChange={onModelChange}>
                <SelectTrigger className='text-muted-foreground hover:text-foreground hover:bg-muted/80 h-7! w-fit gap-1.5 rounded-md border-none bg-transparent px-2 text-xs font-semibold shadow-none transition-colors focus:ring-0 focus-visible:ring-0'>
                  <SelectValue>
                    {AI_MODELS.find((m) => m.id === selectedModelId)?.name || 'Select Model'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {AI_MODELS.map((model) => (
                    <SelectItem key={model.id} value={model.id} className='text-xs'>
                      <div className='flex flex-col text-left'>
                        <span className='font-semibold'>{model.name}</span>
                        <span className='text-muted-foreground mt-0.5 text-[10px] leading-none'>
                          {model.desc}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className='ml-auto flex items-center gap-1.5'>
            {/* Voice Input Button */}
            <Button
              type='button'
              variant={isListening ? 'secondary' : 'ghost'}
              size='icon'
              onClick={toggleListening}
              className={cn(
                'text-muted-foreground hover:text-foreground h-8 w-8 shrink-0 rounded-md',
                isListening && 'animate-pulse bg-red-500/10 text-red-500 hover:text-red-600'
              )}
              title={isListening ? t(keys.recording) : t(keys.voiceInput)}
            >
              <Mic className='h-4 w-4' />
            </Button>

            {/* Attach Button */}
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={() => fileInputRef.current?.click()}
              className='text-muted-foreground hover:text-foreground h-8 w-8 shrink-0 rounded-md'
              title='Attach files'
            >
              <Paperclip className='h-4 w-4' />
            </Button>

            {/* Send Button */}
            <Button
              type='submit'
              size='icon'
              disabled={!isFormValid || isLoading}
              className={cn(
                'bg-muted text-muted-foreground h-8 w-8 shrink-0 cursor-pointer rounded-md transition-colors duration-100 ease-out disabled:opacity-50',
                isFormValid &&
                  !isLoading &&
                  'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
              title='Send message'
              aria-label='Send message'
            >
              <ArrowUp className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </form>

      {/* Suggestion Pills */}
      {showSuggestions && value.trim() === '' && (
        <div className='animate-in fade-in-0 mt-1 flex flex-wrap justify-center gap-2 duration-300'>
          {INPUT_PROMPTS.map((button) => {
            const IconComponent = button.icon;
            const text = t(keys.prompts[button.id].short);
            const prompt = t(keys.prompts[button.id].desc);
            return (
              <Button
                key={button.id}
                type='button'
                variant='ghost'
                className='group border-border/80 text-foreground hover:bg-muted/40 bg-background/50 flex h-auto items-center gap-2 rounded-md border px-3 py-1.5 text-xs transition-all duration-200 ease-out'
                onClick={() => handlePromptClick(prompt)}
              >
                <IconComponent className='text-muted-foreground group-hover:text-foreground h-3.5 w-3.5 transition-colors' />
                <span>{text}</span>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
};
