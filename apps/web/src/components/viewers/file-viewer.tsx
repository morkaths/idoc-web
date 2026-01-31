"use client";
import dynamic from "next/dynamic";
import { FileQuestion } from "lucide-react";
import { OfficeViewer } from "./office-viewer";
import { EpubViewer } from "./epub-viewer";

const PdfViewer = dynamic(() => import('./pdf-viewer'), { ssr: false });

type FileViewerProps = {
    fileUrl: string;
    className?: string;
};

export function FileViewer({ fileUrl, className }: FileViewerProps) {
    if (fileUrl.match(/\.pdf(\?|$)/i)) {
        return (
            <div className={className}>
                <PdfViewer fileUrl={fileUrl} mode="full" />
            </div>
        );
    }

    if (fileUrl.match(/\.(doc|docx|xls|xlsx|ppt|pptx)(\?|$)/i)) {
        return (
            <div className={className}>
                <OfficeViewer fileUrl={fileUrl} />
            </div>
        );
    }

    if (fileUrl.match(/\.epub(\?|$)/i)) {
        return (
            <div className={className}>
                <EpubViewer fileUrl={fileUrl} className="h-full" />
            </div>
        );
    }

    return (
        <div className={`flex flex-col items-center justify-center h-full gap-2 text-muted-foreground ${className}`}>
            <FileQuestion className="h-10 w-10 opacity-50" />
            <p>Định dạng file không được hỗ trợ để xem trước.</p>
        </div>
    );
}
