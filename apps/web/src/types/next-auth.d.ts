import { User } from './schema';
import { AuthToken } from './api';
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
    interface Session {
        user: User;
        accessToken: string;
        refreshToken: string;
        error?: 'RefreshAccessTokenError';
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        user: User;
        accessToken: string;
        refreshToken: string;
        expiresAt: number;
        error?: 'RefreshAccessTokenError';
    }
}
