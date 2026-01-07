import { z } from 'zod';

const isServer = typeof window === 'undefined';

const envSchema = z.object({
  MODE: z.enum(['development', 'production']).default('development'),
  PORT: z.string().default('3000'),
  BASE_URL: z.string().default('http://localhost:3000'),
  API_URL: z.string().default('http://localhost:8000/api'),
  API_KEY: z.string().optional(),
  TOKEN_COOKIE_KEY: z.string().default('authtoken'),
  USER_COOKIE_KEY: z.string().default('authuser'),
  AUTH_SECRET: isServer ? z.string().min(1, 'AUTH_SECRET is required') : z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
  GOOGLE_CLIENT_SECRET: isServer ? z.string().min(1, 'GOOGLE_CLIENT_SECRET is required') : z.string().optional(),
});

const processEnv = {
  MODE: process.env.NEXT_PUBLIC_MODE,
  PORT: process.env.NEXT_PUBLIC_PORT,
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  API_KEY: process.env.NEXT_PUBLIC_API_KEY,
  TOKEN_COOKIE_KEY: process.env.NEXT_PUBLIC_TOKEN_COOKIE_KEY,
  USER_COOKIE_KEY: process.env.NEXT_PUBLIC_USER_COOKIE_KEY,
  AUTH_SECRET: process.env.AUTH_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
};

const parsed = envSchema.safeParse(processEnv);

if (!parsed.success) {
  console.error('[ENV] Invalid Environment Variables:');
  const formattedError = parsed.error.format();
  Object.entries(formattedError).forEach(([key, value]) => {
    if (key !== '_errors' && value && '_errors' in value) {
      console.error(`   [${key}]: ${value._errors.join(', ')}`);
    }
  });

  if (isServer) {
    if (typeof process !== 'undefined' && process.exit) {
      process.exit(1);
    } else {
      throw new Error('Invalid Environment Variables');
    }
  }
}

const _env = parsed.success ? parsed.data : (processEnv as unknown as z.infer<typeof envSchema>);
export const env = {
  app: {
    mode: _env.MODE,
    port: _env.PORT,
    url: _env.BASE_URL,
  },
  api: {
    url: _env.API_URL,
    key: _env.API_KEY,
  },
  cookie: {
    token: _env.TOKEN_COOKIE_KEY,
    user: _env.USER_COOKIE_KEY,
  },
  auth: {
    secret: _env.AUTH_SECRET,
    google: {
      clientId: _env.GOOGLE_CLIENT_ID,
      clientSecret: _env.GOOGLE_CLIENT_SECRET,
    },
  },
};

export default env;