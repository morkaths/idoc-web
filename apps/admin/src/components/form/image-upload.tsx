import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (file: File | null, previewUrl?: string) => void;
  label?: string;
  maxSizeMB?: number;
}

export function ImageUpload({
  value,
  onChange,
  label = 'Upload an image',
  maxSizeMB = 4,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | undefined>(value);

  // Sync preview with value when value changes (e.g., form reset or initial data load)
  React.useEffect(() => {
    setPreview(value);
  }, [value]);

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

    // Use object URL for preview instead of base64 to avoid long strings
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    onChange(file, previewUrl);
  };

  const handleRemove = () => {
    // If it's a blob URL, we should revoke it
    if (preview?.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setPreview(undefined);
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className='px-4'>
      <div
        className={`border-border relative flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-2 text-center ${
          preview ? 'p-2' : 'px-4 py-6'
        }`}
        onClick={handleBoxClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className='relative h-43 w-31'>
            <img
              src={preview}
              alt='Preview'
              className='h-full w-full rounded-md border object-cover'
            />
            <button
              type='button'
              className='absolute top-1.5 right-1.5 rounded-full bg-white/30 p-1 shadow hover:bg-red-200'
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              aria-label='Remove image'
            >
              <X className='h-4 w-4 text-red-500' />
            </button>
          </div>
        ) : (
          <>
            <div className='bg-muted mb-2 rounded-full p-3'>
              <Upload className='text-muted-foreground h-5 w-5' />
            </div>
            <p className='text-sm font-medium'>{label}</p>
            <p className='text-muted-foreground mt-1 text-sm'>
              <span className='text-primary cursor-pointer font-medium'>Click to upload</span>
            </p>
            <p className='text-muted-foreground mt-1 text-xs'>({maxSizeMB}MB max)</p>
          </>
        )}
        <input
          type='file'
          id='imageUpload'
          ref={fileInputRef}
          className='hidden'
          accept='image/*'
          onChange={(e) => handleFileSelect(e.target.files)}
        />
      </div>
    </div>
  );
}
