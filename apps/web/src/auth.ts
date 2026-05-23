import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import env from '@/config/env';
import { AuthProvider, type AuthResponse } from '@repo/types';
import NextAuth, { type NextAuthConfig, CredentialsSignin, type User } from 'next-auth';
import { AuthApi } from '@/apis/auth.api';

/**
 * Helper to set auth cookies in the browser.
 */
const setAuthCookies = async (data: AuthResponse) => {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    };

    cookieStore.set(env.cookie.accessToken, data.token.accessToken, {
      ...cookieOptions,
      maxAge: data.token.accessTokenExpiresIn,
    });
  } catch (_error) {
    // Silent catch
  }
};

export const authConfig = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const response = await AuthApi.login({
            email: credentials.email as string,
            password: credentials.password as string,
          });

          if (response?.success && response.data) {
            const { data } = response;
            await setAuthCookies(data);

            return {
              ...data.user,
              id: data.user.id,
              accessToken: data.token.accessToken,
              accessTokenExpiresIn: data.token.accessTokenExpiresIn,
              emailVerified: null,
            };
          }
          throw new CredentialsSignin();
        } catch (_error) {
          throw new CredentialsSignin();
        }
      },
    }),
    Google({
      clientId: env.auth.oauth.google.clientId,
      clientSecret: env.auth.oauth.google.clientSecret,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        const tokenUser = token.user;

        session.user = {
          ...session.user,
          ...(tokenUser || {}),
          id: (token.sub as string) || tokenUser?.id || session.user.id,
          image: tokenUser?.avatar || session.user.image,
          emailVerified: null,
        } as User;

        session.accessToken = token.accessToken as string;
        session.error = token.error as string;
      }
      return session;
    },

    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        const provider = account?.provider?.toUpperCase();

        // Handle OAuth (Google)
        if (provider === AuthProvider.GOOGLE) {
          const idToken = account?.id_token;
          if (!idToken) return null;

          try {
            const response = await AuthApi.loginGoogle({
              token: idToken,
              provider: AuthProvider.GOOGLE,
            });

            if (response?.success && response.data) {
              const { data } = response;
              await setAuthCookies(data);

              return {
                ...token,
                sub: data.user.id,
                user: {
                  ...data.user,
                  emailVerified: null,
                },
                accessToken: data.token.accessToken,
                expiresAt: Date.now() + data.token.accessTokenExpiresIn * 1000,
              };
            }
          } catch (_error) {
            return null;
          }
          return null;
        }

        // Handle Credentials
        return {
          ...token,
          sub: user.id || token.sub,
          user: user,
          accessToken: user.accessToken,
          expiresAt:
            Date.now() + (user.accessTokenExpiresIn ? user.accessTokenExpiresIn * 1000 : 0),
        };
      }

      // Return previous token if the access token has not expired yet (with 1 minute buffer)
      if (token.expiresAt && Date.now() < (token.expiresAt as number) - 60000) {
        return token;
      }

      // Access token has expired, try to refresh it
      try {
        const result = await AuthApi.refresh();
        if (!result?.success || !result.data) {
          return { ...token, error: 'RefreshAccessTokenError', accessToken: undefined };
        }

        const { data } = result;
        await setAuthCookies(data);

        return {
          ...token,
          accessToken: data.token.accessToken,
          expiresAt: Date.now() + data.token.accessTokenExpiresIn * 1000,
          error: undefined,
        };
      } catch (_error) {
        return { ...token, error: 'RefreshAccessTokenError' };
      }
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  secret: env.auth.secret,
} satisfies NextAuthConfig;

const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export { handlers, auth, signIn, signOut };
