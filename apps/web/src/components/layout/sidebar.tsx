"use client";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui/components/sheet";
import { Button } from "@repo/ui/components/button";
import { LayoutPanelLeft, Command } from "lucide-react";
import Link from "next/link";
import { NavbarMobile } from "./navbar-mobile";
import { useNavData } from "./data/nav-data";
import { Search } from "./search";
import { NavUser } from "./nav-user";
import { useEffect, useState } from "react";

export function AppSidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (v: boolean) => void }) {
  const [isMounted, setIsMounted] = useState(false);
  const navItems = useNavData();
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return null;
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon' className='rounded-md border'>
          <LayoutPanelLeft
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer size-[1.2rem] xl:hidden"
          />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex flex-col justify-between rounded-md bg-card border-secondary"
      >
        <div>
          <SheetHeader className="mb-4 ml-4">
            <SheetTitle className="flex items-center">
              <Link href="/" className="font-bold text-lg flex items-center">
                <Command className="w-9 h-9 px-2" />
                iDoc
              </Link>
            </SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-3">
            <Search />
          </div>
          <div className="flex flex-col gap-2.5 p-4 pt-0">
            <NavbarMobile items={navItems} onNavigate={() => setIsOpen(false)} />
          </div>
        </div>
        <SheetFooter className="flex-col sm:flex-col justify-center items-center w-full px-2 pb-4 border-t border-border mt-auto">
          <NavUser />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}