"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { 
    Maximize, 
    Minimize, 
    List, 
    Plus, 
    Minus, 
    ChevronLeft, 
    ChevronRight,
    Search
} from 'lucide-react';
import { Button } from "@repo/ui/components/button";
import { useReaderSettings } from '../../context/reader-provider';
import { EPUB_THEMES } from './data/setting-data';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/search/lib/styles/index.css';

type PdfViewerProps = {
    fileUrl: string;
    mode?: "full" | "simple";
};

export default function PdfViewer({ fileUrl, mode = "simple" }: PdfViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const { settings } = useReaderSettings();
    const { theme } = settings;

    const themeConfig = useMemo(() => 
        EPUB_THEMES.find(t => t.value === theme) ?? EPUB_THEMES[0]!, 
    [theme]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(document.fullscreenElement !== null);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        sidebarTabs: (defaultTabs) => 
            defaultTabs.length > 0 
                ? (defaultTabs as any[])
                : [],
        renderToolbar: (Toolbar) => (
            <Toolbar>
                {(slots) => {
                    const {
                        CurrentPageInput,
                        NumberOfPages,
                        ZoomIn,
                        ZoomOut,
                        GoToNextPage,
                        GoToPreviousPage,
                        ShowSearchPopover,
                        Download,
                        Print,
                        Rotate,
                        SwitchSelectionMode,
                        ShowProperties,
                    } = slots;
                    
                    const { ShowSidebar } = slots as any;
                    const buttonClass = "h-8 w-8 hover:bg-accent/50 transition-colors pointer-events-auto border-none flex items-center justify-center p-0";
                    const toolStyle = { color: themeConfig.uiFg };

                    return (
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            width: '100%',
                            justifyContent: 'space-between',
                            padding: '0 12px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {ShowSidebar && (
                                    <ShowSidebar>
                                        {(props: any) => (
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className={buttonClass} 
                                                style={toolStyle}
                                                onClick={props.onClick}
                                            >
                                                <List className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </ShowSidebar>
                                )}

                                {ShowSearchPopover && (
                                    <ShowSearchPopover>
                                        {(props: any) => (
                                            <Button variant="ghost" size="icon" {...props} className={buttonClass} style={toolStyle}>
                                                <Search className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </ShowSearchPopover>
                                )}
                                
                                <div className="w-px h-4 mx-1 bg-border/40" />

                                <GoToPreviousPage>
                                    {({ isDisabled, onClick }: any) => (
                                        <Button variant="ghost" size="icon" onClick={onClick} disabled={isDisabled} className={buttonClass} style={toolStyle}>
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                    )}
                                </GoToPreviousPage>
                                <div className="flex items-center gap-1 px-2 text-sm font-medium" style={{ color: themeConfig.fg }}>
                                    <CurrentPageInput />
                                    <span className="opacity-40">/</span>
                                    <NumberOfPages />
                                </div>
                                <GoToNextPage>
                                    {({ isDisabled, onClick }: any) => (
                                        <Button variant="ghost" size="icon" onClick={onClick} disabled={isDisabled} className={buttonClass} style={toolStyle}>
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    )}
                                </GoToNextPage>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <ZoomOut>
                                    {({ isDisabled, onClick }: any) => (
                                        <Button variant="ghost" size="icon" onClick={onClick} disabled={isDisabled} className={buttonClass} style={toolStyle}>
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                    )}
                                </ZoomOut>
                                <ZoomIn>
                                    {({ isDisabled, onClick }: any) => (
                                        <Button variant="ghost" size="icon" onClick={onClick} disabled={isDisabled} className={buttonClass} style={toolStyle}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    )}
                                </ZoomIn>
                                
                                <div className="w-px h-4 mx-1 bg-border/40" />

                                {/* Tính năng VIP chỉ có ở bản FULL */}
                                {mode === "full" && (
                                    <>
                                        <SwitchSelectionMode mode={(slots as any).SelectionMode?.Text}>
                                            {(props: any) => (
                                                <Button variant="ghost" size="icon" {...props} className={buttonClass} style={toolStyle} title="Selection Mode">
                                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3 L21 7 L17 11"/><path d="M3 3 L7 7 L3 11"/><path d="M11 11 L11 21"/><path d="M7 17 L11 21 L15 17"/></svg>
                                                </Button>
                                            )}
                                        </SwitchSelectionMode>
                                        
                                        <Rotate direction={(slots as any).RotateDirection?.Forward || 'Forward'}>
                                            {(props: any) => (
                                                <Button variant="ghost" size="icon" {...props} className={buttonClass} style={toolStyle} title="Rotate Clockwise">
                                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><polyline points="21 3 21 8 16 8"/></svg>
                                                </Button>
                                            )}
                                        </Rotate>

                                        <ShowProperties>
                                            {(props: any) => (
                                                <Button variant="ghost" size="icon" {...props} className={buttonClass} style={toolStyle} title="Document Properties">
                                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                                                </Button>
                                            )}
                                        </ShowProperties>

                                        <div className="w-px h-4 mx-1 bg-border/40" />
                                        
                                        <Download>
                                            {(props: any) => (
                                                <Button variant="ghost" size="icon" {...props} className={buttonClass} style={toolStyle} title="Download">
                                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                                </Button>
                                            )}
                                        </Download>
                                        <Print>
                                            {(props: any) => (
                                                <Button variant="ghost" size="icon" {...props} className={buttonClass} style={toolStyle} title="Print">
                                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                                                </Button>
                                            )}
                                        </Print>
                                        <div className="w-px h-4 mx-1 bg-border/40" />
                                    </>
                                )}

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={buttonClass}
                                    onClick={toggleFullscreen}
                                    title="Toggle Fullscreen"
                                    style={toolStyle}
                                >
                                    {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    );
                }}
            </Toolbar>
        ),
    });

    return (
        <div 
            ref={containerRef} 
            className="h-full w-full flex flex-col overflow-hidden relative"
            style={{ 
                backgroundColor: themeConfig.bg,
                ['--rpv-core__toolbar-background' as any]: 'transparent',
                ['--rpv-core__toolbar-border-bottom-color' as any]: themeConfig.uiBorder,
                ['--rpv-default-layout__body-background' as any]: themeConfig.bg,
            }}
        >
            <style dangerouslySetInnerHTML={{ __html: `
                /* Làm đẹp khung popover */
                .rpv-core__popover-body {
                    background-color: ${themeConfig.bg} !important;
                    color: ${themeConfig.fg} !important;
                    border-color: ${themeConfig.uiBorder} !important;
                    border-radius: 8px !important;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
                    width: 260px !important;
                }
                /* Cải thiện giao diện input search */
                .rpv-search__popover-input-container {
                    padding: 12px !important;
                }
                .rpv-core__textbox {
                    background-color: transparent !important;
                    color: ${themeConfig.fg} !important;
                    border-color: ${themeConfig.uiBorder} !important;
                }
            ` }} />
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer 
                    fileUrl={fileUrl} 
                    plugins={[defaultLayoutPluginInstance]} 
                    theme={theme === 'dark' ? 'dark' : 'light'}
                />
            </Worker>
        </div>
    );
}