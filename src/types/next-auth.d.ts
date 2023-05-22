import NextAuth, { DefaultSession, JWT, DefaultUser, User } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      userId: string;
      email: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    email: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string; s
    email: string;
  }
}