import 'next-auth/jwt';
import { type UserResponse } from '@repo/types';
import 'next-auth';

declare module 'next-auth' {
  interface User extends UserResponse {
    id: string;
    email: string;
    accessToken?: string;
    accessTokenExpiresIn?: number;
    emailVerified: Date | null;
    bookmarks?: any[];
  }

  interface Session {
    user?: User;
    accessToken?: string;
    error?: 'RefreshAccessTokenError' | 'InvalidCredentials' | string;
    [key: string]: unknown;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user?: User;
    accessToken?: string;
    expiresAt?: number;
    error?: 'RefreshAccessTokenError' | 'InvalidCredentials' | string;
    [key: string]: unknown;
  }
}
