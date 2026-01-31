import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { ReactReader, IReactReaderStyle, ReactReaderStyle } from "react-reader";
import { List, Maximize, Minimize } from 'lucide-react';

import { Button } from "@repo/ui/components/button";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@repo/ui/components/sheet";

import { API_CONFIG } from "@/config/api";
import { useReaderSettings } from "../../context/reader-provider";
import { Theme, EPUB_THEMES, ThemeOption } from "./data/setting-data";
import { EpubSettings } from "./epub-settings";

const createReaderStyle = (): IReactReaderStyle => ({
    ...ReactReaderStyle,
    container: {
        ...ReactReaderStyle.container,
        backgroundColor: 'var(--reader-bg)'
    },
    readerArea: {
        ...ReactReaderStyle.readerArea,
        backgroundColor: 'var(--reader-bg)',
    },
    titleArea: {
        ...ReactReaderStyle.titleArea,
        display: 'none',
    },
    tocArea: {
        ...ReactReaderStyle.tocArea,
        display: 'none',
    },
    tocButton: {
        ...ReactReaderStyle.tocButton,
        display: 'none',
    },
    arrow: {
        ...ReactReaderStyle.arrow,
        color: 'var(--reader-ui-fg)',
        fontSize: '32px',
        padding: '0 5px',
        backgroundColor: 'transparent',
        transition: 'all 0.2s ease',
        height: '100%',
        width: '40px',
        top: '0',
        marginTop: '0',
        transform: 'none',
    },
});
// Hằng số cho Google Fonts
const GOOGLE_FONTS_URL = "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Merriweather:wght@400;700&family=Lora:ital,wght@0,400;0,700;1,400;1,700&family=EB+Garamond:ital,wght@0,400;0,700;1,400;1,700&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,700;1,7..72,400;1,7..72,700&family=Lexend:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap";
const OPEN_DYSLEXIC_URL = "https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/header.min.css";

/**
 * Đăng ký phông chữ ngoại vi vào tài liệu EPUB
 */
const registerExternalFonts = (contents: any) => {
    const head = contents.window.document.head;
    if (!head) return;

    const link = contents.window.document.createElement("link");
    link.rel = "stylesheet";
    link.href = GOOGLE_FONTS_URL;
    head.appendChild(link);

    const odLink = contents.window.document.createElement("link");
    odLink.rel = "stylesheet";
    odLink.href = OPEN_DYSLEXIC_URL;
    head.appendChild(odLink);
};

/**
 * Áp dụng cấu hình giao diện (theme, font, size) vào rendition
 */
const applyRenditionStyles = (rendition: any, theme: Theme, fontFamily: string, fontSize: number) => {
    const activeTheme = EPUB_THEMES.find(t => t.value === theme) || EPUB_THEMES[0] || { fg: '#000', bg: '#fff' };
    const currentFont = fontFamily === 'Origin' ? 'inherit' : (fontFamily === 'OpenDyslexic' ? '"OpenDyslexic", sans-serif' : fontFamily);
    
    // Sử dụng default() để ép áp dụng style vào body, tránh bug kẹt theme của epub.js
    rendition.themes.default({
        body: {
            'color': `${activeTheme.fg} !important`,
            'background': `${activeTheme.bg} !important`,
            'font-family': `${currentFont} !important`,
            'line-height': '1.6 !important',
            'padding': '20px 40px !important'
        }
    });
    
    // Vẫn dùng fontSize API cho đồng bộ
    rendition.themes.fontSize(`${fontSize}%`);
};

type EpubViewerProps = {
    fileUrl: string;
    className?: string;
};

