import { useTheme } from '@/context/theme-provider';
import { cn } from '@/lib/utils';
import { Palette, RotateCcw, Dices, Sun, Moon, Ban } from 'lucide-react';
import { useLocale } from '@/hooks/ui/useLocale';
import { Button } from '@repo/ui/components/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@repo/ui/components/sheet';
import { themeColors, themeConfig, radiusLabelMap } from '@/components/layout/data/theme-data';

export function ConfigDrawer() {
  const { resetTheme, setRadius, setFont } = useTheme();
  const { t, keys } = useLocale('theme');

  const handleReset = () => {
    resetTheme();
    setRadius(themeConfig.defaults.radius);
    setFont(themeConfig.defaults.font);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size='icon'
          variant='ghost'
          aria-label='Open theme settings'
          aria-describedby='config-drawer-description'
          className='rounded-md border'
        >
          <Palette aria-hidden='true' />
        </Button>
      </SheetTrigger>
      <SheetContent className='flex w-[400px] flex-col gap-0 p-0 sm:w-[540px]'>
        <SheetHeader className='p-4 pb-2 text-start'>
          <SheetTitle>{t(keys.title)}</SheetTitle>
          <SheetDescription id='config-drawer-description'>{t(keys.description)}</SheetDescription>
        </SheetHeader>

        <div className='flex-1 space-y-6 overflow-y-auto p-4'>
          <ModeConfig />
          <FontConfig />
          <ColorConfig />
          <RadiusConfig />
        </div>

        <SheetFooter className='border-t p-4'>
          <Button
            variant='destructive'
            onClick={handleReset}
            aria-label='Reset all settings to default values'
            className='w-full'
          >
            {t(keys.reset)}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function SectionTitle({
  title,
  showReset = false,
  onReset,
  className,
}: {
  title: string;
  showReset?: boolean;
  onReset?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'text-muted-foreground mb-2 flex items-center gap-2 text-sm font-semibold',
        className
      )}
    >
      {title}
      {showReset && onReset && (
        <Button size='icon' variant='secondary' className='size-4 rounded-full' onClick={onReset}>
          <RotateCcw className='size-3' />
        </Button>
      )}
    </div>
  );
}

function ModeConfig() {
  const { mode, setMode } = useTheme();
  const { t, keys } = useLocale('theme');

  return (
    <div>
      <SectionTitle title={t(keys.mode.title)} />
      <div className='grid grid-cols-2 gap-2'>
        <Button
          variant={mode === 'light' ? 'default' : 'outline'}
          size='sm'
          onClick={() => setMode('light')}
          className='w-full justify-center gap-2'
        >
          <Sun className='size-4' />
          {t(keys.mode.light)}
        </Button>
        <Button
          variant={mode === 'dark' ? 'default' : 'outline'}
          size='sm'
          onClick={() => setMode('dark')}
          className='w-full justify-center gap-2'
        >
          <Moon className='size-4' />
          {t(keys.mode.dark)}
        </Button>
      </div>
    </div>
  );
}

function FontConfig() {
  const { font, setFont } = useTheme();
  const { availableFonts } = themeConfig;
  const { t, keys } = useLocale('theme');

  return (
    <div>
      <SectionTitle
        title={t(keys.font.title)}
        showReset={font !== themeConfig.defaults.font}
        onReset={() => setFont(themeConfig.defaults.font)}
      />
      <Select value={font} onValueChange={setFont}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder={t(keys.font.placeholder)} />
        </SelectTrigger>
        <SelectContent>
          {availableFonts.map((f) => (
            <SelectItem key={f.value} value={f.value}>
              <span style={{ fontFamily: f.value }}>{f.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function RadiusConfig() {
  const { radius, setRadius } = useTheme();
  const { t, keys } = useLocale('theme');

  return (
    <div>
      <SectionTitle
        title={t(keys.radius.title)}
        showReset={radius !== themeConfig.defaults.radius}
        onReset={() => setRadius(themeConfig.defaults.radius)}
      />
      <div className='grid grid-cols-5 gap-2'>
        {themeConfig.radiuses.map((r) => {
          const label = radiusLabelMap[r] ?? (r === '0' ? '0' : parseFloat(r).toString());

          return (
            <Button
              key={r}
              variant={radius === r ? 'default' : 'outline'}
              size='sm'
              className='w-full'
              onClick={() => setRadius(r)}
            >
              {label === 'none' ? <Ban className='size-4' /> : label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

function ColorConfig() {
  const { color, setColor, availableColors, resolvedMode } = useTheme();
  const { t, keys } = useLocale('theme');

  const handleRandom = () => {
    const randomIndex = Math.floor(Math.random() * availableColors.length);
    const randomColor = availableColors[randomIndex];
    if (randomColor) {
      setColor(randomColor);
    }
  };

  return (
    <div>
      <div className='mb-2 flex items-center justify-between'>
        <SectionTitle title={t(keys.color.title)} className='mb-0' />
        <Button variant='outline' size='sm' onClick={handleRandom} className='h-7 gap-1.5 text-xs'>
          <Dices className='size-3.5' />
          {t(keys.color.random)}
        </Button>
      </div>

      <Select value={color} onValueChange={setColor}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder={t(keys.color.placeholder)}>
            {themeColors[color] && (
              <div className='flex items-center gap-3'>
                <div className='flex items-center -space-x-1.5'>
                  {[
                    themeColors[color].styles[resolvedMode].primary,
                    themeColors[color].styles[resolvedMode].secondary,
                    themeColors[color].styles[resolvedMode].accent,
                    themeColors[color].styles[resolvedMode].card,
                  ].map((col, idx) => (
                    <div
                      key={idx}
                      className='ring-border z-10 h-3.5 w-3.5 rounded-full shadow-sm ring-1'
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
                <span className='font-medium'>{themeColors[color].label}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {availableColors.map((key) => {
            const config = themeColors[key];
            if (!config) return null;
            const colors = config.styles[resolvedMode];

            return (
              <SelectItem key={key} value={key}>
                <div className='flex items-center gap-3'>
                  <div className='flex items-center -space-x-1.5'>
                    {[colors.primary, colors.secondary, colors.accent, colors.card].map(
                      (col, idx) => (
                        <div
                          key={idx}
                          className='ring-border z-10 h-3.5 w-3.5 rounded-full shadow-sm ring-1'
                          style={{ backgroundColor: col }}
                        />
                      )
                    )}
                  </div>
                  <span>{config.label}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
