import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const trainerEmails = (process.env.TRAINER_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "database" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    // Lets someone whose User row was created ahead of time without a Google
    // login (e.g. an admin manually registering them for a training via
    // createManualReserva) sign in with Google on first attempt instead of
    // hitting OAuthAccountNotLinked. Google verifies the email itself, so
    // linking on a matching, verified email is safe without resorting to the
    // provider-wide allowDangerousEmailAccountLinking flag.
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google" || !user.email) return true;
      if (profile && "email_verified" in profile && !profile.email_verified) {
        return true;
      }

      const email = user.email.toLowerCase();
      const existingUser = await prisma.user.findUnique({
        where: { email },
        include: { accounts: { where: { provider: "google" } } },
      });

      if (existingUser && existingUser.accounts.length === 0) {
        await prisma.account.create({
          data: {
            userId: existingUser.id,
            type: account.type,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            access_token: account.access_token,
            refresh_token: account.refresh_token,
            expires_at: account.expires_at,
            token_type: account.token_type,
            scope: account.scope,
            id_token: account.id_token,
            session_state: account.session_state as string | undefined,
          },
        });
      }

      return true;
    },
    async session({ session, user }) {
      const dbUser = user as unknown as { id: string; role: Role };
      session.user.id = dbUser.id;
      session.user.role = dbUser.role;
      return session;
    },
  },
  events: {
    async signIn({ user, profile }) {
      // Keep the user's image in sync with their current Google profile picture
      // on every login, so a stale URL in the DB never shows a broken avatar.
      if (user.id && profile?.picture) {
        await prisma.user.update({
          where: { id: user.id },
          data: { image: profile.picture },
        });
      }
    },
    // Fires once, right after the Prisma adapter persists a brand-new User row
    // (this person's first-ever sign-in). Whoever's email is in ADMIN_EMAILS at
    // that moment becomes ADMIN automatically. If an email is added to
    // ADMIN_EMAILS after that person already has a User row, this won't fire
    // again — promote them manually from /panel/admin/usuarios instead.
    async createUser({ user }) {
      if (!user.email) return;

      const email = user.email.toLowerCase();
      let role: Role | null = null;

      if (adminEmails.includes(email)) {
        role = "ADMIN";
      } else if (trainerEmails.includes(email)) {
        role = "TRAINER";
      }

      if (role) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role },
        });
      }
    },
  },
});
