import { type FC, type SVGProps, useEffect, useState } from 'react';
import {
  Check,
  Coffee,
  Droplet,
  Flame,
  Flower,
  HatGlasses,
  Leaf,
  Monitor,
  Moon,
  Snowflake,
  Sun,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Theme, useTheme } from '@/context/theme-provider';
import { Button } from '@repo/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';

const THEMES: { id: Theme; label: string; icon?: FC<SVGProps<SVGSVGElement>> }[] = [
  // System
  { id: 'system', label: 'System', icon: Monitor },
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  // Light modes
  { id: 'sakura', label: 'Sakura', icon: Flower },
  { id: 'matcha', label: 'Matcha', icon: Leaf },
  { id: 'latte', label: 'Latte', icon: Coffee },
  { id: 'cyberpunk', label: 'Cyberpunk', icon: Zap },
  // Dark modes
  { id: 'dracula', label: 'Dracula', icon: HatGlasses },
  { id: 'gruvbox', label: 'Gruvbox', icon: Flame },
  { id: 'nordic', label: 'Nordic', icon: Snowflake },
  { id: 'ocean', label: 'Ocean', icon: Droplet },
];

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const themeColor = theme === 'dark' ? '#020817' : '#fff';
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) metaThemeColor.setAttribute('content', themeColor);
  }, [theme]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  
  if (!mounted) return null;
  const CurrentIcon = THEMES.find((t) => t.id === theme)?.icon ?? Sun;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='rounded-md border'>
          <CurrentIcon className='size-[1.2rem] transition-all' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {THEMES.map((t) => (
          <DropdownMenuItem key={t.id} onClick={() => setTheme(t.id)}>
            {t.icon && <t.icon className='me-2 inline-block h-4 w-4' />}
            <span>{t.label}</span>
            <Check size={14} className={cn('ms-auto', theme !== t.id && 'hidden')} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}