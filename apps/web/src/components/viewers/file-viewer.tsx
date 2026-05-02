"use client";
import dynamic from "next/dynamic";
import { FileQuestion } from "lucide-react";
import { OfficeViewer } from "./office-viewer";
import { EpubViewer } from "./epub-viewer";

const PdfViewer = dynamic(() => import('./pdf-viewer'), { ssr: false });

type FileViewerProps = {
    fileUrl: string;
    contentType?: string;
    className?: string;
};

export function FileViewer({ fileUrl, contentType, className }: FileViewerProps) {
    if (fileUrl.match(/\.pdf(\?|$)/i) || contentType === 'application/pdf') {
        return (
            <div className={className}>
                <PdfViewer fileUrl={fileUrl} mode="full" />
            </div>
        );
    }

    if (fileUrl.match(/\.(doc|docx|xls|xlsx|ppt|pptx)(\?|$)/i) || 
        (contentType && [
            'application/msword', 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ].includes(contentType))) {
        return (
            <div className={className}>
                <OfficeViewer fileUrl={fileUrl} />
            </div>
        );
    }

    if (fileUrl.match(/\.epub(\?|$)/i) || contentType === 'application/epub+zip') {
        return (
            <div className={className}>
                <EpubViewer fileUrl={fileUrl} className="h-full" />
            </div>
        );
    }

    return (
        <div className={`flex flex-col items-center justify-center h-full gap-2 text-muted-foreground ${className}`}>
            <FileQuestion className="h-10 w-10 opacity-50" />
            <p>Định dạng file không được hỗ trợ để xem trước ({contentType || 'không xác định'}).</p>
        </div>
    );
}
