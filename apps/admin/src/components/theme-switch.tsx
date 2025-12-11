import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/context/theme-provider-v2'
import { Button } from '@repo/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu'
import { Check, Coffee, Droplet, Flame, Flower, HatGlasses, Leaf, Monitor, Moon, Snowflake, Sun, Zap } from 'lucide-react'

const THEMES: { id: string; label: string; Icon?: any }[] = [
  // System
  { id: 'system', label: 'System', Icon: Monitor },
  { id: 'light', label: 'Light', Icon: Sun },
  { id: 'dark', label: 'Dark', Icon: Moon },
  // Light modes
  { id: 'sakura', label: 'Sakura', Icon: Flower },
  { id: 'matcha', label: 'Matcha', Icon: Leaf },
  { id: 'latte', label: 'Latte', Icon: Coffee },
  { id: 'cyberpunk', label: 'Cyberpunk', Icon: Zap },
  // Dark modes
  { id: 'dracula', label: 'Dracula', Icon: HatGlasses },
  { id: 'gruvbox', label: 'Gruvbox', Icon: Flame },
  { id: 'nordic', label: 'Nordic', Icon: Snowflake },
  { id: 'ocean', label: 'Ocean', Icon: Droplet },
]

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const CurrentIcon = THEMES.find((t) => t.id === theme)?.Icon ?? Sun

  /* Update theme-color meta tag
   * when theme is updated */
  useEffect(() => {
    const themeColor = theme === 'dark' ? '#020817' : '#fff'
    const metaThemeColor = document.querySelector("meta[name='theme-color']")
    if (metaThemeColor) metaThemeColor.setAttribute('content', themeColor)
  }, [theme])

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='scale-95 rounded-full'>
          <CurrentIcon className='size-[1.2rem] transition-all' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {THEMES.map((t) => (
          <DropdownMenuItem key={t.id} onClick={() => setTheme(t.id as any)}>
            {t.Icon && <t.Icon className='me-2 h-4 w-4 inline-block' />}
            <span>{t.label}</span>
            <Check
              size={14}
              className={cn('ms-auto', theme !== t.id && 'hidden')}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
