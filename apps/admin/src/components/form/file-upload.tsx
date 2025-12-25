import { Upload } from "lucide-react";
import React, { useRef, useState } from "react";
import { FileItem } from "./file-item";

interface FileUploadProps {
    value?: File[];
    onChange: (files: File[]) => void;
    label?: string;
    maxSizeMB?: number;
    accept?: string;
    multiple?: boolean;
}

export function FileUpload({
    value = [],
    onChange,
    label = "Upload file(s)",
    maxSizeMB = 10,
    accept = "*",
    multiple = true,
}: FileUploadProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [fileProgresses, setFileProgresses] = useState<Record<string, number>>({});

    const handleBoxClick = () => fileInputRef.current?.click();

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files) {
            handleFileSelect(e.dataTransfer.files);
        }
    };

    const handleFileSelect = (files: FileList | null) => {
        if (!files) return;
        const validFiles: File[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.size > maxSizeMB * 1024 * 1024) {
                alert(`File "${file.name}" is too large (max ${maxSizeMB}MB)`);
                continue;
            }
            validFiles.push(file);
        }
        const newFiles = multiple ? [...value, ...validFiles] : validFiles.slice(0, 1);
        onChange(newFiles);

        // Simulate upload progress
        validFiles.forEach((file) => {
            setFileProgresses((prev) => ({ ...prev, [file.name]: 0 }));
            const interval = setInterval(() => {
                setFileProgresses((prev) => {
                    const next = (prev[file.name] || 0) + 10;
                    if (next >= 100) {
                        clearInterval(interval);
                        return { ...prev, [file.name]: 100 };
                    }
                    return { ...prev, [file.name]: next };
                });
            }, 100);
        });
    };

    const removeFile = (filename: string) => {
        const newFiles = value.filter((file) => file.name !== filename);
        onChange(newFiles);
        setFileProgresses((prev) => {
            const copy = { ...prev };
            delete copy[filename];
            return copy;
        });
    };

    return (
        <div className="px-4">
            <div
                className="border-2 border-dashed border-border rounded-md p-8 flex flex-col items-center justify-center text-center cursor-pointer"
                onClick={handleBoxClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <div className="mb-2 bg-muted rounded-full p-3">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-sm text-muted-foreground mt-1">
                    or,{" "}
                    <label
                        htmlFor="fileUpload"
                        className="text-primary hover:text-primary/90 font-medium cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                    >
                        click to browse
                    </label>{" "}
                    ({maxSizeMB}MB max)
                </p>
                <input
                    type="file"
                    id="fileUpload"
                    ref={fileInputRef}
                    className="hidden"
                    accept={accept}
                    multiple={multiple}
                    onChange={(e) => handleFileSelect(e.target.files)}
                />
            </div>
            {/* Danh sách file upload */}
            {value.length > 0 && (
                <div className="space-y-3 mt-4">
                    {value.map((file) => (
                        <FileItem
                            key={file.name}
                            file={file}
                            progress={fileProgresses[file.name] || 0}
                            onDelete={() => removeFile(file.name)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}