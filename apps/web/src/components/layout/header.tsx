"use client";

import React from "react";
import {
  Command,
} from "lucide-react";
import Link from "next/link";
import { ThemeSwitch } from "./theme-switch";
import { Navbar } from "./navbar";
import { NavComponents } from "./data/nav-data";
import { Search } from "./search";
import { ProfileDropdown } from "./profile-dropdown";
import { AppSidebar } from "./sidebar";


export const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <header
      className="
        w-full fixed top-0 left-0 backdrop-blur bg-card/80
        md:sticky md:top-5 md:w-[90%] md:rounded-md md:bg-card
        bg-opacity-15 mx-auto border border-secondary z-40 p-2
      "
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <Link href="/" className="font-bold text-lg flex items-center pl-2">
            <Command className="w-9 h-9 mr-2" />
            <span className="hidden md:flex">iDoc</span>
          </Link>
          {/* Search */}
          <div className="hidden md:flex w-50 lg:w-70 max-w-sm md:max-w-md lg:max-w-lg">
            <Search />
          </div>
          {/* Mobile */}
          <div className="flex items-center xl:hidden">
            <AppSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        </div>
        {/* Desktop Menu */}
        <nav className="hidden xl:flex flex-1 justify-center items-center gap-8">
          <Navbar items={NavComponents} />
        </nav>
        {/* Right actions */}
        <div className="flex items-center gap-2">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};