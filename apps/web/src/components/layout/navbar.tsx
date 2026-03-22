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
import Image from "next/image"

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
                            <NavigationMenuTrigger className="bg-transparent flex items-center gap-2">
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
                                        <li className="row-span-4 p-0 m-0">
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    className="flex h-full w-full items-stretch justify-stretch bg-transparent p-0 m-0 rounded-md"
                                                    href={item.hero.href}
                                                    tabIndex={-1}
                                                >
                                                    {item.hero.image && (
                                                        <Image
                                                            src={item.hero.image}
                                                            alt={item.hero.title}
                                                            width={320}
                                                            height={480}
                                                            className="w-full h-full object-cover rounded-md border shadow-sm"
                                                            style={{ display: "block" }}
                                                            priority
                                                        />
                                                    )}
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
                            <NavigationMenuLink asChild className={navigationMenuTriggerStyle() + " bg-transparent"}>
                                <Link href={item.href || "#"} className="flex items-center gap-2">
                                    <div className="flex items-center gap-2">
                                        {item.icon && React.createElement(item.icon, { className: "w-4 h-4 text-foreground" })}
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