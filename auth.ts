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
    async session({ session, user }) {
      const dbUser = user as unknown as { id: string; role: Role };
      session.user.id = dbUser.id;
      session.user.role = dbUser.role;
      return session;
    },
  },
  events: {
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
