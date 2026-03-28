"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { setAccessToken } from "@/apis/config";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

export function AuthSync() {
    const { data: session, status } = useSession();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const loginShownRef = useRef<string | null>(null);

    useEffect(() => {
        if (status === 'loading') return;
        setAccessToken(session?.accessToken ?? null);
    }, [session, status]);

    useEffect(() => {
        const login = searchParams.get('login');
        if (session && login && loginShownRef.current !== login) {
            toast.success(`Welcome back, ${session.user?.email}!`);
            loginShownRef.current = login;
        }
        if (login) {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('login');
            router.replace(`${pathname}?${params.toString()}`);
        }
    }, [session, searchParams, router, pathname]);

    return null;
}
