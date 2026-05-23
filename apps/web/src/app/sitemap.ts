import env from '@/config/env';
import { locales } from '@/i18n';
import { type MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.app.url;

  const routes = ['', '/books', '/sign-in', '/sign-up'];

  const sitemaps = locales.flatMap((locale: string) =>
    routes.map((route: string) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  );

  return sitemaps;
}
