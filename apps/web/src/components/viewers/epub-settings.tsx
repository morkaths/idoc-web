'use client';
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Type, Settings, Minus, Plus, ScrollText, BookOpen } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/components/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select';
import { Separator } from '@repo/ui/components/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@repo/ui/components/sheet';
import { useReaderSettings } from '../../context/reader-provider';
import { EPUB_FONTS, EPUB_THEMES, EPUB_FLOWS, type ThemeOption } from './data/setting-data';

interface EpubSettingsProps {
  themeConfig: ThemeOption;
  portalContainer?: HTMLElement | null;
}

export function EpubSettings({ themeConfig, portalContainer }: EpubSettingsProps) {
  const { settings, setFontSize, setFontFamily, setTheme, setFlow } = useReaderSettings();
  const { fontSize, fontFamily, theme, flow } = settings;
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleIncreaseFontSize = () => {
    if (fontSize < 200) setFontSize(fontSize + 10);
  };

  const handleDecreaseFontSize = () => {
    if (fontSize > 50) setFontSize(fontSize - 10);
  };

  const renderSettingsContent = () => (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <h4 className='text-muted-foreground flex items-center gap-2 leading-none font-medium'>
          <Type className='h-4 w-4' />
          <span>Font Settings</span>
        </h4>
        <div className='flex items-center justify-between gap-2'>
          <Button
            variant='outline'
            size='icon'
            className='h-8 w-8 shrink-0'
            onClick={handleDecreaseFontSize}
            disabled={fontSize <= 50}
          >
            <Minus className='h-4 w-4' />
          </Button>
          <span className='w-12 text-center text-sm font-medium'>{fontSize}%</span>
          <Button
            variant='outline'
            size='icon'
            className='h-8 w-8 shrink-0'
            onClick={handleIncreaseFontSize}
            disabled={fontSize >= 200}
          >
            <Plus className='h-4 w-4' />
          </Button>
        </div>

        <Select
          value={fontFamily}
          onValueChange={(val) => {
            setFontFamily(val);
            setIsOpen(false);
          }}
        >
          <SelectTrigger className='h-8 w-full'>
            <SelectValue placeholder='Select Font' />
          </SelectTrigger>
          <SelectContent container={portalContainer}>
            {EPUB_FONTS.map((font) => (
              <SelectItem key={font.value} value={font.value}>
                <span style={{ fontFamily: font.value === 'Origin' ? 'inherit' : font.value }}>
                  {font.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className='space-y-2'>
        <h4 className='text-muted-foreground flex items-center gap-2 leading-none font-medium'>
          Theme
        </h4>
        <div className='grid grid-cols-3 gap-2'>
          {EPUB_THEMES.map((t) => (
            <button
              key={t.value}
              className={cn(
                'flex h-12 w-full flex-col items-center justify-center rounded-md border-2 transition-all hover:scale-[1.02] active:scale-[0.98]',
                theme === t.value
                  ? 'border-primary shadow-sm'
                  : 'border-transparent opacity-80 hover:opacity-100'
              )}
              onClick={() => {
                setTheme(t.value);
                setIsOpen(false);
              }}
              style={{
                backgroundColor: t.bg,
                borderColor: theme === t.value ? undefined : t.uiBorder,
              }}
            >
              <span
                className='text-[10px] font-bold tracking-tight uppercase'
                style={{ color: t.fg }}
              >
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div className='space-y-2'>
        <h4 className='text-muted-foreground flex items-center gap-2 leading-none font-medium'>
          Layout
        </h4>
        <div className='grid grid-cols-2 gap-2'>
          {EPUB_FLOWS.map((f) => (
            <Button
              key={f.value}
              variant={flow === f.value ? 'default' : 'outline'}
              className='w-full justify-start gap-2'
              onClick={() => {
                setFlow(f.value);
                setIsOpen(false);
              }}
            >
              {f.value === 'paginated' ? (
                <BookOpen className='h-4 w-4' />
              ) : (
                <ScrollText className='h-4 w-4' />
              )}
              <span>{f.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const SettingsTrigger = (
    <Button
      variant='ghost'
      size='icon'
      className='bg-background/50 h-9 w-9 rounded-md border backdrop-blur-sm transition-all'
      style={{
        color: themeConfig.uiFg,
        borderColor: themeConfig.uiBorder,
      }}
    >
      <Settings className='h-5 w-5' />
      <span className='sr-only'>Settings</span>
    </Button>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>{SettingsTrigger}</SheetTrigger>
        <SheetContent
          side='bottom'
          className='rounded-t-xl px-6 pt-6 pb-10'
          container={portalContainer}
        >
          <SheetHeader className='mb-4 text-left'>
            <SheetTitle>Reader Settings</SheetTitle>
            <SheetDescription>Customize your reading experience.</SheetDescription>
          </SheetHeader>
          {renderSettingsContent()}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{SettingsTrigger}</PopoverTrigger>
      <PopoverContent className='w-80 p-4' align='end' container={portalContainer}>
        {renderSettingsContent()}
      </PopoverContent>
    </Popover>
  );
}
