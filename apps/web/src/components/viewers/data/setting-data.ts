export type Theme = 'light' | 'dark' | 'sepia' | 'mint';
export type Flow = 'paginated' | 'scrolled';

export interface FontOption {
  value: string;
  label: string;
}

export interface ThemeOption {
  value: Theme;
  label: string;
  bg: string; // Nền chính của trình đọc
  fg: string; // Màu chữ nội dung
  uiFg: string; // Màu icon/nút (rgba)
  uiBorder: string; // Màu viền UI (rgba)
  tocBg: string; // Nền mục lục
}

export interface FlowOption {
  value: Flow;
  label: string;
}

export const EPUB_FONTS: FontOption[] = [
  { value: 'Origin', label: 'Origin' },
  { value: 'Literata', label: 'Literata (Premium)' },
  { value: 'EB Garamond', label: 'EB Garamond' },
  { value: 'Lora', label: 'Lora' },
  { value: 'Merriweather', label: 'Merriweather' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Lexend', label: 'Lexend (Easy)' },
  { value: 'Playfair Display', label: 'Playfair' },
  { value: 'OpenDyslexic', label: 'OpenDyslexic' },
];

export const EPUB_THEMES: ThemeOption[] = [
  {
    value: 'light',
    label: 'Light',
    bg: '#ffffff',
    fg: '#18181b',
    uiFg: 'rgba(24, 24, 27, 0.4)',
    uiBorder: 'rgba(24, 24, 27, 0.08)',
    tocBg: '#ffffff',
  },
  {
    value: 'sepia',
    label: 'Sepia',
    bg: '#f5deb3',
    fg: '#5d4037',
    uiFg: 'rgba(93, 64, 55, 0.4)',
    uiBorder: 'rgba(93, 64, 55, 0.1)',
    tocBg: '#faebd7',
  },
  {
    value: 'dark',
    label: 'Dark',
    bg: '#18181b',
    fg: '#e4e4e7',
    uiFg: 'rgba(228, 228, 231, 0.4)',
    uiBorder: 'rgba(228, 228, 231, 0.1)',
    tocBg: '#18181b',
  },
  {
    value: 'mint',
    label: 'Mint',
    bg: '#e8f5e9',
    fg: '#2e7d32',
    uiFg: 'rgba(46, 125, 50, 0.4)',
    uiBorder: 'rgba(46, 125, 50, 0.1)',
    tocBg: '#f1f8e9',
  },
];

export const EPUB_FLOWS: FlowOption[] = [
  { value: 'paginated', label: 'Paginated' },
  { value: 'scrolled', label: 'Scrolled' },
];
