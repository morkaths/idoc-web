import { FileImage, FileText, Film } from 'lucide-react';

export const DEFAULT_CLOUDINARY_LIMITS = {
  STORAGE: 1_073_741_824,
  BANDWIDTH: 1_073_741_824,
  TRANSFORMATIONS: 500,
  REQUESTS: 10000,
  CREDITS: 25,
  IMAGE_MAX_SIZE: 10_485_760,
  VIDEO_MAX_SIZE: 104_857_600,
} as const;

export const FILE_CATEGORIES_CONFIG = [
  {
    id: 'documents',
    label: 'Documents (PDF, EPUB, TXT)',
    icon: FileText,
    iconColor: 'text-red-500',
    barColor: 'bg-red-500',
  },
  {
    id: 'images',
    label: 'Images (PNG, JPG, WebP)',
    icon: FileImage,
    iconColor: 'text-blue-500',
    barColor: 'bg-blue-500',
  },
  {
    id: 'sheets',
    label: 'Sheets (CSV, XLSX)',
    icon: FileText,
    iconColor: 'text-green-500',
    barColor: 'bg-green-500',
  },
  {
    id: 'media',
    label: 'Media (MP4, MP3, WAV)',
    icon: Film,
    iconColor: 'text-purple-500',
    barColor: 'bg-purple-500',
  },
  {
    id: 'others',
    label: 'Others',
    icon: FileText,
    iconColor: 'text-muted-foreground',
    barColor: 'bg-muted-foreground',
  },
] as const;
