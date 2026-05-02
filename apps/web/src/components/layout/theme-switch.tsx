import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/theme-provider';
import { useCircularTransition } from '@/hooks/ui/useCircularTransition';
import { Button } from '@repo/ui/components/button';

export function ThemeSwitch() {
  const { resolvedMode } = useTheme();
  const { toggleTheme } = useCircularTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const themeColor = resolvedMode === 'dark' ? '#020817' : '#fff';
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) metaThemeColor.setAttribute('content', themeColor);
  }, [resolvedMode]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  
  if (!mounted) return null;

  return (
    <Button
      variant='ghost'
      size='icon'
      className='rounded-md border'
      onClick={toggleTheme}
    >
      <Sun className='size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
      <Moon className='absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
    </Button>
  );
}