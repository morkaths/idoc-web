// UploadedFileItem.tsx
import { File as IFile } from "@/types";
import { FileArchive, FileCode, FilePlay, FileText, Sheet, Trash2 } from "lucide-react";

export function FileItem({
    file,
    progress = 100,
    onDelete,
}: {
    file: IFile | File;
    progress?: number;
    onDelete?: () => void;
}) {
    const url = file instanceof File ? URL.createObjectURL(file) : file.url;
    const size = file.size;
    const name = file instanceof File ? file.name : file.originalname;
    const ext = name.split('.').pop()?.toLowerCase() || "";

    function getFileIcon(ext: string) {
        switch (ext) {
            case "xls":
            case "xlsx":
                return <Sheet className="w-4 h-4 text-green-500" />;
            case "zip":
            case "rar":
                return <FileArchive className="w-4 h-4 text-yellow-500" />;
            case "png":
            case "jpg":
            case "jpeg":
            case "gif":
            case "mp4":
            case "mov":
            case "avi":
            case "mp3":
            case "wav":
                return <FilePlay className="w-4 h-4 text-indigo-500" />;
            case "js":
            case "ts":
            case "json":
            case "html":
            case "css":
                return <FileCode className="w-4 h-4 text-orange-500" />;
            default:
                return <FileText className="w-4 h-4 text-muted-foreground" />;
        }
    }

    return (
        <div className="border border-border rounded-lg p-2" key={name}>
            <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 bg-muted rounded-sm flex items-center justify-center overflow-hidden">
                    {getFileIcon(ext)}
                </div>
                <div className="flex-1 min-w-0 flex items-center">
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-primary underline truncate max-w-60"
                    >
                        {name}
                    </a>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {Math.round(size / 1024)} KB
                    </span>
                </div>
                {onDelete && (
                    <button
                        type="button"
                        className="bg-transparent hover:text-red-500"
                        onClick={onDelete}
                        aria-label="Remove file"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
            <div className="flex items-center gap-2 mt-2">
                <div className="h-2 bg-muted rounded-full overflow-hidden flex-1">
                    <div
                        className="h-full bg-primary transition-all"
                        style={{
                            width: `${progress}%`,
                        }}
                    ></div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap min-w-8 text-right">
                    {Math.round(progress)}%
                </span>
            </div>
        </div>
    );
}