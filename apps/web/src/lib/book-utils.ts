/**
 * Goodreads placeholder URL for books without a cover
 * @see https://www.goodreads.com/
 */
const GOODREADS_NOPHOTO_URL = 'gr-assets.com/assets/nophoto';

/**
 * Default fallback image for books without a cover
 */
const DEFAULT_BOOK_COVER_FALLBACK =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"%3E%3Crect fill="%23e2e8f0" width="200" height="300"/%3E%3Ctext x="50%25" y="50%25" font-family="system-ui" font-size="14" fill="%2394a3b8" text-anchor="middle" dominant-baseline="middle"%3ENo Cover%3C/text%3E%3C/svg%3E';

/**
 * Check if a book cover URL is valid (not null/undefined and not a Goodreads placeholder)
 * @param url - The cover URL to validate
 * @returns true if the URL is valid and can be displayed
 */
export const isValidCover = (url: string | undefined | null): boolean =>
  !!url && !url.includes(GOODREADS_NOPHOTO_URL);

/**
 * Get book cover URL with fallback
 * @param url - The book cover URL
 * @returns Valid URL or fallback SVG placeholder
 */
export const getCoverUrl = (url: string | undefined | null): string => {
  return isValidCover(url) ? (url as string) : DEFAULT_BOOK_COVER_FALLBACK;
};

export { GOODREADS_NOPHOTO_URL, DEFAULT_BOOK_COVER_FALLBACK };
