"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@repo/ui/components/dialog";
import { Button } from "@repo/ui/components/button";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useBook } from "@/hooks/data/useBook";
import { useFile } from "@/hooks/data/useFile";

const PdfViewer = dynamic(() => import('@/components/pdf-viewer'), { ssr: false });

export default function BookViewPage() {
    const [open, setOpen] = useState(false);
    const params = useParams() as { id: string };
    const { data: book, isLoading: bookLoading } = useBook(params.id);
    const { data: file, isLoading: fileLoading } = useFile(book?.fileKey || "");

    if (bookLoading) return <div>Loading book...</div>;
    if (!book) return <div>Book not found</div>;
    if (!book.fileKey) return <div>No file available</div>;
    if (fileLoading) return <div>Loading file...</div>;
    if (!file || !file.url) return <div>No file available</div>;

    return (
        <main className="container py-8">
            <Button onClick={() => setOpen(true)}>Xem tài liệu</Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent
                    className="max-w-[90vw]! w-[80vw]! h-[90vh]! p-0"
                >
                    <DialogHeader className="px-6 pt-6 pb-2">
                        <DialogTitle className="text-lg font-semibold">
                            {file.filename || "Xem tài liệu"}
                        </DialogTitle>
                    </DialogHeader>
                    <div
                        className="w-full flex items-center justify-center border-t"
                        style={{ ["--scale-factor" as any]: 1, minHeight: 500, height: '80vh' }}
                    >
                        {file.url.match(/\.pdf(\?|$)/i) ? (
                            <PdfViewer fileUrl={file.url} mode="simple" />
                        ) : file.url.match(/\.(doc|docx|xls|xlsx|ppt|pptx)(\?|$)/i) ? (
                            <iframe
                                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file.url)}`}
                                width="100%"
                                height="100%"
                                className="rounded"
                                title="Book file"
                                style={{ minHeight: 400, height: '100%' }}
                            />
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">
                                File type not supported for preview.
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </main>
    );
}