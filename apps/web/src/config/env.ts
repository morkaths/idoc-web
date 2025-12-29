
export const DEV = process.env.NEXT_PUBLIC_MODE ?? 'production';
export const PROD = !DEV;

export const BASE_URL: string = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
export const API_URL: string = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';
export const API_KEY: string = process.env.NEXT_PUBLIC_API_KEY ?? 'dev-api-key';
export const TOKEN_COOKIE_KEY: string = process.env.NEXT_PUBLIC_TOKEN_COOKIE_KEY ?? 'authtoken';
export const USER_COOKIE_KEY: string = process.env.NEXT_PUBLIC_USER_COOKIE_KEY ?? 'authuser';

const ENV = {
  DEV,
  PROD,
  BASE_URL,
  API_URL,
  API_KEY,
  TOKEN_COOKIE_KEY,
  USER_COOKIE_KEY,
};

export default ENV;