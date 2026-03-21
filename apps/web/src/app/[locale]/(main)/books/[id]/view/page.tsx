"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBook } from "@/hooks/data/useBook";
import { useFile } from "@/hooks/data/useFile";
import { ArrowLeft, Loader2, FileQuestion, Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import { useBorrowHistory } from "@/hooks/data/useBorrow";
import { useLocale } from '@/hooks/ui/useLocale';
import { RoleCode } from "@/types";
import { Button } from "@repo/ui/components/button";
import { FileViewer } from "@/components/viewers/file-viewer";

export default function BookViewPage() {
    const { t, keys } = useLocale('view');
    const params = useParams() as { id: string };
    const router = useRouter();
    const { data: session, status } = useSession();
    const { data: book, isLoading: bookLoading } = useBook(params.id);
    const { data: file, isLoading: fileLoading } = useFile(book?.fileKey || "");
    const { data: borrows, isLoading: borrowsLoading } = useBorrowHistory({
        itemId: params.id,
        status: "active",
        limit: 1 // Chỉ cần kiểm tra xem có bản ghi nào không
    }, { enabled: !!session?.user });

    const handleBack = () => router.back();

    const canView = useMemo(() => {
        if (!session?.user) return false;

        // Admin hoặc Manager xem được hết
        const hasPrivilegedRole = session.user.roles?.some(
            (role) => role.code === RoleCode.Admin || role.code === RoleCode.Manager
        );
        if (hasPrivilegedRole) return true;

        // User thường phải có phiếu mượn đang active (borrowing)
        return borrows?.data && borrows.data.length > 0;
    }, [session, borrows]);

    const isLoading = status === "loading" || bookLoading || fileLoading || (session?.user && !canView && borrowsLoading);

    if (isLoading) {
        return (
            <div className="container flex h-[calc(100vh-theme(spacing.16))] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    // If user is not authenticated
    if (status === "unauthenticated") {
        return (
            <div className="container flex h-[calc(100vh-theme(spacing.16))] items-center justify-center p-4">
                <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-lg border bg-card p-8 text-center shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <Lock className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-semibold">{t(keys.unauthenticated.title)}</h3>
                        <p className="text-sm text-center text-muted-foreground text-balance">
                            {t(keys.unauthenticated.description)}
                        </p>
                    </div>
                    <Button onClick={() => router.push(`/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`)} className="mt-2">
                        {t(keys.unauthenticated.actions.login)}
                    </Button>
                </div>
            </div>
        );
    }

    // If user is authenticated but not allowed to view
    if (!canView) {
        return (
            <div className="container flex h-[calc(100vh-theme(spacing.16))] items-center justify-center p-4">
                <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-lg border bg-card p-8 text-center shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                        <Lock className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-semibold">{t(keys.unauthorized.title)}</h3>
                        <p className="text-sm text-center text-muted-foreground text-balance">
                            {t(keys.unauthorized.description)}
                        </p>
                    </div>
                    <Button onClick={handleBack} variant="outline" className="mt-2 text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t(keys.unauthorized.actions.goBack)}
                    </Button>
                </div>
            </div>
        );
    }

    // If book or file is not found
    if (!book || !book.fileKey || !file || !file.url) {
        return (
            <div className="container flex h-[calc(100vh-theme(spacing.16))] items-center justify-center p-4">
                <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-lg border bg-card p-8 text-center shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <FileQuestion className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-semibold">
                            {t(keys.error.book.title)}
                        </h3>
                        <p className="text-sm text-center text-muted-foreground text-balance">
                            {t(keys.error.book.description)}
                        </p>
                    </div>
                    <Button onClick={handleBack} variant="outline" className="mt-2 text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {t(keys.error.actions.goBack)}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <main className="container flex flex-col h-[calc(100vh-theme(spacing.16))] py-4 gap-4">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={handleBack}>
                    <ArrowLeft size={20} />
                </Button>
                <h1 className="text-xl font-semibold truncate">{book.title || t(keys.error.title)}</h1>
            </div>

            <FileViewer
                fileUrl={file.url}
                className="flex-1 w-full border rounded-md overflow-hidden bg-background"
            />
        </main>
    );
}