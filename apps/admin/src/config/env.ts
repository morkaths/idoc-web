/**
 * Centralized env access for both Vite (browser) and Node (server)
 * - Use VITE_ prefix for client-side build-time vars
 * - Prefer ENV.* throughout the app to avoid direct import.meta.env usage
 */
const raw =
  typeof process !== 'undefined' && (process as any).env
    ? (process as any).env
    : (import.meta.env as Record<string, any>);

// Normalized flags
export const DEV = raw.VITE_MODE === 'development';
export const PROD = !DEV;

export const BASE_URL: string = (raw.VITE_BASE_URL ?? 'http://localhost:5173') as string;

export const API_URL: string = (raw.VITE_API_URL ?? 'http://localhost:8000/api') as string;

export const API_KEY: string | undefined = (raw.VITE_API_KEY ?? undefined) as string | undefined;

export function getEnv(key: string, fallback?: string): string | undefined {
  return (raw[key] as string | undefined) ?? fallback;
}

const ENV = {
  raw,
  DEV,
  PROD,
  BASE_URL,
  API_URL,
  API_KEY,
  getEnv,
};

export default ENV;
