import { z } from 'zod';

const envSchema = z.object({
  VITE_MODE: z.enum(['development', 'production']).default('development'),
  VITE_PORT: z.string().default('3001'),
  VITE_BASE_URL: z.string().default('http://localhost:3001/admin/'),
  VITE_API_URL: z.string().default('http://localhost:8080/api/v1'),
  VITE_API_KEY: z.string().optional(),
  VITE_TOKEN_COOKIE_KEY: z.string().default('authtoken'),
  VITE_USER_COOKIE_KEY: z.string().default('authuser'),
});

interface GlobalProcess {
  env?: Record<string, string>;
  exit?: (code?: number) => void;
}

// Safely get environment variables
const getEnv = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env;
  }
  const globalProcess = typeof globalThis !== 'undefined'
    ? (globalThis as unknown as { process?: GlobalProcess }).process
    : undefined;
  if (globalProcess && globalProcess.env) {
    return globalProcess.env;
  }
  return {};
};

const parsed = envSchema.safeParse(getEnv());

if (!parsed.success) {
  /* eslint-disable no-console */
  console.error('[.ENV] Invalid Environment Variables:');
  const formattedError = parsed.error.format();
  Object.entries(formattedError).forEach(([key, value]) => {
    if (key !== '_errors' && value && '_errors' in value) {
      console.error(`   [${key}]: ${value._errors.join(', ')}`);
    }
  });
  /* eslint-enable no-console */
  const globalProcess = typeof globalThis !== 'undefined'
    ? (globalThis as unknown as { process?: GlobalProcess }).process
    : undefined;
  if (globalProcess && globalProcess.exit) {
    globalProcess.exit(1);
  } else {
    throw new Error('Invalid Environment Variables');
  }
}

const _env = parsed.data!;
export const env = {
  app: {
    mode: _env.VITE_MODE,
    port: _env.VITE_PORT,
    url: _env.VITE_BASE_URL,
  },
  api: {
    url: _env.VITE_API_URL,
    key: _env.VITE_API_KEY,
  },
  cookie: {
    token: _env.VITE_TOKEN_COOKIE_KEY,
    user: _env.VITE_USER_COOKIE_KEY,
  },
};

export default env;
