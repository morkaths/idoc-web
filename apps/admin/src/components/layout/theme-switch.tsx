import { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/theme-provider';
import { useCircularTransition } from '@/hooks/ui/useCircularTransition';
import { Button } from '@repo/ui/components/button';

export function ThemeSwitch() {
  const { resolvedMode } = useTheme();
  const { toggleTheme } = useCircularTransition();

  /* Update theme-color meta tag
   * when theme is updated */
  useEffect(() => {
    const themeColor = resolvedMode === 'dark' ? '#020817' : '#fff';
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) metaThemeColor.setAttribute('content', themeColor);
  }, [resolvedMode]);

  return (
    <Button variant='ghost' size='icon' className='h-8 w-8 rounded-md border' onClick={toggleTheme}>
      <Sun className='size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
      <Moon className='absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
