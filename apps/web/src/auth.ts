import NextAuth, { NextAuthConfig, CredentialsSignin } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import env from "@/config/env";
import { AuthApi } from "@/apis/auth.api";
import { AuthenticationResponse } from "@repo/types";

/**
 * Extracts the refresh token from the API response payload or set-cookie headers.
 * @param data The authentication response data
 * @param headers The response headers
 * @returns The refresh token if found, otherwise undefined
 */
const extractRefreshToken = (data: AuthenticationResponse, headers?: Record<string, string | string[]>): string | undefined => {
  if (data.token.refreshToken) return data.token.refreshToken;
  
  if (headers && headers['set-cookie']) {
    const cookiesArr = Array.isArray(headers['set-cookie']) ? headers['set-cookie'] : [headers['set-cookie']];
    const rtCookie = cookiesArr.find((c: string) => c.toLowerCase().includes('refreshtoken='));
    if (rtCookie) return rtCookie.split(';')[0]?.split('=')[1];
  }
  
  return undefined;
};

export const authConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const response = await AuthApi.login({
            identifier: credentials.email as string,
            password: credentials.password as string,
          });

          if (response && response.success && response.data) {
            const { data, headers } = response;
            const refreshToken = extractRefreshToken(data, headers);

            return {
              ...data.user,
              accessToken: data.token.accessToken,
              accessTokenExpiresIn: data.token.accessTokenExpiresIn,
              refreshToken: refreshToken,
            };
          }
          throw new CredentialsSignin();
        } catch (error) {
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
      if (token && token.user) {
        session.user = { ...session.user, ...token.user as any };
        session.accessToken = token.accessToken as string;
        session.error = token.error as string;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "google") {
          const response = await AuthApi.loginGoogle(account.id_token!).catch(() => null);

          if (response && response.success && response.data) {
            const { data, headers } = response;
            const refreshToken = extractRefreshToken(data, headers);

            return {
              ...token,
              user: data.user,
              accessToken: data.token.accessToken,
              refreshToken: refreshToken,
              expiresAt: Date.now() + (data.token.accessTokenExpiresIn * 1000),
              error: undefined,
            };
          }
          return null;
        }
        return {
          ...token,
          user: user,
          accessToken: (user as any).accessToken,
          refreshToken: (user as any).refreshToken,
          expiresAt: Date.now() + ((user as any).accessTokenExpiresIn * 1000),
          error: undefined,
        };
      }

      // Return previous token if the access token has not expired yet
      if (token.expiresAt && Date.now() < (token.expiresAt as number)) {
        return token;
      }

      // Access token has expired, try to update it
      try {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        const refreshTokenToUse = (token.refreshToken as string) || cookieStore.get(env.cookie.refreshToken)?.value;

        if (!refreshTokenToUse) {
          return { ...token, error: "RefreshAccessTokenError", accessToken: undefined };
        }

        const result = await AuthApi.refresh(refreshTokenToUse);
        if (!result || !result.success || !result.data) {
          return { ...token, error: "RefreshAccessTokenError", accessToken: undefined };
        }

        const { data, headers } = result;
        const newRefreshToken = extractRefreshToken(data, headers);

        try {
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

          if (newRefreshToken) {
            cookieStore.set(env.cookie.refreshToken, newRefreshToken, {
              ...cookieOptions,
              maxAge: data.token.refreshTokenExpiresIn,
            });
          }
        } catch (e) {
          // Ignore cookie errors on server side background refresh if runtime limits it
        }

        return {
          ...token,
          accessToken: data.token.accessToken,
          refreshToken: newRefreshToken || (token.refreshToken as string),
          expiresAt: Date.now() + (data.token.accessTokenExpiresIn * 1000),
          error: undefined,
        };
      } catch (error) {
        console.error("[Auth] Refresh token failed:", error);
        return { ...token, error: "RefreshTokenError" };
      }
    }
  },
  session: { strategy: "jwt" },
  secret: env.auth.secret,
} satisfies NextAuthConfig;

const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export { handlers, auth, signIn, signOut };