export function EpubViewer({ fileUrl, className }: EpubViewerProps) {

    const { 
        settings,
        getEpubLocations,
        saveEpubLocations
    } = useReaderSettings();
    const { fontSize, fontFamily, theme, flow } = settings;

    // Xử lý URL tuyệt đối nếu là đường dẫn tương đối
    const absoluteFileUrl = useMemo(() => {
        if (!fileUrl) return "";
        if (fileUrl.startsWith("http")) return fileUrl;
        
        const baseUrl = API_CONFIG.baseURL || "";
        const cleanBase = baseUrl.replace(/\/api$/, "");
        
        if (fileUrl.startsWith("/")) {
            return `${cleanBase}${fileUrl}`;
        }
        return fileUrl;
    }, [fileUrl]);

    // Tạo key duy nhất để lưu cache (loại bỏ query params của S3)
    const cacheKey = useMemo(() => {
        if (!absoluteFileUrl) return "";
        let base = "";
        try {
            const url = new URL(absoluteFileUrl);
            base = `${url.origin}${url.pathname}`;
        } catch (e) {
            base = absoluteFileUrl.split('?')[0] || "";
        }
        return `epub_loc_${flow}_${base}`;
    }, [absoluteFileUrl, flow]);

    const [location, setLocation] = useState<string | number>(0);
    const [toc, setToc] = useState<any[]>([]);
    const [isTocOpen, setIsTocOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [isCalculating, setIsCalculating] = useState(false);
    const [epubData, setEpubData] = useState<ArrayBuffer | string | null>(null);
    const renditionRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const locationsInitializedRef = useRef<boolean>(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Theo dõi trạng thái fullscreen của trình duyệt để cập nhật UI chính xác
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
            containerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    // Reset trạng thái khi đổi sách hoặc đổi layout (Bắt buộc phải tính lại locations khi đổi layout)
    useEffect(() => {
        locationsInitializedRef.current = false;
        setTotalPages(0);
        setProgress(0);
        setCurrentPage(0);
        setIsCalculating(false);
    }, [fileUrl, flow]);

    // Tải file thủ công để tránh lỗi nhận diện URL có query params
    useEffect(() => {
        if (!absoluteFileUrl) return;
        
        setEpubData(null); // Reset khi đổi sách
        
        fetch(absoluteFileUrl)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.arrayBuffer();
            })
            .then(buffer => {
                setEpubData(buffer);
            })
            .catch(err => {
                // Fallback về URL nếu fetch lỗi (CORS, v.v.)
                setEpubData(absoluteFileUrl);
            });
    }, [absoluteFileUrl]);

    const themeConfig = useMemo(() => 
        EPUB_THEMES.find(t => t.value === theme) ?? EPUB_THEMES[0]!, 
    [theme]);

    const handleLocationChange = useCallback((epubcfi: string | number) => {
        setLocation(epubcfi);
        const rendition = renditionRef.current;
        if (rendition?.book?.locations) {
            const loc = rendition.book.locations;
            try {
                const percentage = typeof loc.percentageFromCfi === 'function' 
                    ? loc.percentageFromCfi(epubcfi as string) 
                    : 0;
                setProgress(Math.round(percentage * 100));
                
                const current = typeof loc.locationFromCfi === 'function'
                    ? loc.locationFromCfi(epubcfi as string)
                    : null;
                    
                if (current !== null && current !== undefined) {
                    setCurrentPage(current + 1);
                }
            } catch (err) {
                console.warn("Error calculating location:", err);
            }
        }
    }, []);

    const getRendition = useCallback((rendition: any) => {
        renditionRef.current = rendition;
        if (!rendition) return;

        // Cấp quyền sandbox - CHỈ ĐĂNG KÝ 1 LẦN
        rendition.hooks.content.register((contents: any) => {
            const iframe = contents.window.frameElement;
            if (iframe) {
                iframe.setAttribute("sandbox", "allow-scripts allow-popups allow-forms");
            }
            registerExternalFonts(contents);
        });

        // Áp dụng styles ngay lập tức
        applyRenditionStyles(rendition, settings.theme, settings.fontFamily, settings.fontSize);

        // Logic nạp số trang (Chặn lặp bằng Ref - Tuyệt đối không tính lại khi đổi font/theme)
        if (rendition.book && !locationsInitializedRef.current) {
            rendition.book.ready.then(async () => {
                const locations = rendition.book.locations;
                
                // 1. Thử nạp từ Cache
                if (cacheKey) {
                    const cached = getEpubLocations(cacheKey);
                    if (cached && typeof locations.load === 'function') {
                        try {
                            locations.load(cached);
                            const len = typeof locations.length === 'function' ? locations.length() : locations.length;
                            setTotalPages(Number(len) || 0);
                            locationsInitializedRef.current = true; // Khóa ngay lập tức
                            setIsCalculating(false);
                            return true;
                        } catch (e) {
                            console.warn("Failed to load cached locations:", e);
                        }
                    }
                }
                
                // 2. Nếu không có cache, tính toán mới
                if (locations && typeof locations.generate === 'function' && rendition.book.spine) {
                    setIsCalculating(true);
                    try {
                        console.log("[EpubViewer] One-time location generation...");
                        await locations.generate(2048);
                        if (cacheKey && typeof locations.export === 'function') {
                            const exported = locations.export();
                            if (exported) saveEpubLocations(cacheKey, exported);
                        }
                    } catch (e) {
                        console.error("Error during locations.generate:", e);
                    } finally {
                        setIsCalculating(false);
                    }
                }
                return true;
            }).then(() => {
                const locations = rendition.book?.locations;
                if (locations) {
                    const len = typeof locations.length === 'function' ? locations.length() : locations.length;
                    if (len > 0) setTotalPages(Number(len));
                }
                locationsInitializedRef.current = true; // Đánh dấu hoàn tất
                
                const startLoc = rendition.location?.start?.cfi;
                if (startLoc) handleLocationChange(startLoc);
            });
        }
    }, [cacheKey, getEpubLocations, saveEpubLocations, handleLocationChange, settings]); // settings deps ở đây ổn vì locationsInitializedRef sẽ chặn việc nạp lại

    useEffect(() => {
        const rendition = renditionRef.current;
        if (rendition) {
            applyRenditionStyles(rendition, theme, fontFamily, fontSize);

            const currentLoc = rendition.location?.start?.cfi;
            if (currentLoc) handleLocationChange(currentLoc);
        }
    }, [fontFamily, theme, fontSize, handleLocationChange]);

    const currentReaderStyle = useMemo(() => createReaderStyle(), []);

    const handleTocClick = useCallback((href: string) => {
        setLocation(href);
        setIsTocOpen(false);
    }, []);

    return (
        <div 
            ref={containerRef}
            className={`h-full w-full relative overflow-hidden rounded-md border transition-colors flex flex-col ${className || ""}`}
            style={{ 
                backgroundColor: themeConfig.bg, 
                borderColor: themeConfig.uiBorder,
                ['--reader-bg' as any]: themeConfig.bg,
                ['--reader-ui-fg' as any]: themeConfig.uiFg,
                ['--reader-ui-border' as any]: themeConfig.uiBorder,
            }}
        >
            {/* Custom Header Controls */}
            <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
                <div className="pointer-events-auto">
                    <Sheet open={isTocOpen} onOpenChange={setIsTocOpen}>
                        <SheetTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 backdrop-blur-sm transition-all border bg-background/50 rounded-md"
                                style={{ 
                                    color: themeConfig.uiFg, 
                                    borderColor: themeConfig.uiBorder 
                                }}
                            >
                                <List className="h-5 w-5" />
                                <span className="sr-only">Table of Contents</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0 flex flex-col border-r transition-colors" style={{ backgroundColor: themeConfig.tocBg, borderColor: themeConfig.uiBorder }} container={containerRef.current}>
                            <SheetHeader className="p-4 border-b" style={{ borderColor: themeConfig.uiBorder }}>
                                <SheetTitle style={{ color: themeConfig.fg }}>Table of Contents</SheetTitle>
                                <SheetDescription className="sr-only">
                                    Browse the sections and chapters of the book.
                                </SheetDescription>
                            </SheetHeader>
                            <ScrollArea className="flex-1">
                                <div className="p-2 space-y-1">
                                    {toc.map((item, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleTocClick(item.href)}
                                            className="w-full text-left px-4 py-2 text-sm rounded-md transition-colors truncate"
                                            style={{ 
                                                paddingLeft: `${(item.level || 0) * 12 + 16}px`,
                                                color: themeConfig.fg,
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = themeConfig.uiBorder;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                            }}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </ScrollArea>
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="pointer-events-auto flex items-center gap-2">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 backdrop-blur-sm transition-all border bg-background/50 rounded-md"
                        style={{ 
                            color: themeConfig.uiFg, 
                            borderColor: themeConfig.uiBorder 
                        }}
                        onClick={toggleFullscreen}
                    >
                        {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                        <span className="sr-only">Toggle Fullscreen</span>
                    </Button>

                    <EpubSettings
                        themeConfig={themeConfig}
                        portalContainer={containerRef.current}
                    />
                </div>
            </div>

            <div className="flex-1 relative min-h-0">
                {!epubData ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50">
                        <div className="flex flex-col items-center gap-3">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                            <p className="text-sm font-medium animate-pulse text-muted-foreground">Preparing book content...</p>
                        </div>
                    </div>
                ) : (
                    <ReactReader
                        key={`${flow}-data-ready`}
                        url={epubData}
                        location={location}
                        locationChanged={handleLocationChange}
                        tocChanged={(toc: any[]) => setToc(toc)}
                        epubOptions={{
                            flow: flow === 'paginated' ? 'paginated' : 'scrolled',
                            manager: flow === 'paginated' ? 'default' : 'continuous',
                            allowScriptedContent: true,
                        }}
                        getRendition={getRendition}
                        readerStyles={currentReaderStyle}
                        swipeable={flow === 'paginated'}
                        showToc={false}
                    />
                )}
            </div>

            {/* Progress Bar & Status */}
            <div 
                className="h-10 border-t flex items-center justify-between px-6 transition-colors z-10"
                style={{ backgroundColor: themeConfig.bg, borderColor: themeConfig.uiBorder }}
            >
                <div className="flex items-center gap-4 flex-1">
                    <div className="flex-1 h-1.5 bg-muted/30 rounded-full overflow-hidden relative">
                        <div 
                            className={`absolute inset-y-0 left-0 transition-all duration-300 ease-out rounded-full ${isCalculating ? 'animate-pulse opacity-50' : ''}`}
                            style={{ 
                                width: isCalculating ? '100%' : `${progress}%`, 
                                backgroundColor: themeConfig.uiFg.replace('0.4', '0.8')
                            }}
                        />
                    </div>
                </div>
                
                <div className="ml-4 flex items-center gap-3 text-[11px] font-bold tracking-widest uppercase opacity-80" style={{ color: themeConfig.fg }}>
                    {isCalculating ? (
                        <span className="animate-pulse italic">Processing...</span>
                    ) : (
                        <>
                            {totalPages > 0 && (
                                <span>Page {currentPage} / {totalPages}</span>
                            )}
                            <span className="w-10 text-right">{progress}%</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
