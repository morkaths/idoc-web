import { z } from 'zod';

const isServer = typeof window === 'undefined';

const envSchema = z.object({
  NEXT_PUBLIC_MODE: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_PORT: z.string().default('3000'),
  NEXT_PUBLIC_BASE_URL: z.string().default('http://localhost:3000'),
  NEXT_PUBLIC_API_URL: z.string().default('http://localhost:5000/api/v1'),
  NEXT_PUBLIC_API_KEY: z.string().optional(),
  NEXT_PUBLIC_TOKEN_COOKIE_KEY: z.string().default('idoc_authtoken'),
  NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_KEY: z.string().default('idoc_refreshtoken'),
  NEXT_PUBLIC_USER_COOKIE_KEY: z.string().default('idoc_authuser'),
  AUTH_SECRET: isServer ? z.string().min(1) : z.string().optional(),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: isServer ? z.string().min(1) : z.string().optional(),
});

const processEnv = {
  NEXT_PUBLIC_MODE: process.env.NEXT_PUBLIC_MODE,
  NEXT_PUBLIC_PORT: process.env.NEXT_PUBLIC_PORT,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
  NEXT_PUBLIC_TOKEN_COOKIE_KEY: process.env.NEXT_PUBLIC_TOKEN_COOKIE_KEY,
  NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_KEY: process.env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_KEY,
  NEXT_PUBLIC_USER_COOKIE_KEY: process.env.NEXT_PUBLIC_USER_COOKIE_KEY,
  AUTH_SECRET: process.env.AUTH_SECRET,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};

const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('[ENV] Invalid Environment Variables:');
  const formattedError = parsed.error.format();
  Object.entries(formattedError).forEach(([key, value]) => {
    if (key !== '_errors' && value && '_errors' in value) {
      // eslint-disable-next-line no-console
      console.error(`   [${key}]: ${value._errors.join(', ')}`);
    }
  });
  throw new Error('Invalid Environment Variables');
}

const _env = parsed.data;

export const env = {
  app: {
    mode: _env.NEXT_PUBLIC_MODE,
    port: _env.NEXT_PUBLIC_PORT,
    url: _env.NEXT_PUBLIC_BASE_URL,
  },
  api: {
    url: _env.NEXT_PUBLIC_API_URL,
    key: _env.NEXT_PUBLIC_API_KEY,
  },
  cookie: {
    accessToken: _env.NEXT_PUBLIC_TOKEN_COOKIE_KEY,
    refreshToken: _env.NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_KEY,
    user: _env.NEXT_PUBLIC_USER_COOKIE_KEY,
  },
  auth: {
    secret: _env.AUTH_SECRET,
    oauth: {
      google: {
        clientId: _env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        clientSecret: _env.GOOGLE_CLIENT_SECRET,
      },
    },
  },
};

export default env;
