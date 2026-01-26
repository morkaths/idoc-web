"use client";
import React from "react";
import { useScroll } from "@/hooks/ui/useScroll";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";
import { Navbar } from "./navbar";
import { NavComponents } from "./data/nav-data";
import { Search } from "./search";
import { AppSidebar } from "./sidebar";
import { ThemeSwitch } from "./theme-switch";
import { ProfileDropdown } from "./profile-dropdown";
import { ConfigDrawer } from "./config-drawer";

export function Header() {
	const scrolled = useScroll(10);
	const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

	React.useEffect(() => {
		if (mobileMenuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		}
	}, [mobileMenuOpen]);

	return (
		<header
			className={cn(
				"sticky top-0 z-50 mx-auto w-full border-transparent border-b xl:rounded-md xl:border xl:transition-all xl:ease-out",
				{
					"border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50 xl:top-2 xl:max-w-6xl xl:shadow":
						scrolled,
				}
			)}
		>
			<nav
				className={cn(
					"flex h-14 w-full items-center justify-between px-4 xl:h-12 xl:transition-all xl:ease-out",
					{
						"xl:px-2": scrolled,
					}
				)}
			>
				<div className="flex items-center gap-2">
					<Logo className="h-4.5" />
				</div>

				<div className="hidden lg:flex items-center gap-1">
					<Navbar items={NavComponents} />
				</div>

				{/* Right actions */}
				<div className="flex items-center gap-2">
					{/* Search */}
					<div className="hidden sm:flex w-40 xl:w-50 max-w-sm md:max-w-md lg:max-w-lg">
						<Search />
					</div>
					{/* Mobile */}
					<div className="flex items-center lg:hidden">
						<AppSidebar isOpen={mobileMenuOpen} setIsOpen={setMobileMenuOpen} />
					</div>
					<ThemeSwitch />
					<ConfigDrawer />
					<ProfileDropdown />
				</div>
			</nav>
		</header>
	);
}
