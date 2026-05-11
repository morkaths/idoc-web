import { z } from 'zod';

const envSchema = z.object({
  VITE_MODE: z.enum(['development', 'production']).default('development'),
  VITE_PORT: z.string().default('3001'),
  VITE_BASE_URL: z.string().default('http://localhost:3001/admin'),
  VITE_API_URL: z.string().default('http://localhost:8000/api'),
  VITE_API_KEY: z.string().optional(),
  VITE_AGENT_URL: z.string().default('http://localhost:5000/api/v1'),
  VITE_TOKEN_COOKIE_KEY: z.string().default('authtoken'),
  VITE_USER_COOKIE_KEY: z.string().default('authuser'),
});

// Safely get environment variables
const getEnv = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env;
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env;
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
  if (typeof process !== 'undefined' && process.exit) {
    process.exit(1);
  } else {
    throw new Error('Invalid Environment Variables');
  }
}

const _env = parsed.data;
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
  agent: {
    url: _env.VITE_AGENT_URL,
  },
  cookie: {
    token: _env.VITE_TOKEN_COOKIE_KEY,
    user: _env.VITE_USER_COOKIE_KEY,
  },
};

export default env;
