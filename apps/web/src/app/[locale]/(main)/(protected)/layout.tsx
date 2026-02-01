import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { locales, defaultLocale } from "@/i18n";

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session) {
        const headersList = await headers();
        const pathname = headersList.get("x-current-path") || "";
        const firstSegment = pathname.split('/')[1];
        const locale = (firstSegment && locales.includes(firstSegment as any))
            ? firstSegment
            : defaultLocale;

        redirect(`/${locale}/sign-in`);
    }

    return <>{children}</>;
}
