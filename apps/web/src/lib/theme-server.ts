import { cookies } from "next/headers";
import { themeColors, themeConfig } from "@/components/layout/data/theme-data";

/**
 * Lấy cấu hình theme từ cookie tại server
 */
export async function getThemeConfig() {
    const cookieStore = await cookies();

    const mode = cookieStore.get('idoc_web_mode')?.value || themeConfig.defaults.mode;
    const colorKey = cookieStore.get('idoc_web_color')?.value || themeConfig.defaults.color;
    const radius = cookieStore.get('idoc_web_radius')?.value || themeConfig.defaults.radius;
    const font = cookieStore.get('idoc_web_font')?.value || themeConfig.defaults.font;

    const theme = themeColors[colorKey] || themeColors[themeConfig.defaults.color];

    if (!theme) {
        throw new Error(`Theme '${colorKey}' not found.`);
    }

    const resolvedMode = mode === 'system' ? 'light' : (mode as 'light' | 'dark');
    const styles = resolvedMode === 'dark' ? theme.styles.dark : theme.styles.light;

    // Tạo object chứa các biến CSS
    const cssVars: Record<string, string> = {};

    Object.entries(styles).forEach(([key, value]) => {
        if (!['radius', 'font-sans', 'font-serif', 'font-mono'].includes(key)) {
            cssVars[`--${key}`] = value as string;
        }
    });

    cssVars['--radius'] = radius;
    cssVars['--font-sans'] = font;

    return {
        mode,
        colorKey,
        radius,
        font,
        theme,
        cssVars,
    };
}
