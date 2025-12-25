/**
 * Centralized env access for both Vite (browser) and Node (server)
 * - Use VITE_ prefix for client-side build-time vars
 * - Prefer ENV.* throughout the app to avoid direct import.meta.env usage
 */
type EnvVars = Record<string, string | undefined>;

function getRawEnv(): EnvVars {
  if (typeof process !== 'undefined' && typeof process.env !== 'undefined') {
    return process.env as EnvVars;
  }
  return import.meta.env as EnvVars;
}

const raw = getRawEnv();

// Normalized flags
export const DEV = raw.VITE_MODE === 'development';
export const PROD = !DEV;

export const BASE_URL: string = raw.VITE_BASE_URL ?? 'http://localhost:5173';
export const API_URL: string = raw.VITE_API_URL ?? 'http://localhost:8000/api';
export const API_KEY: string | undefined = raw.VITE_API_KEY ?? undefined;
export const TOKEN_COOKIE_KEY: string = raw.VITE_TOKEN_COOKIE_KEY ?? 'authtoken';
export const USER_COOKIE_KEY: string = raw.VITE_USER_COOKIE_KEY ?? 'authuser';

export function getEnv(key: string, fallback?: string): string | undefined {
  return raw[key] ?? fallback;
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