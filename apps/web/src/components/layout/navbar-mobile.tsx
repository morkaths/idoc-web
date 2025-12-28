"use client";
import React from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { ChevronRightIcon, CircleSmallIcon } from "lucide-react";
import Link from "next/link";
import { NavItem } from "./data/nav-data";

type NavigationItem = {
    name: string;
    icon?: React.ElementType;
    href?: string;
} & (
        | { type: "page"; children?: never }
        | { type: "category"; children: NavigationItem[] }
    );

function convertNavItemsToMobile(items: NavItem[]): NavigationItem[] {
    return items.map((item) =>
        item.dropdown
            ? {
                name: item.label,
                icon: item.icon,
                type: "category" as const,
                children: item.dropdown.map((child) => ({
                    name: child.title,
                    icon: child.icon,
                    href: child.href,
                    type: "page" as const,
                })),
            }
            : {
                name: item.label,
                icon: item.icon,
                href: item.href,
                type: "page" as const,
            }
    );
}

interface NavbarMobileProps {
    items: NavItem[];
}

export function NavbarMobile({ items }: NavbarMobileProps) {
    const navigationMenu = convertNavItemsToMobile(items);
    const NavigationMenuItemMobile = ({
        item,
        level,
    }: {
        item: NavigationItem;
        level: number;
    }) => {
        if (item.type === "page") {
            return (
                <Link href={item.href || "#"} className="block">
                    <div
                        className="focus-visible:ring-ring/50 flex items-center gap-2 rounded-md p-1 outline-none focus-visible:ring-[3px]"
                        style={{ paddingLeft: `${level === 0 ? 0.25 : 1.75}rem` }}
                    >
                        {item.icon ? (
                            <item.icon className="size-4 shrink-0" />
                        ) : (
                            <CircleSmallIcon className="size-4 shrink-0" />
                        )}
                        <span className="text-sm">{item.name}</span>
                    </div>
                </Link>
            );
        }

        return (
            <Collapsible
                className="flex flex-col gap-1.5"
                style={{ paddingLeft: `${level === 0 ? 0 : 1.5}rem` }}
            >
                <CollapsibleTrigger className="focus-visible:ring-ring/50 flex items-center gap-2 rounded-md p-1 outline-none focus-visible:ring-[3px]">
                    {item.icon ? (
                        <item.icon className="size-4 shrink-0" />
                    ) : (
                        <CircleSmallIcon className="size-4 shrink-0" />
                    )}
                    <span className="flex-1 text-start text-sm">{item.name}</span>
                    <ChevronRightIcon className="size-4 shrink-0 transition-transform [[data-state='open']>&]:rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down flex flex-col gap-1.5 overflow-hidden transition-all duration-300">
                    {item.children?.map((child) => (
                        <NavigationMenuItemMobile key={child.name} item={child} level={level + 1} />
                    ))}
                </CollapsibleContent>
            </Collapsible>
        );
    };

    return (
        <div className="flex flex-col gap-2.5 p-4 pt-0">
            {navigationMenu.map((item) => (
                <NavigationMenuItemMobile key={item.name} item={item} level={0} />
            ))}
        </div>
    );
}