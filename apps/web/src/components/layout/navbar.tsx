"use client"

import * as React from "react"
import Link from "next/link"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@repo/ui/components/navigation-menu"
import { NavItem } from "../layout/data/nav-data"

interface NavbarProps {
    items: NavItem[];
}

export function Navbar({ items }: NavbarProps) {
    return (
        <NavigationMenu>
            <NavigationMenuList className="flex-wrap">
                {items.map((item) =>
                    item.dropdown ? (
                        <NavigationMenuItem key={item.label}>
                            <NavigationMenuTrigger className="bg-card flex items-center gap-2">
                                {item.icon && React.createElement(item.icon, { className: "w-4 h-4" })}
                                {item.label}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul
                                    className={
                                        item.hero
                                            ? "grid gap-2 md:w-100 lg:w-125 lg:grid-cols-[.75fr_1fr]"
                                            : "grid gap-2 sm:w-100 md:w-125 md:grid-cols-2 lg:w-150"
                                    }
                                >
                                    {item.hero && (
                                        <li className="row-span-3">
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-4 no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md md:p-6"
                                                    href={item.hero.href}
                                                >
                                                    <div className="mb-2 text-lg font-medium sm:mt-4">{item.hero.title}</div>
                                                    <p className="text-muted-foreground text-sm leading-tight">{item.hero.description}</p>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                    )}
                                    {item.dropdown.map((child) =>
                                        <ListItem
                                            key={child.title}
                                            href={child.href}
                                            title={child.title}
                                            icon={"icon" in child ? child.icon : undefined}
                                        >
                                            {"description" in child ? child.description : undefined}
                                        </ListItem>
                                    )}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    ) : (
                        <NavigationMenuItem key={item.label}>
                            <NavigationMenuLink asChild className={navigationMenuTriggerStyle() + " bg-card"}>
                                <Link href={item.href || "#"} className="flex items-center gap-2">
                                    <div className="flex items-center gap-2">
                                        {item.icon && React.createElement(item.icon, { className: "w-4 h-4" })}
                                        {item.label}
                                    </div>
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    )
                )}
            </NavigationMenuList>
        </NavigationMenu>
    )
}

function ListItem({
    title,
    icon,
    children,
    href,
    ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string; icon?: React.ElementType }) {
    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Link href={href}>
                    <div className="text-sm leading-none font-medium flex items-center gap-2">
                        {icon && React.createElement(icon, { className: "w-4 h-4" })}
                        {title}
                    </div>
                    {children && (
                        <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">{children}</p>
                    )}
                </Link>
            </NavigationMenuLink>
        </li>
    )
}