import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./db";
import { getPassword, isValidEmail, normalizeEmail } from "./auth-validation";
import { verifyPassword } from "./password";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { AdapterAccount, AdapterUser } from "next-auth/adapters";

const oneDayInSeconds = 24 * 60 * 60;
const thirtyDaysInSeconds = 30 * oneDayInSeconds;
const providerLabels: Record<string, string> = {
  credentials: "email and password",
  github: "GitHub",
  google: "Google",
};

export const authOptions = {
  adapter: {
    ...PrismaAdapter(prisma),
    // Ensure linked OAuth accounts always resolve to users with a usable email.
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
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "credentials") return true;
      if (!profile?.email) return false;

      const email = normalizeEmail(profile.email);
      const existingUser = await prisma.user.findUnique({
        where: { email },
        select: {
          accounts: {
            select: {
              provider: true,
            },
          },
          passwordHash: true,
        },
      });

      const linkedProviders = existingUser?.accounts.map(({ provider }) => provider) ?? [];

      if (existingUser && account?.provider && !linkedProviders.includes(account.provider)) {
        const originalProvider = linkedProviders[0] ?? (existingUser.passwordHash ? "credentials" : "another provider");
        const providerLabel = providerLabels[originalProvider] ?? originalProvider;

        return `/login?authError=account-linked&provider=${encodeURIComponent(providerLabel)}`;
      }

      return true;
    },
    async session({ session, token }) {
      if (token.credentialsExpired) {
        return {
          ...session,
          user: undefined,
          expires: new Date(0).toISOString(),
        };
      }

      return session;
    },
    async jwt({ token, account, user }) {
      const now = Math.floor(Date.now() / 1000);

      if (typeof token.credentialsExpiresAt === "number" && now > token.credentialsExpiresAt) {
        return { credentialsExpired: true };
      }

      if (account) {
        token.accessToken = account.access_token;
      }

      if (account?.provider === "credentials" && user) {
        const remember = "remember" in user && user.remember === true;
        token.credentialsExpiresAt = now + (remember ? thirtyDaysInSeconds : oneDayInSeconds);
      }

      return token;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        remember: { label: "Remember me", type: "text" },
      },
      async authorize(credentials) {
        const email = normalizeEmail(credentials?.email);
        const password = getPassword(credentials?.password);
        const remember = credentials?.remember === "true";

        if (!isValidEmail(email) || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            passwordHash: true,
          },
        });

        if (!user?.passwordHash) {
          return null;
        }

        const passwordIsValid = await verifyPassword(password, user.passwordHash);

        if (!passwordIsValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          remember,
        };
      },
    }),
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
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
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
    strategy: "jwt",
    maxAge: thirtyDaysInSeconds,
    updateAge: oneDayInSeconds,
  },
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthOptions;
