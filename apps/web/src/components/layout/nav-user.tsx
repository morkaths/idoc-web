import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useLocale as useNextLocale } from 'next-intl';
import type { UserResponse } from '@/types';
import {
  LogInIcon,
  UserPlus,
  BadgeCheck,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Settings,
  Sparkles,
} from 'lucide-react';
import useDialogState from '@/hooks/ui/useDialogState';
import { useLocale } from '@/hooks/ui/useLocale';
import { useResponsive } from '@/hooks/ui/useResponsive';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import { Button } from '@repo/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import { SignOutDialog } from '@/components/sign-out-dialog';

export function NavUser() {
  const locale = useNextLocale();
  const { data: session } = useSession();
  const user = session?.user as UserResponse;
  const { isMobile } = useResponsive();
  const [open, setOpen] = useDialogState();
  const { t, keys } = useLocale('navigation');

  if (!user) {
    return (
      <div className='flex gap-2'>
        <Button asChild variant='default'>
          <Link href={`/${locale}/sign-in`}>
            <LogInIcon className='h-4 w-4' />
            {t(keys.user.signIn)}
          </Link>
        </Button>
        <Button asChild variant='outline'>
          <Link href={`/${locale}/sign-up`}>
            <UserPlus className='h-4 w-4' />
            {t(keys.user.signUp)}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-10 w-full items-center justify-start gap-3 rounded-lg px-3'
          >
            <Avatar className='h-8 w-8 rounded-lg'>
              <AvatarImage src={user?.avatar} alt={user?.username || user?.email} />
              <AvatarFallback className='rounded-lg'>
                {(user?.username || user?.email || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className='grid flex-1 text-start text-sm leading-tight'>
              <span className='truncate font-semibold' title={user?.username || user?.email}>
                {user?.username || user?.email}
              </span>
              <span className='truncate text-xs' title={user?.email}>
                {user?.email}
              </span>
            </div>
            <ChevronsUpDown className='ms-auto size-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
          side={isMobile ? 'bottom' : 'right'}
          align='end'
          sideOffset={4}
        >
          <DropdownMenuLabel className='p-0 font-normal'>
            <div className='flex items-center gap-2 px-1 py-1.5 text-start text-sm'>
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarImage src={user?.avatar} alt={user?.username || user?.email} />
                <AvatarFallback className='rounded-lg'>
                  {(user?.username || user?.email || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-start text-sm leading-tight'>
                <span className='truncate font-semibold' title={user?.username || user?.email}>
                  {user?.username || user?.email}
                </span>
                <span className='truncate text-xs' title={user?.email}>
                  {user?.email}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Sparkles />
              {t(keys.user.upgrade)}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href='/profile'>
                <BadgeCheck />
                {t(keys.user.profile)}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href='/billings'>
                <CreditCard />
                {t(keys.user.billings)}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href='/settings'>
                <Settings />
                {t(keys.user.settings)}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive' onClick={() => setOpen(true)}>
            <LogOut />
            {t(keys.user.signOut)}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  );
}
