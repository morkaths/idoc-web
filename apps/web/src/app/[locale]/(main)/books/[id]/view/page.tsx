"use client";

import { useParams, useRouter } from "next/navigation";
import { useBook } from "@/hooks/data/useBook";
import { useFile, useViewUrl } from "@/hooks/data/useFile";
import { ArrowLeft, Loader2, Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import { useBorrowHistory, useRead } from "@/hooks/data/useBorrow";
import { useLocale } from '@/hooks/ui/useLocale';
import { Button } from "@repo/ui/components/button";
import { FileViewer } from "@/components/viewers/file-viewer";
import { API_CONFIG } from "@/config/api";

export default function BookViewPage() {
    const { t, keys } = useLocale('view');
    const params = useParams() as { id: string };
    const router = useRouter();
    const { data: session, status } = useSession();
    const { data: book, isLoading: bookLoading } = useBook(params.id);
    const { data: file, isLoading: fileLoading } = useFile(book?.file || "");
    const { data: borrows, isLoading: borrowsLoading } = useBorrowHistory({
        item: params.id,
        status: "active",
        limit: 1
    }, { enabled: !!session?.user });

    const activeBorrowId = borrows?.data?.[0]?.id;
    const { data: ticket, isLoading: ticketLoading } = useRead(activeBorrowId || "", {
        enabled: !!activeBorrowId && !!session?.user
    });

    const { data: viewUrl, isLoading: viewUrlLoading } = useViewUrl(book?.file || "", ticket || "", {
        enabled: !!book?.file && !!ticket
    });

    const handleBack = () => router.back();

    const isLoading = status === "loading" || bookLoading || fileLoading || borrowsLoading || 
                      (!!activeBorrowId && (ticketLoading || viewUrlLoading));

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
    if (borrows && !activeBorrowId) {
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

    // If read link is not ready
    if (!viewUrl) {
        return (
            <div className="container flex h-[calc(100vh-theme(spacing.16))] items-center justify-center p-4">
                <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-lg border bg-card p-8 text-center shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <Lock className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-semibold">
                            {t(keys.error.title)}
                        </h3>
                        <p className="text-sm text-center text-muted-foreground text-balance">
                            {t(keys.error.description)}
                        </p>
                    </div>
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
                <h1 className="text-xl font-semibold truncate">{book?.title}</h1>
            </div>

            <FileViewer
                fileUrl={viewUrl}
                mimeType={file?.mimetype}
                className="flex-1 w-full border rounded-md overflow-hidden bg-background"
            />
        </main>
    );
}