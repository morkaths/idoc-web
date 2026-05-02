import { type UserResponse } from '@repo/types';
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
    interface Session {
        user?: UserResponse;
        accessToken?: string;
        refreshToken?: string;
        error?: 'RefreshAccessTokenError' | 'InvalidCredentials' | string;
        [key: string]: unknown;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        user?: UserResponse;
        accessToken?: string;
        refreshToken?: string;
        expiresAt?: number;
        error?: 'RefreshAccessTokenError' | 'InvalidCredentials' | string;
        [key: string]: unknown;
    }
}
