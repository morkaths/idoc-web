import Link from 'next/link';
import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles } from 'lucide-react';
import useDialogState from '@/hooks/ui/useDialogState';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
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
import { useAuthStore } from '@/stores/auth-store';
import { useResponsive } from '@/hooks/ui/useResponsive';
import { Button } from '@repo/ui/components/button';

export function NavUser() {
  const user = useAuthStore((state) => state.auth.user);
  const { isMobile } = useResponsive();
  const [open, setOpen] = useDialogState();

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button asChild variant="default">
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-3 h-10 px-3 rounded-lg w-full justify-start"
          >
            <Avatar className='h-8 w-8 rounded-lg'>
              <AvatarImage src='/avatars/01.png' alt={user.username} />
              <AvatarFallback className='rounded-lg'>{user.username.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <div className='hidden md:grid flex-1 text-start text-sm leading-tight'>
              <span className='truncate font-semibold'>{user.username}</span>
              <span className='truncate text-xs'>{user.email}</span>
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
                <AvatarImage src='/avatars/01.png' alt={user.username} />
                <AvatarFallback className='rounded-lg'>{user.username.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-start text-sm leading-tight'>
                <span className='truncate font-semibold'>{user.username}</span>
                <span className='truncate text-xs'>{user.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Sparkles />
              Upgrade to Pro
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href='/settings/account'>
                <BadgeCheck />
                Account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href='/settings'>
                <CreditCard />
                Billing
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href='/settings/notifications'>
                <Bell />
                Notifications
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive' onClick={() => setOpen(true)}>
            <LogOut />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  );
}