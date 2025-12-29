"use client";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

type PdfViewerProps = {
    fileUrl: string;
    mode?: "full" | "simple";
};

export default function PdfViewer({ fileUrl, mode = "full" }: PdfViewerProps) {
    const defaultLayoutPluginInstance = defaultLayoutPlugin(
        mode === "simple"
            ? {
                renderToolbar: (Toolbar) => (
                    <Toolbar>
                        {(slots) => {
                            const {
                                CurrentPageInput,
                                NumberOfPages,
                                ZoomIn,
                                ZoomOut,
                            } = slots;
                            return (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <CurrentPageInput />
                                    <span>/</span>
                                    <NumberOfPages />
                                    <ZoomOut />
                                    <ZoomIn />
                                </div>
                            );
                        }}
                    </Toolbar>
                ),
            }
            : undefined
    );

    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
        </Worker>
    );
}