/**
 * Centralized env access for both Next.js (browser) and Node (server)
 * - Use NEXT_PUBLIC_ prefix for client-side build-time vars
 * - Prefer ENV.* throughout the app to avoid direct process.env usage
 */
type EnvVars = Record<string, string | undefined>;

function getRawEnv(): EnvVars {
  if (typeof process !== 'undefined' && typeof process.env !== 'undefined') {
    return process.env as EnvVars;
  }
  return {};
}

const raw = getRawEnv();

// Normalized flags
export const DEV = raw.NEXT_PUBLIC_MODE === 'development';
export const PROD = !DEV;

export const BASE_URL: string = raw.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
export const API_URL: string = raw.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';
export const API_KEY: string | undefined = raw.NEXT_PUBLIC_API_KEY ?? undefined;
export const TOKEN_COOKIE_KEY: string = raw.NEXT_PUBLIC_TOKEN_COOKIE_KEY ?? 'authtoken';
export const USER_COOKIE_KEY: string = raw.NEXT_PUBLIC_USER_COOKIE_KEY ?? 'authuser';

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