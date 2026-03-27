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
            const returnedData = {
              ...result.user,
              accessToken: result.token.accessToken,
              refreshToken: result.token.refreshToken,
              accessTokenExpiresIn: result.token.accessTokenExpiresIn,
            };
            return returnedData as any;
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
          const response = await AuthApi.loginGoogle(account.id_token!).catch((err) => {
            return null;
          });

          if (response && response.token) {
            return {
              ...token,
              user: response.user as any,
              accessToken: response.token.accessToken,
              refreshToken: response.token.refreshToken,
              expiresAt: Date.now() + (response.token.accessTokenExpiresIn * 1000),
              error: undefined,
            };
          }
          return null;
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
      if (token.expiresAt && Date.now() < token.expiresAt) {
        return token;
      }

      // Access token has expired, try to update it
      try {
        const result = await AuthApi.refresh(token.refreshToken as string);
        if (!result || !result.token) {
          return null;
        }
        return {
          ...token,
          accessToken: result.token.accessToken,
          refreshToken: result.token.refreshToken,
          expiresAt: Date.now() + (result.token.accessTokenExpiresIn * 1000),
          error: undefined,
        };
      } catch (error) {
        console.error("[Auth] Refresh token failed with exception:", error);
        return null;
      }
    }
  },
  session: { strategy: "jwt" },
  secret: env.auth.secret,
} satisfies NextAuthConfig;

const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export { handlers, auth, signIn, signOut };