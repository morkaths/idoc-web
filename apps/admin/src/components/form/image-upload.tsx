import { Upload, X } from "lucide-react";
import React, { useRef, useState } from "react";

interface ImageUploadProps {
  value?: string;
  onChange: (file: File | null, previewUrl?: string) => void;
  label?: string;
  maxSizeMB?: number;
}

export function ImageUpload({
  value,
  onChange,
  label = "Upload an image",
  maxSizeMB = 4,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | undefined>(value);

  const handleBoxClick = () => fileInputRef.current?.click();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File size must be less than ${maxSizeMB}MB`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      onChange(file, e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(undefined);
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="px-4">
      <div
        className={`border-2 border-dashed border-border p-2 rounded-md flex flex-col items-center justify-center text-center cursor-pointer relative ${
          preview ? "p-2" : "px-4 py-6"
        }`}
        onClick={handleBoxClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="relative w-31 h-43">
            <img
              src={preview}
              alt="Preview"
              className="object-cover w-full h-full rounded-md border"
            />
            <button
              type="button"
              className="absolute top-1.5 right-1.5 bg-white/30 hover:bg-red-200 rounded-full p-1 shadow"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              aria-label="Remove image"
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        ) : (
          <>
            <div className="mb-2 bg-muted rounded-full p-3">
              <Upload className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-sm text-muted-foreground mt-1">
              <span className="text-primary font-medium cursor-pointer">Click to upload</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">({maxSizeMB}MB max)</p>
          </>
        )}
        <input
          type="file"
          id="imageUpload"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
      </div>
    </div>
  );
}