"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui/components/sheet";
import { Separator } from "@repo/ui/components/separator";
import { Button } from "@repo/ui/components/button";
import { LayoutPanelLeft, Command } from "lucide-react";
import Link from "next/link";
import { NavbarMobile } from "./navbar-mobile";
import { NavComponents } from "./data/nav-data";
import { Search } from "./search";
import { NavUser } from "./nav-user";

export function AppSidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (v: boolean) => void }) {
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
            <NavbarMobile items={NavComponents} />
          </div>
        </div>
        <SheetFooter className="flex-col sm:flex-col justify-center items-center">
          <Separator className="mb-2" />
          <NavUser />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}