import { Command } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
}

export const Logo = ({ className }: LogoProps) => {
    return (
        <Link href="/" className={cn("font-bold text-lg flex items-center pl-2", className)}>
            <Command className="w-9 h-9 mr-2" />
            <span className="hidden md:flex">iDoc</span>
        </Link>
    );
};
