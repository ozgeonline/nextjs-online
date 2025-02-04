import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./db";

import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { AdapterAccount, AdapterUser } from "next-auth/adapters";

export const authOptions = {
  adapter: {
    ...PrismaAdapter(prisma),
    async getUserByAccount(account: Pick<AdapterAccount, "providerAccountId" | "provider">): Promise<AdapterUser | null> {
      const result = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          },
        },

        select: {
          user: true,
        },
      });

      return result?.user?.email ? { ...result.user, email: result.user.email! } : null;
    }
  },
  // pages: {
  //   signIn: '/sign-up',
  //   error: '',   // Error page
  // },
  callbacks: {
    async signIn({ profile }) {
    //async signIn({ account, profile }) {
      if(!profile?.email) return false;
      // console.log("Account:", account);
      // console.log("Profile:", profile);
      return true;
    },
    async session({ session }) {
    //async session({ session, user }) {
      // console.log("Session:", session);
      // console.log("User:", user);
      return session;
    },
    // async redirect({ url, baseUrl }) {
    //   //console.log("baseUrl:", baseUrl, "url:", url);
    //   if (url.startsWith("/")) return `${baseUrl}${url}`;
    //   if (new URL(url).origin === baseUrl) return url;
    //   return baseUrl; //if conditions are not met fallback to baseUrl
    // },
    async jwt({ token, account }) {
      //console.log("Token:", token);
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
      clientId: process.env.GOOGLE_CLIENT_ID! as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET! as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid profile email",
        }
      },
      profile(profile) {
        //console.log("Google Profile:", profile);
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
      accessTokenUrl: process.env.NEXTAUTH_URL,
      wellKnown: "https://accounts.google.com/.well-known/openid-configuration",
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
  session: {
    updateAge :86400
  },
  secret: process.env.AUTH_SECRET,

  debug:true
  //debug: process.env.NODE_ENV === "development",
} satisfies NextAuthOptions;