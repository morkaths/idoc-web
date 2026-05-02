import NextAuth, { type NextAuthConfig, CredentialsSignin } from "next-auth";
import Google from "next-auth/providers/google";
import { type JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import env from "@/config/env";
import { AuthApi } from "@/apis/auth.api";
import { type AuthResponse } from "@repo/types";

const extractRefreshToken = (data: AuthResponse, headers?: Record<string, string | string[]>): string | undefined => {
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
            email: credentials.email as string,
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
      if (token && token.user) {
        session.user = { ...session.user, ...(token.user as unknown as Record<string, unknown>) };
        session.accessToken = token.accessToken as string;
        session.error = token.error as string;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "google") {
          const response = await AuthApi.loginGoogle({
            token: account.id_token!,
            provider: 'google',
          }).catch(() => null);

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
            } as JWT;
          }
          return null;
        }
        return {
          ...token,
          user: user,
          accessToken: (user as Record<string, unknown>).accessToken as string,
          refreshToken: (user as Record<string, unknown>).refreshToken as string,
          expiresAt: Date.now() + (((user as Record<string, unknown>).accessTokenExpiresIn as number) * 1000),
          error: undefined,
        } as JWT;
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
          return { ...token, error: "RefreshAccessTokenError", accessToken: undefined } as JWT;
        }

        const result = await AuthApi.refresh();
        if (!result || !result.success || !result.data) {
          return { ...token, error: "RefreshAccessTokenError", accessToken: undefined } as JWT;
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
        } catch (_e) {
          // Ignore cookie errors on server side background refresh if runtime limits it
        }

        return {
          ...token,
          accessToken: data.token.accessToken,
          refreshToken: newRefreshToken || (token.refreshToken as string),
          expiresAt: Date.now() + (data.token.accessTokenExpiresIn * 1000),
          error: undefined,
        } as JWT;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("[Auth] Refresh token failed:", error);
        return { ...token, error: "RefreshTokenError" } as JWT;
      }
    }
  },
  session: { strategy: "jwt" },
  secret: env.auth.secret,
} satisfies NextAuthConfig;

const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export { handlers, auth, signIn, signOut };
