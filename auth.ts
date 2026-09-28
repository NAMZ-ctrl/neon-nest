import "dotenv/config";

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/db/db";
import { compareSync } from "bcrypt-ts";

export const { auth, signIn, signOut, handlers } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/log-in",
  },
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "hello@example.com",
        },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        // Handle Auth

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password,
          );
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
            };
          }
        }
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    redirect: async ({ url, baseUrl }) => {
      // allows relative urls
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // allows callbacks
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    session: async ({ session, token, user }) => {
      session.userId = token.id as string;
      return session;
    },
    jwt: ({ token, user }) => {
      if (user) {
        return {
          ...token,
          id: user.id,
        };
      }
      return token;
    },
  },
});
