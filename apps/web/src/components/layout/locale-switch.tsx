"use client";

import { usePathname, useRouter } from 'next/navigation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Button } from "@repo/ui/components/button";
import { Languages } from "lucide-react";
import { type Locale } from '@/i18n';
import { Languages as AllLanguages, type Language } from '@/types';
import { useLocale } from 'next-intl';

export function LocaleSwitch() {
    const pathname = usePathname();
    const router = useRouter();
    const currentLocale = useLocale() as Locale;

    const segments = pathname.split('/').filter(Boolean);
    const firstSegment = segments[0];
    const isFirstSegmentLocale = firstSegment && AllLanguages.some((l: Language) => l.value === firstSegment);

    const activeLocale = isFirstSegmentLocale ? (firstSegment as Locale) : currentLocale;

    const handleLocaleChange = (newLocale: Locale) => {
        if (newLocale === activeLocale) return;

        const segments = pathname.split('/').filter(Boolean);
        const firstSegment = segments[0];
        const isFirstSegmentLocale = firstSegment && AllLanguages.some((l: Language) => l.value === firstSegment);

        let newPathname;
        if (isFirstSegmentLocale) {
            segments[0] = newLocale;
            newPathname = `/${segments.join('/')}`;
        } else {
            newPathname = `/${newLocale}${pathname}`;
        }

        router.push(newPathname);
    };

    const enabledLanguages = AllLanguages.filter((lang: Language) => lang.enabled);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-md border">
                    <Languages className="h-[1.2rem] w-[1.2rem]" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {enabledLanguages.map((lang: Language) => (
                    <DropdownMenuItem
                        key={lang.value}
                        onClick={() => handleLocaleChange(lang.value as Locale)}
                        className={activeLocale === lang.value ? "bg-accent" : ""}
                    >
                        <span className={`fi fi-${lang.flag} fis mr-2`} />
                        {lang.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
