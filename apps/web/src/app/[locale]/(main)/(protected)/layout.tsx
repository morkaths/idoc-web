import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { locales, defaultLocale } from '@/i18n';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || session.error === 'RefreshAccessTokenError') {
    const headersList = await headers();
    const pathname = headersList.get('x-current-path') || '';
    const firstSegment = pathname.split('/')[1];
    const locale =
      firstSegment && (locales as readonly string[]).includes(firstSegment)
        ? firstSegment
        : defaultLocale;

    redirect(`/${locale}/sign-in`);
  }

  return <>{children}</>;
}
