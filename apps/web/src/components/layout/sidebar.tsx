'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LayoutPanelLeft, Command } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@repo/ui/components/sheet';
import { useNavData } from './data/nav-data';
import { NavUser } from './nav-user';
import { NavbarMobile } from './navbar-mobile';

export function AppSidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const navItems = useNavData();
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon' className='rounded-md border'>
          <LayoutPanelLeft
            onClick={() => setIsOpen(!isOpen)}
            className='size-[1.2rem] cursor-pointer xl:hidden'
          />
        </Button>
      </SheetTrigger>
      <SheetContent
        side='left'
        className='bg-card border-secondary flex flex-col justify-between rounded-md'
      >
        <div>
          <SheetHeader className='mb-4 ml-4'>
            <SheetTitle className='flex items-center'>
              <Link href='/' className='flex items-center text-lg font-bold'>
                <Command className='h-9 w-9 px-2' />
                iDoc
              </Link>
            </SheetTitle>
          </SheetHeader>
          <div className='flex flex-col gap-2.5 p-4 pt-0'>
            <NavbarMobile items={navItems} onNavigate={() => setIsOpen(false)} />
          </div>
        </div>
        <SheetFooter className='border-border mt-auto w-full flex-col items-center justify-center border-t px-2 pb-4 sm:flex-col'>
          <NavUser />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
