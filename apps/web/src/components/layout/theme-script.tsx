'use client';

import type { ThemePreset } from '@/types';
import { themeConfig } from './data/theme-data';

export function ThemeScript({ theme }: { theme: ThemePreset }) {
  const scriptContent = `
    try {
      var mode = document.cookie.match(/idoc_web_mode=([^;]+)/)?.[1] || '${themeConfig.defaults.mode}';
      if (mode === 'system') {
        mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }

      var root = document.documentElement;
      if (mode === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');

      var theme = ${JSON.stringify(theme)};
      if (theme) {
        var styles = mode === 'dark' ? theme.styles.dark : theme.styles.light;
        for (var key in styles) {
          if (key !== 'radius' && key !== 'font-sans') {
            root.style.setProperty('--' + key, styles[key]);
          }
        }
      }
    } catch (e) {
      console.error('Theme initialization failed', e);
    }
  `;

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: scriptContent,
      }}
    />
  );
}
