import NextAuth, { NextAuthConfig, CredentialsSignin } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import env from "@/config/env";
import { AuthApi } from "@/apis/auth.api";

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
          const result = await AuthApi.login({
            identifier: credentials.email as string,
            password: credentials.password as string,
          });

          if (result && result.user && result.token) {
            return {
              ...result.user,
              accessToken: result.token.accessToken,
              refreshToken: result.token.refreshToken,
              accessTokenExpiresIn: result.token.accessTokenExpiresIn,
            } as any;
          }
          throw new CredentialsSignin();
        } catch (error) {
          throw new CredentialsSignin();
        }
      },
    }),
    Google({
      clientId: env.auth.google.clientId,
      clientSecret: env.auth.google.clientSecret,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user = { ...session.user, ...token.user } as any;
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.error = token.error;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "google") {
          try {
            const backendResponse = await AuthApi.loginGoogle(account.id_token!);
            if (backendResponse && backendResponse.token) {
              return {
                ...token,
                user: backendResponse.user as any,
                accessToken: backendResponse.token.accessToken,
                refreshToken: backendResponse.token.refreshToken,
                expiresAt: Date.now() + (backendResponse.token.accessTokenExpiresIn * 1000),
                error: undefined,
              };
            } else {
              return {
                ...token,
                user: token.user ?? null,
                accessToken: token.accessToken ?? null,
                refreshToken: token.refreshToken ?? null,
                expiresAt: token.expiresAt ?? 0,
                error: "InvalidCredentials" as const,
              };
            }
          } catch (error) {
            console.error("Google verify failed", error);
            return {
              ...token,
              error: "InvalidCredentials" as const,
            };
          }
        }
        return {
          ...token,
          user: user as any,
          accessToken: (user as any).accessToken,
          refreshToken: (user as any).refreshToken,
          expiresAt: Date.now() + ((user as any).accessTokenExpiresIn * 1000),
          error: undefined,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.expiresAt) {
        return token;
      }

      // Access token has expired, try to update it
      try {
        const result = await AuthApi.refresh(token.refreshToken);
        if (!result || !result.token) {
          return {
            ...token,
            error: "InvalidCredentials" as const,
          };
        }
        return {
          ...token,
          accessToken: result.token.accessToken,
          refreshToken: result.token.refreshToken,
          expiresAt: Date.now() + (result.token.accessTokenExpiresIn * 1000),
          error: undefined,
        };
      } catch (error) {
        console.error("Error refreshing access token", error);
        return {
          ...token,
          error: "InvalidCredentials" as const,
        };
      }
    }
  },
  session: { strategy: "jwt" },
  secret: env.auth.secret,
} satisfies NextAuthConfig;

const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export { handlers, auth, signIn, signOut };