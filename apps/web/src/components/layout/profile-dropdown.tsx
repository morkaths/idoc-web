"use client";

import Link from 'next/link';
import { useLocale as useNextLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import { LogInIcon } from 'lucide-react';
import useDialogState from '@/hooks/ui/useDialogState';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import { Button } from '@repo/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import { SignOutDialog } from '@/components/sign-out-dialog';
import { useSession } from "next-auth/react";
import type { UserResponse } from "@/types";
import { useLocale } from '@/hooks/ui/useLocale';

export function ProfileDropdown() {
  const locale = useNextLocale();
  const { data: session } = useSession();
  const user = session?.user as UserResponse;
  const [open, setOpen] = useDialogState();
  const [isMounted, setIsMounted] = useState(false);
  const { t, keys } = useLocale('navigation');
  useEffect(() => { setIsMounted(true); }, []);

  if (!isMounted) {
    return (
      <div className="flex gap-2 opacity-0">
        <Button variant="default" disabled>{t(keys.user.signIn)}</Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button asChild variant="default">
          <Link href={`/${locale}/sign-in`}>
            <LogInIcon className="h-4 w-4" />
            {t(keys.user.signIn)}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src={user?.profile?.avatar || ''} alt={user?.username || 'User'} />
              <AvatarFallback>{user?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col gap-1.5'>
              <p className='truncate text-sm leading-none font-medium' title={user.username}>{user.username || 'User'}</p>
              <p className='text-muted-foreground truncate text-xs leading-none' title={user.email}>{user.email || ''}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href='/profile'>
                {t(keys.user.profile)}
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href='/billing'>
                {t(keys.user.billings)}
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href='/settings'>
                {t(keys.user.settings)}
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive' onClick={() => setOpen(true)}>
            {t(keys.user.signOut)}
            <DropdownMenuShortcut className='text-current'>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog open={!!open} onOpenChange={setOpen} />
    </>
  );
}
