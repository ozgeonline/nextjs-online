import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./db";

import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { AdapterAccount, AdapterUser } from "next-auth/adapters";

export const authOptions = {
  //adapter: PrismaAdapter(prisma),

  adapter: {
    ...PrismaAdapter(prisma),
    async getUserByAccount(account: Pick<AdapterAccount, "providerAccountId" | "provider">): Promise<AdapterUser | null> {
      const result = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            providerId: account.provider,
            providerAccountId: account.providerAccountId,
          },
        },
        select: {
          user: true,
        },
      });

      // Flatten the user object to match the AdapterUser type
      return result?.user?.email ? { ...result.user, email: result.user.email! } : null;
    }
  },
  // pages: {
  //   signIn: '/sign-up',       // Custom sign-in page
  //   //error: '',   // Error page
  //   // newUser: '/home',       // Redirect new users to /home
  // },
  callbacks: {
    async signIn({ account, profile, email }) {
      if(!profile?.email) return false;
      console.log("Account:", account);
      console.log("Profile:", profile);
      return true;
    },
    async session({ session, user }) {
      console.log("Session:", session);
      console.log("User:", user);
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs (e.g., /home or /dashboard)
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      // Fallback to baseUrl if none of the above conditions are met
      return baseUrl;
    },
    async jwt({ token, account }) {
      console.log("JWT Token:", token);
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  
  // session: {
  //   strategy:"database",
  //   maxAge: 30 * 24 * 60 * 60, 
  //   updateAge: 24 * 60 * 60,
  // },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid profile email",

        }
      },
      // profile(profile) {
      //   //console.log("Google Profile:", profile);
      //   return {
      //     id: profile.sub,
      //     name: profile.name,
      //     email: profile.email,
      //     image: profile.picture,
      //   };
      // },
      accessTokenUrl: process.env.NEXTAUTH_URL,
    }),

    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      from: process.env.EMAIL_FROM
    }),
  ],
  secret: process.env.AUTH_SECRET,

  debug: true
  // debug: process.env.NODE_ENV === "development",
} satisfies NextAuthOptions;