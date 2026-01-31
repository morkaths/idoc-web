import { type SVGProps } from 'react';
import { Root as Radio, Item } from '@radix-ui/react-radio-group';
import { CircleCheck, Layout, Palette, RotateCcw, Dices, Sun, Moon } from 'lucide-react';
import { IconDir } from '@/assets/custom/icon-dir';
import { IconLayoutCompact } from '@/assets/custom/icon-layout-compact';
import { IconLayoutDefault } from '@/assets/custom/icon-layout-default';
import { IconLayoutFull } from '@/assets/custom/icon-layout-full';
import { IconSidebarFloating } from '@/assets/custom/icon-sidebar-floating';
import { IconSidebarInset } from '@/assets/custom/icon-sidebar-inset';
import { IconSidebarSidebar } from '@/assets/custom/icon-sidebar-sidebar';
import { themeColors, themeConfig } from '@/components/layout/data/theme-data';
import { useDirection } from '@/context/direction-provider';
import { type Collapsible, useLayout } from '@/context/layout-provider';
import { useTheme } from '@/context/theme-provider';
import { cn } from '@/lib/utils';
import { Button } from '@repo/ui/components/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@repo/ui/components/sheet';
import { useSidebar } from '@repo/ui/components/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/components/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/select';

export function ConfigDrawer() {
  const { setOpen } = useSidebar();
  const { resetDir } = useDirection();
  const { resetTheme, setRadius, setFont } = useTheme();
  const { resetLayout } = useLayout();

  const handleReset = () => {
    setOpen(true);
    resetDir();
    resetTheme();
    setRadius(themeConfig.defaults.radius);
    setFont(themeConfig.defaults.font);
    resetLayout();
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
          <SheetTitle>Theme Settings</SheetTitle>
          <SheetDescription id='config-drawer-description'>
            Customize the specific layout and visualization.
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="theme" className="flex h-full flex-col">
            <div className="px-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="theme">
                  <Palette className="mr-2 h-4 w-4" />
                  Theme
                </TabsTrigger>
                <TabsTrigger value="layout">
                  <Layout className="mr-2 h-4 w-4" />
                  Layout
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <TabsContent value="theme" className="mt-0 space-y-6">
                <ModeConfig />
                <FontConfig />
                <ColorConfig />
                <RadiusConfig />
              </TabsContent>

              <TabsContent value="layout" className="mt-0 space-y-6">
                <SidebarConfig />
                <LayoutConfig />
                <DirConfig />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <SheetFooter className='border-t p-4'>
          <Button
            variant='destructive'
            onClick={handleReset}
            aria-label='Reset all settings to default values'
            className="w-full"
          >
            Reset Preferences
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

function RadioGroupItem({
  item,
  isTheme = false,
}: {
  item: {
    value: string;
    label: string;
    icon: (props: SVGProps<SVGSVGElement>) => React.ReactElement;
  };
  isTheme?: boolean;
}) {
  return (
    <Item
      value={item.value}
      className={cn('group outline-none', 'transition duration-200 ease-in')}
      aria-label={`Select ${item.label.toLowerCase()}`}
      aria-describedby={`${item.value}-description`}
    >
      <div
        className={cn(
          'ring-border relative rounded-[6px] ring-[1px]',
          'group-data-[state=checked]:ring-primary group-data-[state=checked]:shadow-2xl',
          'group-focus-visible:ring-2'
        )}
        role='img'
        aria-hidden='false'
        aria-label={`${item.label} option preview`}
      >
        <CircleCheck
          className={cn(
            'fill-primary size-6 stroke-white',
            'group-data-[state=unchecked]:hidden',
            'absolute top-0 right-0 translate-x-1/2 -translate-y-1/2'
          )}
          aria-hidden='true'
        />
        <item.icon
          className={cn(
            !isTheme &&
              'stroke-primary fill-primary group-data-[state=unchecked]:stroke-muted-foreground group-data-[state=unchecked]:fill-muted-foreground'
          )}
          aria-hidden='true'
        />
      </div>
      <div className='mt-1 text-xs' id={`${item.value}-description`} aria-live='polite'>
        {item.label}
      </div>
    </Item>
  );
}

function ModeConfig() {
  const { mode, setMode } = useTheme();

  return (
    <div>
      <SectionTitle title='Mode' />
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={mode === 'light' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('light')}
          className="w-full justify-center gap-2"
        >
          <Sun className="size-4" />
          Light
        </Button>
        <Button
          variant={mode === 'dark' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('dark')}
          className="w-full justify-center gap-2"
        >
          <Moon className="size-4" />
          Dark
        </Button>
      </div>
    </div>
  );
}

function FontConfig() {
  const { font, setFont, availableFonts } = useTheme();

  return (
    <div>
      <SectionTitle
        title='Font'
        showReset={font !== themeConfig.defaults.font}
        onReset={() => setFont(themeConfig.defaults.font)}
      />
      <Select value={font} onValueChange={setFont}>
        <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a font" />
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

  return (
    <div>
      <SectionTitle
        title='Radius'
        showReset={radius !== themeConfig.defaults.radius}
        onReset={() => setRadius(themeConfig.defaults.radius)}
      />
      <div className="grid grid-cols-5 gap-2">
        {themeConfig.radiuses.map((r) => (
          <Button
            key={r}
            variant={radius === r ? 'default' : 'outline'}
            size="sm"
            className="w-full"
            onClick={() => setRadius(r)}
          >
            {r === '0' ? '0' : parseFloat(r)}
          </Button>
        ))}
      </div>
    </div>
  );
}

function ColorConfig() {
  const { color, setColor, availableColors, resolvedMode } = useTheme();

  const handleRandom = () => {
    const randomIndex = Math.floor(Math.random() * availableColors.length);
    setColor(availableColors[randomIndex]);
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <SectionTitle title='Color' className='mb-0' />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRandom}
          className="h-7 text-xs gap-1.5"
        >
          <Dices className="size-3.5" />
          Random
        </Button>
      </div>
      
      <Select value={color} onValueChange={setColor}>
        <SelectTrigger className="w-full">
           <SelectValue placeholder="Select a color">
             {themeColors[color] && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center -space-x-1.5">
                    {[
                      themeColors[color].styles[resolvedMode].primary,
                      themeColors[color].styles[resolvedMode].secondary,
                      themeColors[color].styles[resolvedMode].accent,
                      themeColors[color].styles[resolvedMode].card,
                    ].map((col, idx) => (
                      <div 
                        key={idx}
                        className="h-3.5 w-3.5 rounded-full ring-1 ring-border shadow-sm z-10" 
                        style={{ backgroundColor: col }} 
                      />
                    ))}
                  </div>
                  <span className="font-medium">{themeColors[color].label}</span>
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
                <div className="flex items-center gap-3">
                  <div className="flex items-center -space-x-1.5">
                    {[
                      colors.primary,
                      colors.secondary,
                      colors.accent,
                      colors.card,
                    ].map((col, idx) => (
                      <div 
                        key={idx}
                        className="h-3.5 w-3.5 rounded-full ring-1 ring-border shadow-sm z-10" 
                        style={{ backgroundColor: col }} 
                      />
                    ))}
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

function SidebarConfig() {
  const { defaultVariant, variant, setVariant } = useLayout();
  return (
    <div className='max-md:hidden'>
      <SectionTitle
        title='Sidebar'
        showReset={defaultVariant !== variant}
        onReset={() => setVariant(defaultVariant)}
      />
      <Radio
        value={variant}
        onValueChange={setVariant}
        className='grid w-full max-w-md grid-cols-3 gap-4'
        aria-label='Select sidebar style'
        aria-describedby='sidebar-description'
      >
        {[
          {
            value: 'inset',
            label: 'Inset',
            icon: IconSidebarInset,
          },
          {
            value: 'floating',
            label: 'Floating',
            icon: IconSidebarFloating,
          },
          {
            value: 'sidebar',
            label: 'Sidebar',
            icon: IconSidebarSidebar,
          },
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
    </div>
  );
}

function LayoutConfig() {
  const { open, setOpen } = useSidebar();
  const { defaultCollapsible, collapsible, setCollapsible } = useLayout();

  const radioState = open ? 'default' : collapsible;

  return (
    <div className='max-md:hidden'>
      <SectionTitle
        title='Layout'
        showReset={radioState !== 'default'}
        onReset={() => {
          setOpen(true);
          setCollapsible(defaultCollapsible);
        }}
      />
      <Radio
        value={radioState}
        onValueChange={(v) => {
          if (v === 'default') {
            setOpen(true);
            return;
          }
          setOpen(false);
          setCollapsible(v as Collapsible);
        }}
        className='grid w-full max-w-md grid-cols-3 gap-4'
        aria-label='Select layout style'
        aria-describedby='layout-description'
      >
        {[
          {
            value: 'default',
            label: 'Default',
            icon: IconLayoutDefault,
          },
          {
            value: 'icon',
            label: 'Compact',
            icon: IconLayoutCompact,
          },
          {
            value: 'offcanvas',
            label: 'Full layout',
            icon: IconLayoutFull,
          },
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
    </div>
  );
}

function DirConfig() {
  const { defaultDir, dir, setDir } = useDirection();
  return (
    <div>
      <SectionTitle
        title='Direction'
        showReset={defaultDir !== dir}
        onReset={() => setDir(defaultDir)}
      />
      <Radio
        value={dir}
        onValueChange={setDir}
        className='grid w-full max-w-md grid-cols-3 gap-4'
        aria-label='Select site direction'
        aria-describedby='direction-description'
      >
        {[
          {
            value: 'ltr',
            label: 'Left to Right',
            icon: (props: SVGProps<SVGSVGElement>) => <IconDir dir='ltr' {...props} />,
          },
          {
            value: 'rtl',
            label: 'Right to Left',
            icon: (props: SVGProps<SVGSVGElement>) => <IconDir dir='rtl' {...props} />,
          },
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
    </div>
  );
}
