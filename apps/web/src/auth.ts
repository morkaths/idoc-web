import NextAuth, { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import env from "@/config/env";

export const authConfig = {
  providers: [
    Google({
      clientId: env.auth.google.clientId,
      clientSecret: env.auth.google.clientSecret,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  },
  session: { strategy: "jwt" },
  secret: env.auth.secret,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);