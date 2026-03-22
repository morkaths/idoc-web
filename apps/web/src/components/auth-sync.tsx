"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { setAccessToken } from "@/apis/config";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

export function AuthSync() {
    const { data: session, status } = useSession();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (status === 'loading') return;
        setAccessToken(session?.accessToken ?? null);
    }, [session, status]);

    useEffect(() => {
        const login = searchParams.get('login');
        if (session && login) {
            toast.success(`Welcome back, ${session.user?.email}!`);
        }
        if (login) {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('login');
            router.replace(`${pathname}?${params.toString()}`);
        }
    }, [session, searchParams, router, pathname]);

    return null;
}
