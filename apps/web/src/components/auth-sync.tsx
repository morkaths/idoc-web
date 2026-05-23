'use client';

import { useSearchParams, useRouter, usePathname, useParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'sonner';
import { setAccessToken } from '@/apis/config';

export function AuthSync() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const loginShownRef = useRef<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (session?.error === 'RefreshAccessTokenError') {
      signOut({ redirect: true, callbackUrl: `/${locale}/sign-in` });
      return;
    }

    setAccessToken(session?.accessToken ?? null);
  }, [session, status, locale]);

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
