import { z } from 'zod';

/**
 * Zod helper for comma-separated strings (common in URL params)
 */
export const commaSeparatedString = z
  .string()
  .optional()
  .transform((val) => val?.split(',').filter(Boolean))
  .catch(undefined);

/**
 * Zod helper for comma-separated strings that always returns an array
 */
export const commaSeparatedArray = z
  .string()
  .optional()
  .transform((val) => val?.split(',').filter(Boolean) ?? [])
  .catch([]);

/**
 * Zod helper for numeric parameters with robust default and catch logic
 */
export const numericParam = (defaultValue: number) =>
  z.coerce.number().int().positive().default(defaultValue).catch(defaultValue);

/**
 * Generic parser to convert URLSearchParams to a validated object using Zod
 */
export const parseSearchParams = <T>(schema: z.ZodSchema<T>, params: URLSearchParams): T => {
  return schema.parse(Object.fromEntries(params.entries()));
};

/**
 * Helper to build a clean URL query string from an object, filtering out undefined/null values
 */
export const buildQueryString = (params: Record<string, unknown>): string => {
  const p = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        if (value.length > 0) p.set(key, value.join(','));
      } else {
        p.set(key, String(value));
      }
    }
  });

  return p.toString();
};
