"use client";
import React from "react";
import { useScroll } from "@/hooks/ui/useScroll";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";
import { Navbar } from "./navbar";
import { useNavData } from "./data/nav-data";
import { Search } from "./search";
import { AppSidebar } from "./sidebar";
import { ThemeSwitch } from "./theme-switch";
import { ProfileDropdown } from "./profile-dropdown";
import { ConfigDrawer } from "./config-drawer";
import { LocaleSwitch } from "./locale-switch";

export function Header() {
	const scrolled = useScroll(10);
	const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
	const navItems = useNavData();

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
					<Navbar items={navItems} />
				</div>

				{/* Right actions */}
				<div className="flex items-center gap-2">
					{/* Mobile */}
					<div className="flex items-center lg:hidden">
						<AppSidebar isOpen={mobileMenuOpen} setIsOpen={setMobileMenuOpen} />
					</div>
					{/* Search */}
					<div className="flex w-full items-center gap-2">
						<div className="flex xl:hidden">
							<Search variant="icon" />
						</div>
						<div className="hidden xl:flex w-50 max-w-sm">
							<Search />
						</div>
					</div>
					<LocaleSwitch />
					<ThemeSwitch />
					<ConfigDrawer />
					<ProfileDropdown />
				</div>
			</nav>
		</header>
	);
}
